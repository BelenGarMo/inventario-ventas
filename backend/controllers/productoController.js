const db = require('../config/db');

exports.getProductos = (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
};

exports.createProducto = (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    const query = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, descripcion, precio, stock], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Producto creado correctamente', productoId: result.insertId });
    });
};

exports.updateProducto = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    const query = 'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, precio, stock, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    });
};

exports.deleteProducto = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    });
};
