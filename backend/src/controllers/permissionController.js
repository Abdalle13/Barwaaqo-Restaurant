const Permission = require('../models/Permission');

// @desc    Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const permission = await Permission.create({ name, description });
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all permissions
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};