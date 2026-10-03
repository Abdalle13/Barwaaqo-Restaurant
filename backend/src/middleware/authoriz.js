const { PERMISSIONS, ROLES } = require('../seeds/constants');

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

    const roleName = typeof req.user.role === 'object' ? req.user.role.name : req.user.role;

    // ADMIN has full access to all endpoints
    if (roleName === 'ADMIN' || roleName === 'SUPER_ADMIN') {
      return next();
    }

    // Default permissions for CUSTOMER role
    if (roleName === 'CUSTOMER' && ROLES.CUSTOMER?.permissions?.includes(requiredPermission)) {
      return next();
    }

    // 2. Hubi permissions-ka (Safe mapping: works with populated objects and string IDs/names)
    const userPermissions = Array.isArray(req.user.role.permissions)
      ? req.user.role.permissions.map((p) => {
          if (typeof p === 'object' && p !== null && p.name) return p.name;
          if (typeof p === 'string') return p;
          return '';
        })
      : [];

    // 3. Check access
    if (userPermissions.includes(requiredPermission)) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: `Lagalama ogola: Ma haysatid awoodda (${requiredPermission})`
    });
  };
};

module.exports = { authorize };