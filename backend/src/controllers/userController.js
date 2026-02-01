const User = require('../models/User');

// @desc    GET All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('role', 'name');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    GET Single User (Admin Only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('role');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User-ka lama helin' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    DELETE User (Admin Only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User-ka lama helin' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Iskama tirtiri kartid naftaada'
      });
    }

    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: 'User-ka waa la tirtiray si guul leh'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    UPDATE My Profile (Customer / Admin)
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User lama helin' });
    }

    // Update fields if they exist in the request body
    user.name = req.body.name ?? user.name;
    user.phone = req.body.phone ?? user.phone;

    // Handle image upload path
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // CRITICAL: Re-fetch and populate so Flutter gets the EMAIL and ROLE back
    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate('role');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};