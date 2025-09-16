const db = require('../config/db');

const Cliente = {
  getAll: () => db.query('SELECT * FROM clientes'),
  getById: (id) => db.query('SELECT * FROM clientes WHERE idcliente = ?', [id]),
  create: (nombre, apellido, email, telefono) =>
    db.query('INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)', [nombre, apellido, email, telefono]),
  update: (id, nombre, apellido, email, telefono) =>
    db.query('UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE idcliente = ?', [nombre, apellido, email, telefono, id]),
  delete: (id) => db.query('DELETE FROM clientes WHERE idcliente = ?', [id]),
};

module.exports = Cliente;
