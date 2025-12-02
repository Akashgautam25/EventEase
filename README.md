🎉 EventEase – College Event Management System

EventEase is a full-stack platform for managing college events.
Students can browse and register for events, while admins can create, edit, and manage events from a centralized dashboard.

Designed for a clean, responsive, and professional user experience.

🌐 Live Demo

🔗 Frontend: EventEase Frontend
🔗 Backend API: EventEase Backend

🚀 Features

🔐 Authentication — Email/password + Google OAuth (JWT-based)

👥 Role-Based Access — Admin and User permissions

📅 Event Management — Create, edit, delete, and manage events

🔎 Event Browsing — Search, filter, sort & pagination

🔒 Protected Routes — Role-restricted actions

📱 Responsive UI — Tailwind CSS clean & professional interface

📊 Dashboards —

Users → View registered events

Admins → Manage all events & registrations

🛠 Tech Stack
Frontend

React.js

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

Prisma ORM

PostgreSQL (Neon)

Authentication

JWT (Access + Refresh)

Google OAuth

Hosting

Frontend: Vercel

Backend: Render

🔌 API Endpoints
Authentication
Method	Route	Description	Access
POST	/api/auth/signup	Register user	Public
POST	/api/auth/login	Login user	Public
GET	/api/auth/me	Get current user	Authenticated
POST	/api/auth/logout	Logout user	Authenticated
Events
Method	Route	Description	Access
GET	/api/events	Fetch all events	Authenticated
GET	/api/events/:id	Get event details	Authenticated
POST	/api/events	Create new event	Admin
PUT	/api/events/:id	Update event	Admin
DELETE	/api/events/:id	Delete event	Admin
Registrations
Method	Route	Description	Access
POST	/api/registrations	Register for an event	Authenticated
GET	/api/registrations/:id	Get user's registered events	Authenticated
🔐 User Roles
USER

View and browse all events

Register for events

Access personal dashboard

Search & filter events

ADMIN

Create, edit, and delete events

Manage all event registrations

Access admin dashboard

Monitor system activity

⚙️ Setup
Prerequisites

Node.js v16+

PostgreSQL (Neon recommended)

Google OAuth credentials (optional but recommended)

🛠 Installation
Backend
cd backend
npm install

cp .env.example .env
# Update .env with:
# DATABASE_URL=
# JWT_SECRET=
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# FRONTEND_URL=
# PORT=

npx prisma generate
npx prisma db push

npm run dev


Backend → http://localhost:5000

Frontend
cd frontend
npm install
npm run dev


Frontend → http://localhost:5173

📁 Project Structure
EventEase/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json

🚀 Deployment
Frontend (Vercel)

Connect GitHub repo

Build command: npm run build

Output folder: dist

Backend (Render)

Connect GitHub repo

Build command: npm install

Start command: npm start

Add required environment variables

📱 Future Enhancements

Push notifications

QR-based event check-in

Certificate generation

Advanced event analytics

Multi-language UI

Mobile app version

Admin broadcast announcements

🤝 Contributing
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/NewFeature

# 3. Commit changes
git commit -m "Add NewFeature"

# 4. Push branch
git push origin feature/NewFeature


Then open a Pull Request 🎉

📄 License

This project is licensed under the MIT License.
