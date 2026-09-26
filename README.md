# Barwaaqo Restaurant

A full-stack restaurant management system built for real-world operations.this restaurant system is  a complete platform covering customer-facing online ordering, table reservations, and a powerful admin panel — all in one system. Built with Node.js, Express, MongoDB on the backend, and Next.js with TypeScript on the frontend.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)** — Admin and Customer roles with granular permissions
- **Menu Management** — Full CRUD for food items and categories with image uploads
- **Order Management** — Place, track, and manage orders with real-time status updates
- **Admin Dashboard** — Revenue charts, sales stats, recent orders overview
- **Table & Reservation Management** — Manage tables and customer reservations
- **User Management** — Admin can view, block, and manage all users
- **JWT Authentication** — Secure login with access/refresh token pattern
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🧰 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- Helmet, Rate Limiting (security)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- CSS Modules (custom design system)
- React Query (TanStack)
- Recharts (analytics charts)
- Framer Motion (animations)

---

## 📁 Project Structure

```
restaurant-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── seeds/
│   │   └── config/
│   ├── uploads/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   └── styles/
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your MongoDB URI and JWT secret
npm run seed           # seed roles and admin user
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌿 Branch Strategy

- `main` → Production-ready code
- `feature-*` → Individual feature branches

---

## 👤 Author

Built by [Abdalle Hussein](https://github.com/Abdalle13).
