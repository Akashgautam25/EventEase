const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

const { FRONTEND_URL } = require("./config");

const app = express();

// Allowed origins (local + deployed)
const allowedOrigins = [
  "http://localhost:5173",           // dev
  "https://event-ease-amber.vercel.app" // deployed frontend
];

// CORS setup for cookies + Axios withCredentials
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Health route
app.get("/", (req, res) => {
  res.json({ message: "EventEase API running 🚀" });
});

// Auth routes
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
