const express = require('express');
const router = express.Router();
const { verifyToken, authorizeAdminOrSeller } = require('../middleware/authMiddleware');
const clienteController = require('../controllers/clienteController');

// Ruta para obtener todos los clientes
router.get('/', verifyToken, authorizeAdminOrSeller, clienteController.getClientes);

// Ruta para crear un cliente
router.post('/', verifyToken, authorizeAdminOrSeller, clienteController.createCliente);

module.exports = router;