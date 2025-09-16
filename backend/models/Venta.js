const db = require('../config/db');

const Venta = {
  getAll: () => db.query('SELECT * FROM ventas'),
  create: (idproducto, cantidad, idcliente, idvendedor, total) =>
    db.query('INSERT INTO ventas (idproducto, cantidad, idcliente, idvendedor, total) VALUES (?, ?, ?, ?, ?)', [idproducto, cantidad, idcliente, idvendedor, total]),
};

module.exports = Venta;
