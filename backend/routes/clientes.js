const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const { verifyToken, authorizeAdmin } = require('../middleware/authMiddleware');

//obtener todos los clientes (solo admin puede verlos)
router.get('/', verifyToken, authorizeAdmin, clienteController.getClientes);

//obtener un cliente por su ID
router.get('/:id', verifyToken, clienteController.getClienteById);

//crear un nuevo cliente (solo admin puede crear)
router.post('/', verifyToken, authorizeAdmin, clienteController.createCliente);

//actualizar un cliente (solo admin puede actualizar)
router.put('/:id', verifyToken, authorizeAdmin, clienteController.updateCliente);

//eliminar un cliente (solo admin puede eliminar)
router.delete('/:id', verifyToken, authorizeAdmin, clienteController.deleteCliente);

module.exports = router;
