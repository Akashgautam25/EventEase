const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { JWT_SECRET } = require("../config");

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const isProduction = process.env.NODE_ENV === "production";

// Generate JWT token with role
const generateToken = (userId, role) => jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });

const isLocalhostOrigin = (origin = "") => /^(https?:\/\/)?(localhost|127\.0\.0\.1)/i.test(origin);
const isHttpsOrigin = (origin = "") => origin.startsWith("https://");

const baseCookieOptions = (origin) => {
  const isLocal = isLocalhostOrigin(origin);
  const secure = isHttpsOrigin(origin) || isProduction;

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? "none" : "lax",
    path: "/",
    domain: isLocal ? undefined : undefined, // Let browser handle domain
  };
};

const authCookieOptions = (origin) => ({
  ...baseCookieOptions(origin),
  maxAge: COOKIE_MAX_AGE,
});

const setAuthCookie = (res, token, origin) => {
  res.cookie(COOKIE_NAME, token, authCookieOptions(origin));
};

// ---------- SIGN UP ----------
const signup = async (req, res) => {
  const { name, email, password, userType } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 6);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "credentials"
      }
    });
    
    const selectedRole = userType || user.role;
    const token = generateToken(user.id, selectedRole);
    
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: selectedRole 
      }, 
      token 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// ---------- LOGIN ----------
const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const selectedRole = userType || user.role;
    const token = generateToken(user.id, selectedRole);
    setAuthCookie(res, token, req.requestOrigin);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider, role: selectedRole },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- GET ME ----------
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({ user: req.user });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- LOGOUT ----------
const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, baseCookieOptions(req.requestOrigin));
  res.json({ message: "Logged out successfully" });
};

module.exports = { signup, login, getMe, logout };
