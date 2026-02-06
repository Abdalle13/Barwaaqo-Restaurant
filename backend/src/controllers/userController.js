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


// @desc    Toggle User Status (Block/Unblock)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User-ka lama helin' });
    }

    // Iska ilaali in admin-ku is block-gareeyo
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Ma block-gareyn kartid naftaada' });
    }

    // Haddii uu active ahaa ka dhig blocked, haddii uu blocked ahaa ka dhig active
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: `User-ka hadda waa ${user.status}`,
      data: user 
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