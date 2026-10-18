const app = require('../src/app');
const connectDB = require('../src/config/db');

module.exports = async (req, res) => {
  // Ensure database is connected before handling request
  await connectDB();
  return app(req, res);
};
