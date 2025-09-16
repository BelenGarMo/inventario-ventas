// authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware para verificar token
exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token no válido' });
    req.user = decoded;
    next();
  });
};

// Middleware para autorizar a los administradores
exports.authorizeAdmin = (req, res, next) => {
  if (req.user.perfil !== 'admin') {
    return res.status(403).json({ message: 'Acceso restringido solo para administradores' });
  }
  next();
};

// Middleware para autorizar a admin o vendedor
exports.authorizeAdminOrSeller = (req, res, next) => {
  if (req.user.perfil !== 'admin' && req.user.perfil !== 'vendedor') {
    return res.status(403).json({ message: 'Acceso restringido solo para administradores o vendedores' });
  }
  next();
};
