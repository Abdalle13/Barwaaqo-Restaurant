# 🍽️ Restaurant Management System

A full-stack web application for managing restaurant operations efficiently.  
This system allows admins and users to manage orders, view menus, and handle user roles.

---

## 🚀 Features

- **User Roles**:
  - Admin: Can manage orders, menu, and users.
  - User: Can view menu and place orders.
- **CRUD Operations**:
  - Create, Read, Update, Delete orders.
  - Manage menu items.
- **Authentication & Authorization**:
  - Secure login with JWT tokens.
  - Role-based access control (Admin/User).
- **Dashboard**:
  - Admin dashboard with sidebar navigation.
  - Order management panel.
- **Responsive Design**:
  - Works on desktop and mobile devices.

---

## 🧰 Tech Stack

### Backend (Current Phase)
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend (Next Phase)
- React.js
- React Router
- Fetch API
- Tailwind CSS / Bootstrap

---

## 📁 Folder Structure

restaurant-management-system/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── config/
│ ├── app.js
│ ├── server.js
│ └── package.json
├── frontend/ # (Will be added later)
├── README.md
└── .gitignore

---


---

## 👥 Team Workflow

### Branches
- `main` → Stable / production-ready (protected)
- `dev` → Development
- `feature-*` → Individual features

Examples:
- feature-auth
- feature-orders
- feature-dashboard

### Rules
- ❌ No direct push to `main`
- ✅ Always create a feature branch
- ✅ Open Pull Requests (PR)
- ✅ Admin reviews & merges
