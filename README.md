# EventEase - College Event Management System

A full-stack web application for managing college events with React.js frontend and Node.js backend.

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment Setup:**
```bash
cp .env.example .env
```

3. **Configure your .env file:**
```env
DATABASE_URL="your-neon-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

4. **Setup Database:**
```bash
npx prisma generate
npx prisma db push
```

5. **Start Backend:**
```bash
npm run dev
```
Backend will run on: http://localhost:5000

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Start Frontend:**
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## 🔧 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

## 📁 Project Structure

```
EventEase/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── prisma/
│   │   │   └── client.js
│   │   ├── routes/
│   │   │   └── authRoutes.js
│   │   ├── app.js
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   └── Signup.jsx
    │   ├── utils/
    │   │   └── axiosClient.js
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## 🔐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Email signup |
| POST | `/api/auth/login` | Email login |
| GET | `/api/auth/google` | Google OAuth redirect |
| GET | `/api/auth/google/callback` | Handle Google OAuth callback |
| GET | `/api/auth/me` | Get logged-in user |
| POST | `/api/auth/logout` | Logout user |

## 🛠️ Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Google OAuth 2.0

## ✅ Features Implemented

- ✅ Landing page with hero section
- ✅ Email/Password authentication
- ✅ Google OAuth integration
- ✅ JWT token-based auth with httpOnly cookies
- ✅ Protected routes
- ✅ User dashboard
- ✅ Responsive design with Tailwind CSS
- ✅ PostgreSQL database with Prisma

## 🔄 Development

Both servers support hot reload:
- Backend: Uses nodemon for auto-restart
- Frontend: Uses Vite's built-in HMR

## 🚀 Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. Set production environment variables
3. Deploy backend to your preferred platform
4. Deploy frontend build to static hosting

## 📝 License

MIT License