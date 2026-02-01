const { PERMISSIONS } = require('../seeds/constants');

/**
 * Authorization Middleware
 * @param {String} requiredPermission - Permission-ka loo baahan yahay (ka yimid Constants.js)
 */
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    // 1. Hubi haddii user-ka uu xogtiisa keenay 'protect'
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        success: false, 
        message: 'Ma haysatid fasax aad ku gasho halkaan.' 
      });
    }

    // 2. Hubi permissions-ka (Safe mapping)
    const userPermissions = req.user.role.permissions ? req.user.role.permissions.map(p => p.name) : [];

    // 3. Check access
    if (userPermissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: `Lagalama ogola: Ma haysatid awoodda (${requiredPermission})`
      });
    }
  };
};

module.exports = { authorize };