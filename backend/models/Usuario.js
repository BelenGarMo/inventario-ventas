const db = require('../config/db');

const Usuario = {
  getByEmail: (email) => db.query('SELECT * FROM usuarios WHERE email = ?', [email]),
  create: (apellido, nombres, email, clave, perfil) =>
    db.query('INSERT INTO usuarios (apellido, nombres, email, clave, perfil) VALUES (?, ?, ?, ?, ?)', [apellido, nombres, email, clave, perfil]),
};

module.exports = Usuario;
