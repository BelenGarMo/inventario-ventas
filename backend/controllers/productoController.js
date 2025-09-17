const db = require('../config/db');

exports.getProductos = (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error obteniendo productos:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Productos encontrados:', result.length);
        res.status(200).json(result);
    });
};

exports.createProducto = (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    const query = 'INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, categoria, precio, stock], (err, result) => {
        if (err) {
            console.error('Error creando producto:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
            success: true,
            message: 'Producto creado correctamente', 
            productoId: result.insertId 
        });
    });
};

exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, stock } = req.body;
    const query = 'UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE idproducto = ?';
    db.query(query, [nombre, categoria, precio, stock, id], (err, result) => {
        if (err) {
            console.error('Error actualizando producto:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ 
            success: true,
            message: 'Producto actualizado correctamente' 
        });
    });
};

exports.deleteProducto = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE idproducto = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error eliminando producto:', err);
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ 
            success: true,
            message: 'Producto eliminado correctamente' 
        });
    });
};