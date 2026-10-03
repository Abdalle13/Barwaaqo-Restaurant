const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get all staff (Users except CUSTOMER)
// @route   GET /api/staff
// @access  Private/Admin
const getAllStaff = async (req, res) => {
  try {
    const customerRole = await Role.findOne({ name: 'CUSTOMER' });
    
    // Find all users who are NOT customers
    const staff = await User.find({ role: { $ne: customerRole._id } })
      .populate('role', 'name description')
      .select('-password');
      
    res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create new staff
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      roleName,
      phone,
      address,
      status,
      vehicleType,
      plateNumber,
      emergencyContactName,
      emergencyContactPhone,
    } = req.body;

    const role = await Role.findOne({ name: roleName || 'DELIVERY' });
    if (!role) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role._id,
      phone,
      address: address || '',
      status: status || 'active',
      vehicleType: vehicleType || 'None',
      plateNumber: plateNumber || '',
      emergencyContactName: emergencyContactName || '',
      emergencyContactPhone: emergencyContactPhone || '',
    });

    const userResponse = await User.findById(user._id).select('-password').populate('role', 'name');

    res.status(201).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      roleName,
      phone,
      address,
      status,
      vehicleType,
      plateNumber,
      emergencyContactName,
      emergencyContactPhone,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Will be hashed by pre-save hook
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (status) user.status = status;
    if (vehicleType !== undefined) user.vehicleType = vehicleType;
    if (plateNumber !== undefined) user.plateNumber = plateNumber;
    if (emergencyContactName !== undefined) user.emergencyContactName = emergencyContactName;
    if (emergencyContactPhone !== undefined) user.emergencyContactPhone = emergencyContactPhone;

    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (role) user.role = role._id;
    }

    await user.save();
    const updatedUser = await User.findById(req.params.id).select('-password').populate('role', 'name');

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
