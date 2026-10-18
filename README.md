# 🍽️ Barwaaqo Restaurant Management System

> **A complete, production-ready full-stack restaurant platform** online ordering, live order tracking, table reservations, point-of-sale, and a powerful multi-role admin dashboard. Built with authentic Somali fine dining in mind.
---

## 📸 Overview

Barwaaqo is a **full-stack monorepo** covering every aspect of a modern restaurant business:

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Vanilla CSS with a custom design system (dark/light mode) |
| Backend | Node.js + Express.js REST API |
| Database | MongoDB + Mongoose ODM |
| Image Hosting | ImageKit CDN |
| Email | Nodemailer (SMTP) |
| Authentication | JWT Access + Refresh Tokens (HTTP-only cookies) |
| Deployment | Vercel (Frontend) + Railway/Render (Backend) |

---

## ✨ Features

### 👥 Customer Portal
- **Home Page** — Hero section, 4 admin-selected Signature Dishes, restaurant experience pillars, testimonials, private dining CTA
- **Menu Page** — Full menu with category filtering, search, pagination (scroll-to-top), and food detail modal
- **Food Detail Modal** — Smart customization: protein selection, Somali extras & sides for main dishes; dessert toppings; drink add-ons — auto-detected by category
- **Shopping Cart** — Add, update, remove items with live total calculation
- **Checkout** — Delivery details, EVC Plus (Hormuud) / eDahab (Dahabshiil) / Pay on Delivery payment options
- **My Orders** — Responsive order dashboard with stats cards (Total, Active, Delivered, Spent), filter tabs, search, order cards with items list, live Track Order modal, and Reorder
- **Order Tracking** — Live status modal showing Pending → In Kitchen → On the Way → Delivered
- **Reservations** — Table booking with date, time, and party size selection
- **About Page** — Restaurant story, team, and values
- **Contact Page** — Message form with direct inquiry system
- **Delivery Page** — Delivery zones and information

### 🔐 Authentication
- Register & Login with JWT (access + refresh token)
- **Forgot Password** — Email link with secure time-limited reset token
- **Reset Password** — Token-verified password update page
- Role-based redirects (Customer → Home, Admin → Dashboard, Receptionist → Receptionist Panel, Delivery → Delivery Dashboard)
- Profile management (name, email, password update)

### 🛠️ Admin Dashboard (`/admin`)
- **Dashboard** — Revenue charts (daily/monthly), top-selling dishes, recent orders, live KPI cards
- **Menu Management** — Full CRUD for food items with ImageKit image upload, category assignment, `isPopular` / Featured toggle, discount %, stock status
- **Category Management** — Create, edit, delete dish categories
- **Order Management** — View all orders, update status (Pending → Processing → Out for Delivery → Completed), filter and search
- **Table Management** — Add, edit, and manage dining tables with capacity and status
- **Reservations** — View, confirm, and cancel all customer reservations
- **Staff Management** — Create and manage staff accounts (Admin, Receptionist, Delivery roles)
- **User Management** — View all customers, block/unblock accounts
- **Reports** — Sales analytics, revenue breakdown, popular items
- **Point-of-Sale (POS)** — In-restaurant order entry for walk-in customers
- **Messages** — View all customer contact inquiries
- **Settings** — Restaurant profile configuration

### 🧾 Receptionist Panel (`/receptionist`)
- Walk-in POS order management
- Reservation management and confirmation
- Live table status and assignment

### 🚴 Delivery Dashboard (`/delivery`)
- View assigned deliveries
- Update delivery status
- Delivery history

---

## 🗂️ Project Structure

```
restaurant-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Business logic (food, orders, users, auth…)
│   │   ├── models/             # Mongoose schemas (Food, Order, User, Category…)
│   │   ├── routes/             # Express route definitions
│   │   ├── middleware/         # Auth guard, role check, error handler
│   │   ├── seeds/              # Admin user seeder
│   │   └── config/             # DB connection, ImageKit, Nodemailer config
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/                # Next.js App Router pages
│   │   │   ├── page.tsx            # Home
│   │   │   ├── menu/               # Menu with pagination
│   │   │   ├── orders/             # My Orders dashboard
│   │   │   ├── checkout/           # Checkout flow
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── reservations/       # Table booking
│   │   │   ├── about/              # About page
│   │   │   ├── contact/            # Contact form
│   │   │   ├── login/              # Login
│   │   │   ├── register/           # Register
│   │   │   ├── forgot-password/    # Password recovery
│   │   │   ├── reset-password/     # Token-based reset
│   │   │   ├── profile/            # User profile
│   │   │   ├── admin/              # Full admin panel
│   │   │   ├── receptionist/       # Receptionist portal
│   │   │   └── delivery/           # Delivery staff portal
│   │   ├── components/         # Shared UI (Navbar, Footer, FoodCard, Modals…)
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── lib/                # Axios API client
│   │   └── types/              # TypeScript type definitions
│   └── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- ImageKit account (free tier works)
- SMTP email credentials (Gmail app password recommended)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run seed     # Creates default admin user
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Fill in your NEXT_PUBLIC_API_URL
npm run dev
```

---

## 🔑 Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Email (Nodemailer) — for Forgot Password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Barwaaqo Restaurant <your_email@gmail.com>

# Frontend URL (for password reset links)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
```

---

## 👤 Default Roles

| Role | Access |
|---|---|
| `admin` | Full system access — all panels |
| `receptionist` | Reservations, POS, tables |
| `delivery` | Assigned deliveries and history |
| `customer` | Online ordering, reservations, order tracking |

---

## 🌿 Deployment

- **Frontend** → [Vercel](https://vercel.com) — connect GitHub repo, set `NEXT_PUBLIC_API_URL`
- **Backend** → [Railway](https://railway.app) or [Render](https://render.com) — set all `.env` variables in platform dashboard

---

## 🧾 Payment Methods Supported

| Method | Provider |
|---|---|
| EVC Plus | Hormuud Telecom |
| eDahab | Dahabshiil |
| Pay on Delivery | Cash |

---

## 👤 Author

**Abdalle Hussein**
- GitHub: [@Abdalle13](https://github.com/Abdalle13)
- Project: [Barwaaqo Restaurant](https://barwaaqo-restaurant-s4nd.vercel.app)

---

> *Barwaaqo — Authentic Somali Fine Dining. Come Hungry. Leave Happy.*
