# EventEase Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

**Configure your `.env` file:**
```env
DATABASE_URL="your-neon-postgresql-connection-string"
JWT_SECRET="your-super-secret-jwt-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FRONTEND_URL="http://localhost:5173"
PORT=5000
```

**Setup Database:**
```bash
npx prisma generate
npx prisma db push
```

**Start Backend:**
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy credentials to `.env`

## 🎨 Design System

- **Background:** #ffffff (white)
- **Text Primary:** #000000 (black)
- **Text Secondary:** #4b5563 (gray-600)
- **Border:** #d1d5db (gray-300)
- **Card Background:** #f9fafb (gray-50)
- **Accent:** #000000 (black)
- **Button Hover:** #111111 (gray-900)

## 📱 Features

✅ Professional white theme with black accents
✅ Modern React Icons integration
✅ Responsive design with Tailwind CSS
✅ JWT authentication with httpOnly cookies
✅ Google OAuth integration
✅ Protected routes
✅ Clean component architecture
✅ PostgreSQL with Prisma ORM

## 🔗 URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/health