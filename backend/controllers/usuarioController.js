const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

// Registrar nuevo usuario
exports.registerUsuario = (req, res) => {
    const { apellido, nombres, email, clave, perfil } = req.body;
    const hashedClave = bcrypt.hashSync(clave, 10);

    db.query(
        'INSERT INTO usuarios (apellido, nombres, email, clave, perfil) VALUES (?, ?, ?, ?, ?)',
        [apellido, nombres, email, hashedClave, perfil],
        (error, results) => {
            if (error) return res.status(500).json({ error });
            res.status(201).json({ message: 'Usuario registrado', id: results.insertId });
        }
    );
};

// Iniciar sesión
exports.loginUsuario = (req, res) => {
    const { email, clave } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) return res.status(500).json({ error });
        if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

        const usuario = results[0];
        const validClave = bcrypt.compareSync(clave, usuario.clave);

        if (!validClave) return res.status(401).json({ message: 'Contraseña incorrecta' });

        // Generar token JWT
        const token = jwt.sign({ idusuario: usuario.idusuario, perfil: usuario.perfil }, JWT_SECRET, { expiresIn: '1h' });

        // Respuesta exitosa
        res.status(200).json({ message: 'Inicio de sesión exitoso', token, perfil: usuario.perfil });
    });
};
