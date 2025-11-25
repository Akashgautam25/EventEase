const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

/* ----------------------------------------------
   1. Capture Origin on Every Request
---------------------------------------------- */
app.use((req, res, next) => {
  req.requestOrigin = req.headers.origin || null; 
  res.header("Vary", "Origin");
  next();
});

/* ----------------------------------------------
   2. Dynamic CORS Options
---------------------------------------------- */
const corsOptions = {
  origin: true,               // Reflect request origin
  credentials: true,          // Allow cookies/auth
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS
app.use(cors(corsOptions));

// Preflight for ALL routes
app.options("*", cors(corsOptions));

/* ----------------------------------------------
   3. FIXED: Send Dynamic Origin in Response
---------------------------------------------- */
app.use((req, res, next) => {
  if (req.requestOrigin) {
    res.header("Access-Control-Allow-Origin", req.requestOrigin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

/* ----------------------------------------------
   4. Middlewares
---------------------------------------------- */
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* ----------------------------------------------
   5. Health Check Route
---------------------------------------------- */
app.get("/", (req, res) => {
  res.json({ message: "EventEase API running 🚀" });
});

/* ----------------------------------------------
   6. All Routes
---------------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/admin", adminRoutes);

/* ----------------------------------------------
   7. Error Handler
---------------------------------------------- */
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: "Internal server error" });
});

/* ----------------------------------------------
   8. 404 Handler
---------------------------------------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
