const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const { FRONTEND_URL } = require("./config");

const app = express();

// CORS FIXED FOR COOKIES + AXIOS withCredentials
app.use(
  cors({
    origin: FRONTEND_URL, // NOT '*'
    credentials: true,    // MUST be true for cookies
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

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
