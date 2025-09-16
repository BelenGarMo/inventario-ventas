const express = require('express');
const router = express.Router();
const { getVentas, crearVenta, actualizarVenta, eliminarVenta } = require('../controllers/ventaController');
const { verifyToken, authorizeAdminOrSeller, authorizeAdmin } = require('../middleware/authMiddleware');

// Ruta para obtener todas las ventas (todos los usuarios pueden verlas)
router.get('/', getVentas);

// Ruta para crear una venta (solo admin o vendedor pueden crear)
router.post('/', verifyToken, authorizeAdminOrSeller, crearVenta);

// Ruta para actualizar una venta (solo admin o vendedor pueden actualizar)
router.put('/:id', verifyToken, authorizeAdminOrSeller, actualizarVenta);

// Ruta para eliminar una venta (solo admin puede eliminar)
router.delete('/:id', verifyToken, authorizeAdmin, eliminarVenta);

module.exports = router;
