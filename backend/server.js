require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

// 1. Connect to Database
connectDB();

// 2. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/`);
});