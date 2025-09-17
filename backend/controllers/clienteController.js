const db = require('../config/db');

exports.getClientes = (req, res) => {
    const query = 'SELECT * FROM clientes ORDER BY nombre, apellido';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error obteniendo clientes:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};

exports.createCliente = (req, res) => {
    const { nombre, apellido, email, telefono } = req.body;
    const query = 'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, apellido, email, telefono], (err, result) => {
        if (err) {
            console.error('Error creando cliente:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            success: true,
            message: 'Cliente creado correctamente',
            idcliente: result.insertId
        });
    });
};