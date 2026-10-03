const User = require('../models/User');
const Role = require('../models/Role');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    const customerRole = await Role.findOne({ name: 'CUSTOMER' });
    if (!customerRole) {
      return res.status(500).json({
        success: false,
        message: 'Default customer role is missing. Please run database seeds.',
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      address: address || '',
      role: customerRole._id,
    });

    const populatedUser = await User.findById(user._id).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        phone: populatedUser.phone,
        address: populatedUser.address,
        role: populatedUser.role ? populatedUser.role.name : 'CUSTOMER',
        permissions: populatedUser.role && populatedUser.role.permissions
          ? populatedUser.role.permissions.map((p) => p.name)
          : [],
        token: generateToken(populatedUser._id),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email (no account found with this email)',
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact management.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        district: user.district || '',
        landmark: user.landmark || '',
        role: user.role ? user.role.name : 'CUSTOMER',
        permissions: user.role && user.role.permissions
          ? user.role.permissions.map((p) => p.name)
          : [],
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'role',
      populate: { path: 'permissions' },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        district: user.district || '',
        landmark: user.landmark || '',
        role: user.role ? user.role.name : 'CUSTOMER',
        permissions: user.role && user.role.permissions
          ? user.role.permissions.map((p) => p.name)
          : [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address !== undefined ? req.body.address : user.address;
    user.district = req.body.district !== undefined ? req.body.district : user.district;
    user.landmark = req.body.landmark !== undefined ? req.body.landmark : user.landmark;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        district: updatedUser.district,
        landmark: updatedUser.landmark,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password - Request reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user registered with this email address' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (uses FRONTEND_URL or default)
    const frontendUrl = process.env.FRONTEND_URL || 'https://barwaaqo-restaurant-s4nd.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested to reset the password for your Barwaaqo Restaurant account.\n\nPlease click on the following link or paste it into your browser to reset your password:\n\n${resetUrl}\n\nThis link is valid for 30 minutes. If you did not request this, please ignore this email and your password will remain unchanged.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #14100D; color: #F5F0EB; border-radius: 16px; border: 1px solid #33271F;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #D4A574; font-size: 26px; margin: 0; font-family: Georgia, serif;">Barwaaqo Restaurant</h1>
          <p style="color: #A3968C; font-size: 14px; margin-top: 6px;">Authentic Somali & Modern Dining</p>
        </div>
        
        <div style="background-color: #1E1712; padding: 24px; border-radius: 12px; border: 1px solid #3D2E24;">
          <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #C7BDB5; font-size: 14px; line-height: 1.6;">
            Hello <strong>${user.name}</strong>,<br/><br/>
            We received a request to reset the password for your account. Click the button below to choose a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #D4A574; color: #14100D; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; display: inline-block;">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #8C8077; font-size: 12px; line-height: 1.6;">
            This link is valid for <strong>30 minutes</strong>. If you did not make this request, you can safely ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid #33271F; margin: 20px 0;" />
          <p style="color: #6B6058; font-size: 11px; word-break: break-all;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #D4A574;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Barwaaqo Restaurant - Password Reset Request',
        message,
        html,
      });

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to your email successfully',
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please check your email configuration.',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password using token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid new password with at least 6 characters',
      });
    }

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token. Please request a new one.',
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};