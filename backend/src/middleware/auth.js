const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Soo saar user-ka oo wata Roles iyo Permissions (RBAC-ga dartiis)
      req.user = await User.findById(decoded.id).populate({
        path: 'role',
        populate: { path: 'permissions' }
      });

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User-ka lama helin' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Token-ku waa khalad ama wuu dhacay' });
    }
  } else {
    // Haddii aan Token-ka la soo dirin gabi ahaanba
    return res.status(401).json({ success: false, message: 'Ma haysatid Token, fadlan Login dheh' });
  }
};

module.exports = { protect };