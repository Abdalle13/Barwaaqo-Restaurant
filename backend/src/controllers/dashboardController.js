const Order = require('../models/Order');
const Food = require('../models/Food');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/dashboard/stats
exports.getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Xisaabinta Iibka (Kaliya kuwa dhamaystirmay)
    const salesData = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } }
    ]);

    // 2. Dalabaadka hadda furan (Pending ama Processing)
    const activeOrdersCount = await Order.countDocuments({
      status: { $in: ['Pending', 'Processing'] }
    });

    // 3. Dalabaadka cusub (24-kii saac ee u dambeeyay)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newOrdersCount = await Order.countDocuments({
      createdAt: { $gte: twentyFourHoursAgo }
    });

    // 4. Tirada cuntada ku jirta Menu-ka
    const totalItemsCount = await Food.countDocuments();

    // 5. Dalabaadkii ugu dambeeyay (oo leh magaca macmiilka iyo cuntada)
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .populate('items.food', 'name') // Tan ku dar si Recent Orders ay magaca cuntada u muujiyaan
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        // Waxaan u soo celinaynaa Number ahaan si Flutter uusan u crash gareyn
        totalSales: salesData.length > 0 ? salesData[0].totalSales : 0,
        activeOrders: activeOrdersCount,
        newOrders: newOrdersCount,
        totalItems: totalItemsCount,
        recentOrders: recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};