const express = require('express');
const cors = require('cors');
const path = require('path');

// Soo daji Middleware-ka
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// --- 1. Middleware ---
app.use(cors());  // Waxay u ogolaanaysaa Flutter-ka inuu la hadlo API-ga
app.use(express.json()); // Inuu fahmo xogta JSON-ka ah ee ka timaada frontend-ka
app.use(express.urlencoded({ extended: true }));

// Folder-ka sawirada (Uploads) ka dhig mid dadka oo dhan u furan
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 2. Soo daji Routes-ka ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // Midkan waa muhiim
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const roleRoutes = require('./routes/roleRoutes');       // Routes-ka Roles
const permissionRoutes = require('./routes/permissionRoutes'); // Routes-ka Permissions

// --- 3. Isticmaal Routes-ka ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes); 

// --- 4. Error Handling (Waa inuu ahaado kan ugu dambeeya) ---
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
  res.send('Dhadhan Wanag RBAC Restaurant System API is running...');
});

module.exports = app;