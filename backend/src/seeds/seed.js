const path = require('path');
// Waxaan u sheegaynaa inuu labo folder dib u laabto (src iyo seeds) si uu u helo .env
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const { PERMISSIONS, ROLES } = require('../seeds/constants');

const seedData = async () => {
  try {
    // Tijaabo: Ma akhrinayaa .env?
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI lagama helin file-ka .env. Hubi in file-ka .env uu ku dhex jiro folder-ka 'backend'.");
    }

    console.log('Xiriirinta Database-ka...');
    await connectDB();
    console.log('Seeding started...');

    // Nadiifinta xogta hore
    await Permission.deleteMany();
    await Role.deleteMany();

    // 1. Create Permissions
    const allPermissionNames = Object.values(PERMISSIONS);
    const permissionDocs = await Promise.all(
      allPermissionNames.map(name => Permission.create({ 
        name, 
        description: `${name.replace(/_/g, ' ')} access` 
      }))
    );

    // 2. Create CUSTOMER Role
    const customerPermIds = permissionDocs
      .filter(p => ROLES.CUSTOMER.permissions.includes(p.name))
      .map(p => p._id);

    const customerRole = await Role.create({
      name: ROLES.CUSTOMER.name,
      permissions: customerPermIds
    });

    // 3. Create ADMIN Role
    const adminRole = await Role.create({
      name: ROLES.ADMIN.name,
      permissions: permissionDocs.map(p => p._id)
    });

    // 4. Create/Update Super Admin
    const adminUser = {
      name: 'Super Admin',
      email: 'admin@dhadhan.com',
      password: 'admin123', 
      role: adminRole._id,
      phone: '252610000000'
    };

    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      existingUser.name = adminUser.name;
      existingUser.role = adminUser.role;
      existingUser.phone = adminUser.phone;
      await existingUser.save();
    } else {
      await User.create(adminUser);
    }

    console.log('✅ Super Admin Ready: admin@dhadhan.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Cilad ayaa dhacday: ${error.message}`);
    process.exit(1);
  }
};

seedData();