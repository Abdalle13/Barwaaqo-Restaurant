require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const roleRoutes = require("./src/routes/roleRoutes");
const userRoutes = require("./src/routes/userRoutes");
const menuRoutes = require("./src/routes/menuRoutes");
const permissionRoutes = require("./src/routes/permissionRoutes");
const rolePermissionRoutes = require("./src/routes/rolePermissionRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("Restaurent-Management-System API is running"));

app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/role-permissions", rolePermissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
