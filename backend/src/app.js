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
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS setup
app.use(cors(corsOptions));

// Handle preflight for any route
app.options("*", cors(corsOptions));

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

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
