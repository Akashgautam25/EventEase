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

🔐 User Roles
👤 USER

View all events

Register for events

Access personal dashboard

Manage personal profile

🛡️ ADMIN

Create & manage events

Modify or delete events

View and manage registrations

Access admin dashboard tools

🚀 Deployment
Frontend → Vercel

Build command: npm run build

Output directory: dist

Backend → Render

Auto-deploy from GitHub

Start command: npm start

Add environment variables

📱 Future Enhancements

Event reminders & notifications

QR-based event check-in system

Certificate generation

Analytics dashboard for admins

Multi-language support

Mobile app version

🤝 Contributing

Fork the repo

Create a branch

Commit your changes

Push and create a Pull Request

📄 License

This project is licensed under the MIT License.

