const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).populate({
        path: 'role',
        populate: { path: 'permissions' }
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User-ka lama helin' });
      }

      
      if (req.user.status === 'blocked') {
        return res.status(403).json({ 
          success: false, 
          message: 'Account-kaaga waa la xannibay (Blocked). Fadlan la xiriir maamulka.' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token-ku waa khalad ama wuu dhacay' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Ma haysatid Token, fadlan Login dheh' });
  }
};

module.exports = { protect };