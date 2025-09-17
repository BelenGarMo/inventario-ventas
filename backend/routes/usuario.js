const express = require('express');
const router = express.Router();
const { registerUsuario, loginUsuario, getAllUsuarios } = require('../controllers/usuarioController');
const { verifyToken, authorizeAdmin } = require('../middleware/authMiddleware');

router.post('/registro', registerUsuario);
router.post('/login', loginUsuario);
router.get('/todos', verifyToken, authorizeAdmin, getAllUsuarios);

module.exports = router;