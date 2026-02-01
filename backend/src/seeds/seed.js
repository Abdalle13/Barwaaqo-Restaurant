require('dotenv').config();

const connectDB = require('../config/db');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const { PERMISSIONS, ROLES } = require('../seeds/constants');



const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding started...');

    await Permission.deleteMany();
    await Role.deleteMany();

    // 1. Create Permissions
    const allPermissionNames = Object.values(PERMISSIONS);
    const permissionDocs = await Promise.all(
      allPermissionNames.map(name => Permission.create({ 
        name, 
        description: `${name.replace('_', ' ')} access` 
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
    // OGOW: Ha ku dhex hash-gareyn halkan! Model-ka User.js ayaa iskiis u hash-gareynaya.
    const adminUser = {
      name: 'Super Admin',
      email: 'admin@dhadhan.com',
      password: 'admin123', // Model-ka ayaa daryeelaya hashing-ka
      role: adminRole._id,
      phone: '252610000000'
    };

    const existingUser = await User.findOne({ email: adminUser.email });
    if (existingUser) {
      // Haddii uu jiro, password-ka si toos ah ha u update-gareyn si aan 'pre-save' loogu kicin mar labaad haddaan loo baahneyn
      existingUser.name = adminUser.name;
      existingUser.role = adminUser.role;
      existingUser.phone = adminUser.phone;
      await existingUser.save();
    } else {
      await User.create(adminUser);
    }

    console.log('Super Admin Ready: admin@dhadhan.com / admin123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();