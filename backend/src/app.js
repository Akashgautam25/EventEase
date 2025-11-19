const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Track origin per request so responses reflect the caller
app.use((req, res, next) => {
  req.requestOrigin = req.headers.origin || null;
  res.header("Vary", "Origin");
  next();
});

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl) by returning true
    callback(null, origin || true);
  },
  credentials: true, // required for cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS setup to dynamically mirror any requesting origin for cookies
app.use(cors(corsOptions));

// Handle preflight for any route
app.options("*", cors(corsOptions));

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
