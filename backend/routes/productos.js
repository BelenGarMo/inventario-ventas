const express = require('express');
const router = express.Router();
const { verifyToken, authorizeAdminOrSeller, authorizeAdmin } = require('../middleware/authMiddleware');
const productoController = require('../controllers/productoController');

// Ruta para obtener todos los productos (todos los usuarios pueden verlos)
router.get('/', productoController.getProductos);

// Ruta para crear un producto (solo admin o vendedor pueden crear)
router.post('/', verifyToken, authorizeAdminOrSeller, productoController.createProducto);

// Ruta para actualizar un producto (solo admin o vendedor pueden actualizar)
router.put('/:id', verifyToken, authorizeAdminOrSeller, productoController.updateProducto);

// Ruta para eliminar un producto (solo admin puede eliminar)
router.delete('/:id', verifyToken, authorizeAdmin, productoController.deleteProducto);

module.exports = router;
