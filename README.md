# EventEase – College Event Management System

EventEase is a full-stack platform for managing college events. Students can browse and register for events, while admins can create, edit, and manage events from a centralized dashboard. Designed for a clean, responsive, and professional experience.

---

## 🌐 Live Demo

- **Frontend:** [EventEase Frontend](https://event-ease-amber.vercel.app)  
- **Backend API:** [EventEase Backend](https://eventease-03az.onrender.com)

---

## 🚀 Features

- **Authentication:** Secure email/password and Google OAuth login with JWT  
- **Role-Based Access:** Admin and User permissions  
- **Event Management:** Create, edit, delete, and view events  
- **Event Browsing:** Search, filter, sort, and paginate events  
- **Protected Routes:** Dashboard and event actions restricted by role  
- **Responsive UI:** Clean, professional interface with Tailwind CSS  
- **Dashboard:** Users can view registered events; Admins can manage all events  

---

## 🛠 Tech Stack

**Frontend:** React.js, React Router, Axios, Tailwind CSS  
**Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL (Neon)  
**Authentication:** JWT & Google OAuth  
**Hosting:** Frontend – Vercel | Backend – Render  

---

## 🔌 API Endpoints

| Method | Route                     | Description                   | Access        |
|--------|---------------------------|-------------------------------|---------------|
| POST   | `/api/auth/signup`        | Register user                 | Public        |
| POST   | `/api/auth/login`         | Login user                    | Public        |
| GET    | `/api/auth/me`            | Get current user              | Authenticated |
| POST   | `/api/auth/logout`        | Logout user                   | Authenticated |
| GET    | `/api/events`             | Fetch all events              | Authenticated |
| GET    | `/api/events/:id`         | Get event details             | Authenticated |
| POST   | `/api/events`             | Create event                  | Admin         |
| PUT    | `/api/events/:id`         | Update event                  | Admin         |
| DELETE | `/api/events/:id`         | Delete event                  | Admin         |
| POST   | `/api/registrations`      | Register for an event         | Authenticated |
| GET    | `/api/registrations/:id`  | Get user’s registered events  | Authenticated |

---

## ⚙️ Setup

### Prerequisites
- Node.js v16+
- PostgreSQL (Neon)
- Google OAuth credentials (optional for Google login)

### Installation

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL, PORT
npx prisma generate
npx prisma db push
npm run dev
Backend → http://localhost:5000

Frontend
bash
Copy code
cd frontend
npm install
npm run dev
Frontend → http://localhost:5173

📁 Project Structure
graphql
Copy code
EventEase/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth & validation
│   │   ├── prisma/             # Prisma client
│   │   ├── routes/             # API routes
│   │   ├── app.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        # Navbar, ProtectedRoute, etc.
    │   ├── pages/             # Dashboard, Login, Signup, Landing
    │   ├── utils/             # Axios client, helpers
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
📝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push the branch (git push origin feature/AmazingFeature)

Open a Pull Request

pgsql
Copy code
