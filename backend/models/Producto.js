const db = require('../config/db');

const Producto = {
  getAll: () => db.query('SELECT * FROM productos'),
  getById: (id) => db.query('SELECT * FROM productos WHERE idproducto = ?', [id]),
  create: (nombre, categoria, precio, stock) =>
    db.query('INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)', [nombre, categoria, precio, stock]),
  update: (id, nombre, categoria, precio, stock) =>
    db.query('UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE idproducto = ?', [nombre, categoria, precio, stock, id]),
  delete: (id) => db.query('DELETE FROM productos WHERE idproducto = ?', [id]),
};

module.exports = Producto;
