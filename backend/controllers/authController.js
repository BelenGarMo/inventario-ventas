const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Controlador de registro
exports.register = async (req, res) => {
  const { apellido, nombres, email, password, perfil } = req.body;

  try {
    // Verificar si el mail ya existe
    const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      'INSERT INTO usuarios (apellido, nombres, email, clave, perfil) VALUES (?, ?, ?, ?, ?)',
      [apellido, nombres, email, hashedPassword, perfil]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
