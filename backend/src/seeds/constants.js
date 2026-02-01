/**
 * System roles and their associated permissions
 */

// 1. Permission types - Wax kasta oo laga qaban karo System-ka
const PERMISSIONS = {
  // Role & Permission Management
  MANAGE_ROLES: 'manage_roles', // Admin can add roles/permissions

  // User Management & profile
  VIEW_USERS: 'view_users',  // Admin can see all users
  DELETE_USER: 'delete_user',  // Admin can delete users
  UPDATE_PROFILE: 'update_profile',  // Anyone can update their own profile

   // Food management
  VIEW_FOOD: 'view_food',       // Everyone can see food items
  CREATE_FOOD: 'create_food',  // Admin can add new food items
  UPDATE_FOOD: 'update_food',  // Admin can edit food items
  DELETE_FOOD: 'delete_food',  // Admin can delete food items

  // Category management
  VIEW_CATEGORIES: 'view_categories',   // Everyone can see categories
  CREATE_CATEGORY: 'create_category',  // Admin can add new categories
  UPDATE_CATEGORY: 'update_category',  // Admin can edit categories
  DELETE_CATEGORY: 'delete_category',  // Admin can delete categories

// Order Management
  CREATE_ORDER: 'create_order', // Customers can place orders
  VIEW_MY_ORDERS: 'view_my_orders',  // Customers can view their own orders
  VIEW_ALL_ORDERS: 'view_all_orders',  // Admin can view all orders
  UPDATE_ORDER_STATUS: 'update_order_status',  // Admin can update order status
};

// 2. Define roles and their permissions
const ROLES = {
  ADMIN: {
    name: 'ADMIN',
    description: 'Full system access',
    // Admin wuxuu access u leeyahay dhamaan permissions-ka kor ku xusan
    permissions: Object.values(PERMISSIONS) 
  },
  CUSTOMER: {
    name: 'CUSTOMER',
    permissions: [
      PERMISSIONS.VIEW_FOOD,
      PERMISSIONS.VIEW_CATEGORIES,
      PERMISSIONS.CREATE_ORDER,
      PERMISSIONS.VIEW_MY_ORDERS,
      PERMISSIONS.UPDATE_PROFILE
    ]
  }
};

/**
 * Helper function to check if a user's role has a specific permission.
 * Midkan waxaan u isticmaali doonaa Authorize Middleware-ka.
 */
const hasPermission = (userPermissions, requiredPermission) => {
  return userPermissions.includes(requiredPermission);
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission
};


