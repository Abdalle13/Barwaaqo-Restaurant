const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Order = require('../models/Order');
const Food = require('../models/Food');
const User = require('../models/User');

const seedOrders = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected!');

    // Fetch existing foods and users
    const foods = await Food.find({ isDeleted: false });
    const users = await User.find();

    if (foods.length === 0 || users.length === 0) {
      console.error('Error: Please make sure foods and users exist before seeding orders.');
      process.exit(1);
    }

    console.log(`Found ${foods.length} foods and ${users.length} users.`);

    // Clear any previous demo seeded orders first
    const deletedPrev = await Order.deleteMany({ notes: 'SEEDED_DEMO_ORDER' });
    console.log(`Cleared ${deletedPrev.deletedCount} previous demo orders.`);

    // Days distribution (6 days ago through today)
    // Daily target amounts: [Mon: ~$320, Tue: ~$280, Wed: ~$410, Thu: ~$480, Fri: ~$590, Sat: ~$720, Sun: ~$510]
    const ordersToInsert = [];
    const districts = ['Hodan', 'Waberi', 'Howlwadaag', 'Hamar Weyne', 'Boondheere'];
    const paymentMethods = ['evc_plus', 'edahab', 'cash_on_delivery'];

    let orderCounter = 1000;

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      // Determine how many orders for this day (between 5 and 9 orders per day)
      const orderCountForDay = 5 + Math.floor(Math.random() * 4);
      
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - dayOffset);

      for (let j = 0; j < orderCountForDay; j++) {
        orderCounter++;
        const randomHour = 11 + Math.floor(Math.random() * 11); // between 11 AM and 10 PM
        const randomMinute = Math.floor(Math.random() * 60);
        
        const orderDate = new Date(targetDate);
        orderDate.setHours(randomHour, randomMinute, 0, 0);

        // Pick 1 to 3 random foods
        const itemCount = 1 + Math.floor(Math.random() * 3);
        const orderItems = [];
        let subtotal = 0;

        for (let k = 0; k < itemCount; k++) {
          const randomFood = foods[Math.floor(Math.random() * foods.length)];
          const qty = 1 + Math.floor(Math.random() * 2);
          const price = randomFood.price || 12;
          orderItems.push({
            food: randomFood._id,
            name: randomFood.name,
            quantity: qty,
            price: price,
          });
          subtotal += price * qty;
        }

        const deliveryFee = 2.0;
        const serviceTax = Math.round(subtotal * 0.05 * 100) / 100;
        const totalAmount = Math.round((subtotal + deliveryFee + serviceTax) * 100) / 100;

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const isToday = dayOffset === 0;

        // If today and late order, some might be Processing or Pending, otherwise Completed
        let status = 'Completed';
        if (isToday && j === orderCountForDay - 1) {
          status = 'Pending';
        } else if (isToday && j === orderCountForDay - 2) {
          status = 'Processing';
        }

        ordersToInsert.push({
          user: randomUser._id,
          orderId: `BW-${orderCounter}`,
          items: orderItems,
          subtotal,
          deliveryFee,
          serviceTax,
          totalAmount,
          orderType: j % 3 === 0 ? 'DINE_IN' : j % 3 === 1 ? 'DELIVERY' : 'TAKEAWAY',
          shippingAddress: `${districts[j % districts.length]}, Maka Al-Mukarama St, House #${10 + j}`,
          district: districts[j % districts.length],
          landmark: 'Near KM4 Junction',
          paymentMethod: paymentMethods[j % paymentMethods.length],
          paymentPhone: '+252 61 ' + Math.floor(1000000 + Math.random() * 9000000),
          paymentStatus: status === 'Completed' ? 'Paid' : 'Pending',
          status: status,
          isDelivered: status === 'Completed',
          deliveredAt: status === 'Completed' ? orderDate : null,
          notes: 'SEEDED_DEMO_ORDER',
          createdAt: orderDate,
          updatedAt: orderDate,
        });
      }
    }

    console.log(`Inserting ${ordersToInsert.length} realistic orders across the past 7 days...`);
    await Order.insertMany(ordersToInsert);

    // Calculate total revenue generated
    const totalRev = ordersToInsert
      .filter((o) => o.status === 'Completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    console.log(`Successfully seeded ${ordersToInsert.length} orders!`);
    console.log(`Total Completed Revenue: $${totalRev.toFixed(2)}`);
    console.log('You can clear these anytime by running: npm run orders:clear');

    process.exit(0);
  } catch (err) {
    console.error('Error seeding orders:', err);
    process.exit(1);
  }
};

seedOrders();
