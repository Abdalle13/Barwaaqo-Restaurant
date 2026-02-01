// const User = require('../models/User');
// const Role = require('../models/Role');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   try {
//     const { name, email, phone, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ success: false, message: 'Email-kan hore ayaa loo isticmaalay' });

//     const customerRole = await Role.findOne({ name: 'CUSTOMER' });
//     if (!customerRole) return res.status(500).json({ success: false, message: 'Default role not found' });

//     const user = await User.create({ name, email, phone, password, role: customerRole._id });

//     res.status(201).json({
//       success: true,
//       data: { _id: user._id, name: user.name, token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }) }
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).populate({ path: 'role', populate: { path: 'permissions' } });

//     if (user && (await user.matchPassword(password))) {
//       res.json({
//         success: true,
//         data: {
//           _id: user._id, name: user.name, role: user.role.name,
//           permissions: user.role.permissions.map(p => p.name),
//           token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
//         }
//       });
//     } else {
//       res.status(401).json({ success: false, message: 'Email ama Password khaldan' });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email-kan hore ayaa loo isticmaalay' });

    const customerRole = await Role.findOne({ name: 'CUSTOMER' });
    if (!customerRole) return res.status(500).json({ success: false, message: 'Default role not found' });

    const user = await User.create({ name, email, phone, password, role: customerRole._id });

    res.status(201).json({
      success: true,
      data: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, // Lagu daray
        profileImage: user.profileImage || "", // Lagu daray
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' }) 
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Hubi in 'profileImage' ay qeyb ka tahay xogta la soo celinayo
    const user = await User.findOne({ email }).populate({ path: 'role', populate: { path: 'permissions' } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id, 
          name: user.name, 
          email: user.email, // Aad ayay muhiim u tahay UI-gaaga
          profileImage: user.profileImage || "", // TAN AYAA SAXAYSA SAWIRO LUMINYA
          role: user.role.name,
          permissions: user.role.permissions.map(p => p.name),
          token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Email ama Password khaldan' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};