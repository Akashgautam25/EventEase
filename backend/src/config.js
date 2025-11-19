require('dotenv').config();

// Frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://event-ease-amber.vercel.app';

// Server Port
const PORT = process.env.PORT ? Number(process.env.PORT) : 5001;

// JWT Secret Handling
let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET not set. Using insecure fallback secret for local development only.");
  JWT_SECRET = "development-secret";
}

// Google OAuth Check
const isGoogleAuthEnabled =
  Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

module.exports = {
  FRONTEND_URL,
  PORT,
  JWT_SECRET,
  isGoogleAuthEnabled,
};
