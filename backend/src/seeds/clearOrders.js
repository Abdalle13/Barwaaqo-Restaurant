const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Order = require('../models/Order');

const clearOrders = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected!');

    // Delete seeded orders
    const result = await Order.deleteMany({ notes: 'SEEDED_DEMO_ORDER' });
    console.log(`Successfully deleted ${result.deletedCount} demo orders!`);

    // Print remaining orders
    const remaining = await Order.countDocuments();
    console.log(`Remaining original orders in database: ${remaining}`);

    process.exit(0);
  } catch (err) {
    console.error('Error clearing demo orders:', err);
    process.exit(1);
  }
};

clearOrders();
