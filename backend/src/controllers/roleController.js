const Role = require('../models/Role');

// @desc    Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body; // permissions waa array of IDs
    const role = await Role.create({ name, permissions });
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all roles with their permissions
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};