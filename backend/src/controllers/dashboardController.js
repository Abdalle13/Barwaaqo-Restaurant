const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

// @desc    Get Overall Admin Dashboard Stats
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Total Completed Sales
    const salesData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);

    // 2. Active Orders (Pending, Processing, Out for Delivery)
    const activeOrdersCount = await Order.countDocuments({
      status: { $in: ['Pending', 'Processing', 'Out for Delivery'] },
    });

    // 3. New Orders placed within last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newOrdersCount = await Order.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo },
    });

    // 4. Total Menu Dishes
    const totalItemsCount = await Food.countDocuments({ isDeleted: false });

    // 5. Total Customers
    const totalCustomersCount = await User.countDocuments();

    // 6. Tables & Pending Reservations
    const totalTables = await Table.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'Pending' });

    // 7. Recent 5 Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.food', 'name image price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalSales: salesData.length > 0 ? salesData[0].totalSales : 0,
        activeOrders: activeOrdersCount,
        newOrders: newOrdersCount,
        totalItems: totalItemsCount,
        totalCustomers: totalCustomersCount,
        totalTables,
        pendingReservations,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get 7-day Revenue & Order Volume for Recharts
// @route   GET /api/dashboard/revenue-chart
// @access  Private (Admin)
exports.getRevenueChartData = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const dailyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format into clean 7-day structure so chart always has 7 consecutive days
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const found = dailyStats.find((item) => item._id === dateString);
      chartData.push({
        date: dateString,
        day: dayName,
        revenue: found ? Math.round(found.revenue * 100) / 100 : 0,
        orders: found ? found.orders : 0,
      });
    }

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Top 5 Best Selling Foods
// @route   GET /api/dashboard/top-foods
// @access  Private (Admin)
exports.getTopSellingFoods = async (req, res) => {
  try {
    const topFoods = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.food',
          totalOrdered: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'foods',
          localField: '_id',
          foreignField: '_id',
          as: 'foodDetails',
        },
      },
      { $unwind: '$foodDetails' },
      {
        $project: {
          _id: 1,
          name: '$foodDetails.name',
          image: '$foodDetails.image',
          price: '$foodDetails.price',
          totalOrdered: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topFoods,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};