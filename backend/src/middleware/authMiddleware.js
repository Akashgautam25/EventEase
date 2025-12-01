const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { JWT_SECRET } = require('../config');

const authenticateToken = async (req, res, next) => {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = req.cookies.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, provider: true }
    });

    if (!user) {
      console.log('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Include role from JWT token
    req.user = { ...user, role: decoded.role };
    console.log('Authenticated user:', req.user);
    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { authenticateToken };