export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  district?: string;
  landmark?: string;
  role: string;
  permissions?: string[];
  status?: string;
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface Food {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  image?: string;
  category: Category | string;
  status: 'Available' | 'Low Stock' | 'Out of Stock';
  preparationTime?: number;
  isPopular?: boolean;
  rating?: number;
  numReviews?: number;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface CartItem {
  food: Food;
  quantity: number;
  price: number;
  selectedProtein?: string;
  selectedAddons?: string[];
  specialInstructions?: string;
}

export interface OrderItem {
  food: Food | { _id: string; name: string; image?: string; price: number };
  name?: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderId: string;
  user: User | { _id: string; name: string; email: string; phone: string };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceTax: number;
  totalAmount: number;
  orderType?: 'DELIVERY' | 'TAKEAWAY' | 'DINE_IN';
  table?: Table | { _id: string; tableNumber: string; location?: string; capacity?: number };
  transactionId?: string;
  district?: string;
  landmark?: string;
  shippingAddress: string;
  paymentMethod: 'evc_plus' | 'edahab' | 'pay_on_delivery' | 'cash_on_delivery';
  paymentPhone: string;
  alternativePhone?: string;
  assignedDeliveryBoy?: any;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'Pending' | 'Processing' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  notes?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  createdAt: string;
}

export interface Table {
  _id: string;
  tableNumber: string;
  capacity: number;
  location: 'Main Hall' | 'Terrace' | 'VIP Room' | 'Window Side' | 'Outdoor Patio';
  status: 'Available' | 'Occupied' | 'Reserved';
  notes?: string;
}

export interface Reservation {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  guests: number;
  reservationDate: string;
  reservationTime: string;
  table?: Table;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  createdAt?: string;
}

export interface Settings {
  _id?: string;
  restaurantName: string;
  tagline: string;
  currency: string;
  currencySymbol: string;
  taxPercentage: number;
  deliveryFee: number;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openingHours: string;
  allowReservations: boolean;
  allowOnlineOrders: boolean;
}

export interface DashboardStats {
  totalSales: number;
  activeOrders: number;
  completedOrders: number;
  newOrders: number;
  totalItems: number;
  totalCustomers: number;
  totalTables: number;
  pendingReservations: number;
  recentOrders: Order[];
}

export interface RevenueChartItem {
  date: string;
  day: string;
  revenue: number;
  orders: number;
}

export interface TopFoodItem {
  _id: string;
  name: string;
  image?: string;
  price: number;
  totalOrdered: number;
  totalRevenue: number;
}
