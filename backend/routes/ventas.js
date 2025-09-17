const express = require('express');
const router = express.Router();
const { verifyToken, authorizeAdminOrSeller } = require('../middleware/authMiddleware');
const ventaController = require('../controllers/ventaController');

// Ruta para obtener todas las ventas
router.get('/', verifyToken, authorizeAdminOrSeller, ventaController.getVentas);

// Ruta para crear una venta
router.post('/', verifyToken, authorizeAdminOrSeller, ventaController.createVenta);

// Ruta para obtener ventas por vendedor
router.get('/vendedor/:id', verifyToken, authorizeAdminOrSeller, ventaController.getVentasByVendedor);

module.exports = router;