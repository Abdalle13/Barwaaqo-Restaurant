/**
 * System roles and their associated permissions for Barwaaqo Restaurant
 */

// 1. Permission constants
const PERMISSIONS = {
  // Role & Permission Management
  MANAGE_ROLES: 'manage_roles',

  // User Management & Profile
  VIEW_USERS: 'view_users',
  DELETE_USER: 'delete_user',
  UPDATE_PROFILE: 'update_profile',

  // Food Management
  VIEW_FOOD: 'view_food',
  CREATE_FOOD: 'create_food',
  UPDATE_FOOD: 'update_food',
  DELETE_FOOD: 'delete_food',

  // Category Management
  VIEW_CATEGORIES: 'view_categories',
  CREATE_CATEGORY: 'create_category',
  UPDATE_CATEGORY: 'update_category',
  DELETE_CATEGORY: 'delete_category',

  // Order Management
  CREATE_ORDER: 'create_order',
  VIEW_MY_ORDERS: 'view_my_orders',
  VIEW_ALL_ORDERS: 'view_all_orders',
  UPDATE_ORDER_STATUS: 'update_order_status',

  // Table & Reservation Management
  MANAGE_TABLES: 'manage_tables',
  MANAGE_RESERVATIONS: 'manage_reservations',
  CREATE_RESERVATION: 'create_reservation',
  VIEW_MY_RESERVATIONS: 'view_my_reservations',

  // Settings & Analytics
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_DASHBOARD: 'view_dashboard',
};

// 2. Define standard roles and permissions
const ROLES = {
  ADMIN: {
    name: 'ADMIN',
    description: 'Full administrative access to the restaurant management system',
    permissions: Object.values(PERMISSIONS),
  },
  CUSTOMER: {
    name: 'CUSTOMER',
    description: 'Default role for registered diners and customers',
    permissions: [
      PERMISSIONS.VIEW_FOOD,
      PERMISSIONS.VIEW_CATEGORIES,
      PERMISSIONS.CREATE_ORDER,
      PERMISSIONS.VIEW_MY_ORDERS,
      PERMISSIONS.CREATE_RESERVATION,
      PERMISSIONS.VIEW_MY_RESERVATIONS,
      PERMISSIONS.UPDATE_PROFILE,
    ],
  },
};

/**
 * Helper function to check if a user's role has a specific permission
 */
const hasPermission = (userPermissions, requiredPermission) => {
  return Array.isArray(userPermissions) && userPermissions.includes(requiredPermission);
};

module.exports = {
  ROLES,
  PERMISSIONS,
  hasPermission,
};
