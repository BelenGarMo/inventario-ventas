const db = require('../config/db');

// Obtener todos los clientes
exports.getClientes = (req, res) => {
  db.query('SELECT * FROM clientes', (error, results) => {
    if (error) return res.status(500).json({ error });
    res.status(200).json(results);
  });
};

// Obtener un cliente por ID
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE idcliente = ?', [id], (error, results) => {
    if (error) return res.status(500).json({ error });
    if (results.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.status(200).json(results[0]);
  });
};

// Crear un nuevo cliente
exports.createCliente = (req, res) => {
  const { nombre, apellido, email, telefono } = req.body;
  db.query(
    'INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)',
    [nombre, apellido, email, telefono],
    (error, results) => {
      if (error) return res.status(500).json({ error });
      res.status(201).json({ message: 'Cliente creado', id: results.insertId });
    }
  );
};

// Actualizar un cliente
exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, email, telefono } = req.body;
  db.query(
    'UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE idcliente = ?',
    [nombre, apellido, email, telefono, id],
    (error) => {
      if (error) return res.status(500).json({ error });
      res.status(200).json({ message: 'Cliente actualizado' });
    }
  );
};

// Eliminar un cliente
exports.deleteCliente = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE idcliente = ?', [id], (error) => {
    if (error) return res.status(500).json({ error });
    res.status(200).json({ message: 'Cliente eliminado' });
  });
};
