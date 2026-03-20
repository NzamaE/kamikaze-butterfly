# 💍 Kamikaze Butterfly Weddings

> A full-stack wedding planning platform connecting couples, vendors, and event coordinators in one seamless experience.

![Tech Stack](https://img.shields.io/badge/React-TypeScript-blue?style=flat-square&logo=react)
![Node](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=flat-square&logo=postgresql)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📌 Overview

Kamikaze Butterfly Weddings is a two-part system designed to take the chaos out of wedding planning. Couples get a personalized planning experience, vendors get a professional profile and booking management tool, and the event coordinator gets full visibility over everything.

---

## ✨ Features

### 👫 For Couples (Clients)
- Create and manage a personalized wedding plan
- Interactive checklist (venue, catering, photography, decor & more)
- Smart vendor suggestions based on theme, location & budget
- Live budget tracker as vendors are booked
- Invoice generation on service requests
- Option to make completed plans public for others to reference

### 🏢 For Vendors
- Create and manage a detailed service profile
- Availability calendar that auto-updates on confirmed bookings
- Accept or reject service requests from clients
- Track earnings and client metrics from a personal dashboard

### 👑 For Admin (Event Coordinator)
- Full overview dashboard — clients, vendors, plans, revenue
- Vendor verification and approval workflow
- Remove or manage vendors on the platform
- Provide their own services as a verified vendor

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Hosting (FE) | Vercel |
| Hosting (BE) | Railway |

---

## 📁 Project Structure

```
kamikaze-butterfly/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level pages
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api/              # API call functions
│   │   ├── types/            # Shared TypeScript types
│   │   └── lib/              # Utilities & helpers
│   └── public/
│
└── server/                   # Node.js + Express backend
    ├── src/
    │   ├── routes/           # API route definitions
    │   ├── controllers/      # Route handler logic
    │   ├── middleware/        # Auth & error middleware
    │   ├── db/               # Database connection & queries
    │   └── types/            # Shared TypeScript types
    └── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/NzamaE/kamikaze-butterfly.git
cd kamikaze-butterfly
```

### 2. Set up the backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 3. Set up the frontend
```bash
cd client
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### 4. Set up the database
```bash
cd server
npm run db:migrate
npm run db:seed   # optional — loads sample data
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/kamikaze_butterfly
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🗺 Roadmap

- [x] Project setup & repo structure
- [ ] Database schema design
- [ ] Auth (register, login, roles)
- [ ] Client — wedding plan creation
- [ ] Client — vendor browsing & booking
- [ ] Vendor — profile & calendar management
- [ ] Admin — dashboard & vendor verification
- [ ] Payment & invoice generation
- [ ] Public plans feature
- [ ] Deployment

---

## 👨‍💻 Author

**Ernest Nzama**  
Full-Stack Developer | BSc Computer Science & Informatics  
[LinkedIn](https://www.linkedin.com/in/ernestsoftwaredeveloper) · [GitHub](https://github.com/NzamaE)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
