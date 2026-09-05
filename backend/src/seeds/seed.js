const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const Category = require('../models/Category');
const Food = require('../models/Food');
const Table = require('../models/Table');
const Settings = require('../models/Settings');
const { PERMISSIONS, ROLES } = require('../seeds/constants');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();
    console.log('Database connected successfully!');

    // 1. Reset Permissions & Roles
    console.log('Seeding Permissions & Roles...');
    await Permission.deleteMany();
    await Role.deleteMany();

    const allPermissionNames = Object.values(PERMISSIONS);
    const permissionDocs = await Promise.all(
      allPermissionNames.map((name) =>
        Permission.create({
          name,
          description: `${name.replace(/_/g, ' ')} access`,
        })
      )
    );

    // Create CUSTOMER Role
    const customerPermIds = permissionDocs
      .filter((p) => ROLES.CUSTOMER.permissions.includes(p.name))
      .map((p) => p._id);

    const customerRole = await Role.create({
      name: ROLES.CUSTOMER.name,
      description: ROLES.CUSTOMER.description,
      permissions: customerPermIds,
    });

    // Create ADMIN Role
    const adminRole = await Role.create({
      name: ROLES.ADMIN.name,
      description: ROLES.ADMIN.description,
      permissions: permissionDocs.map((p) => p._id),
    });

    // 2. Create Admin & Demo Customer User
    console.log('Seeding Users...');
    const adminUser = {
      name: 'Restaurant Admin',
      email: 'admin@barwaaqo.com',
      password: 'admin123456',
      role: adminRole._id,
      phone: '+252610000000',
      address: 'KM4 Maka Al-Mukarama, Mogadishu',
      status: 'active',
    };

    await User.deleteOne({ email: adminUser.email });
    await User.create(adminUser);

    const demoCustomer = {
      name: 'Hassan Ali',
      email: 'customer@barwaaqo.com',
      password: 'customer123456',
      role: customerRole._id,
      phone: '+252615555555',
      address: 'Waberi District, Mogadishu',
      status: 'active',
    };

    await User.deleteOne({ email: demoCustomer.email });
    await User.create(demoCustomer);

    // 3. Seed Default Restaurant Settings
    console.log('Seeding Settings...');
    await Settings.deleteMany();
    await Settings.create({
      restaurantName: 'Barwaaqo Restaurant',
      tagline: 'Modern Dining & Authentic Flavors',
      currency: 'USD',
      currencySymbol: '$',
      taxPercentage: 5,
      deliveryFee: 2.0,
      contactEmail: 'contact@barwaaqorestaurant.com',
      contactPhone: '+252 61 0000000',
      address: 'KM4 Maka Al-Mukarama Rd, Mogadishu, Somalia',
      openingHours: 'Mon - Sun: 08:00 AM - 11:00 PM',
      allowReservations: true,
      allowOnlineOrders: true,
    });

    // 4. Seed Dining Tables
    console.log('Seeding Tables...');
    await Table.deleteMany();
    await Table.create([
      { tableNumber: 'T-01', capacity: 2, location: 'Window Side', status: 'Available' },
      { tableNumber: 'T-02', capacity: 4, location: 'Main Hall', status: 'Available' },
      { tableNumber: 'T-03', capacity: 4, location: 'Main Hall', status: 'Available' },
      { tableNumber: 'T-04', capacity: 6, location: 'Outdoor Patio', status: 'Available' },
      { tableNumber: 'T-05', capacity: 8, location: 'VIP Room', status: 'Available' },
      { tableNumber: 'T-06', capacity: 4, location: 'Terrace', status: 'Available' },
    ]);

    // 5. Seed Menu Categories
    console.log('Seeding Categories...');
    await Category.deleteMany();
    const categories = await Category.create([
      { name: 'Traditional Somali' },
      { name: 'Main Dishes' },
      { name: 'Grill & BBQ' },
      { name: 'Appetizers & Starters' },
      { name: 'Beverages & Juices' },
      { name: 'Desserts' },
    ]);

    const catMap = {};
    categories.forEach((c) => {
      catMap[c.name] = c._id;
    });

    // 6. Seed Delicious Dishes
    console.log('Seeding Food Menu...');
    await Food.deleteMany();
    await Food.create([
      {
        name: 'Bariis Iskukaris with Hilib Ari',
        description: 'Fragrant spiced basmati rice slow-cooked with tender roasted goat meat, served with sliced banana and homemade basbaas chutney.',
        price: 12.50,
        discount: 10,
        category: catMap['Traditional Somali'],
        status: 'Available',
        preparationTime: 25,
        isPopular: true,
        rating: 4.9,
        numReviews: 48,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Baasto Salbuko (Classic Somali Pasta)',
        description: 'Rich tomato-simmered spaghetti with finely diced steak pieces, aromatic Somali xawaash spices, cilantro, and freshly cut lime.',
        price: 9.50,
        discount: 0,
        category: catMap['Traditional Somali'],
        status: 'Available',
        preparationTime: 20,
        isPopular: true,
        rating: 4.8,
        numReviews: 35,
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281561?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Grilled Beef Suqaar Platter',
        description: 'Tender cubes of prime beef stir-fried with bell peppers, sweet onions, and garlic. Served with choice of flatbread (canjeero) or rice.',
        price: 11.00,
        discount: 5,
        category: catMap['Grill & BBQ'],
        status: 'Available',
        preparationTime: 18,
        isPopular: true,
        rating: 4.7,
        numReviews: 29,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Crispy Sambusa Trio',
        description: 'Golden, crispy pastry triangles stuffed with seasoned spiced beef, scallions, and herbs. Accompanied by tangy cilantro dip.',
        price: 4.50,
        discount: 0,
        category: catMap['Appetizers & Starters'],
        status: 'Available',
        preparationTime: 12,
        isPopular: true,
        rating: 4.9,
        numReviews: 62,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Fresh Mango & Passion Fruit Cocktail',
        description: 'Chilled all-natural fresh tropical mango puree layered with passion fruit pulp and a splash of lime juice.',
        price: 3.50,
        discount: 0,
        category: catMap['Beverages & Juices'],
        status: 'Available',
        preparationTime: 5,
        isPopular: false,
        rating: 4.6,
        numReviews: 19,
        image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Somali Spiced Shaah (Cardamom Tea)',
        description: 'Authentic black tea brewed with whole cardamom pods, cinnamon bark, cloves, ginger, and condensed creamy milk.',
        price: 2.50,
        discount: 0,
        category: catMap['Beverages & Juices'],
        status: 'Available',
        preparationTime: 5,
        isPopular: true,
        rating: 5.0,
        numReviews: 88,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Honey Glazed Halwa Bites',
        description: 'Warm, fragrant homemade halwa infused with nutmeg, saffron, and cardamom, garnished with toasted sliced almonds.',
        price: 5.00,
        discount: 0,
        category: catMap['Desserts'],
        status: 'Available',
        preparationTime: 10,
        isPopular: false,
        rating: 4.8,
        numReviews: 22,
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
      },
    ]);

    console.log('\n========================================');
    console.log('🎉 BARWAAQO RESTAURANT SEEDING COMPLETE!');
    console.log('========================================');
    console.log('👑 Admin Login:    admin@barwaaqo.com    / admin123456');
    console.log('👤 Customer Login: customer@barwaaqo.com / customer123456');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();