const express = require('express');
const router = express.Router();
const { registerUsuario } = require('../controllers/usuarioController');
const { loginUsuario } = require('../controllers/usuarioController');

router.post('/registro', registerUsuario);
router.post('/login', loginUsuario);

module.exports = router;
