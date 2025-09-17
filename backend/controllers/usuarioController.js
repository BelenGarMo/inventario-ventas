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
            if (error) {
                console.error('Error registrando usuario:', error);
                return res.status(500).json({ success: false, message: 'Error interno del servidor' });
            }
            res.status(201).json({ 
                success: true, 
                message: 'Usuario registrado exitosamente', 
                id: results.insertId 
            });
        }
    );
};

// Iniciar sesión
exports.loginUsuario = (req, res) => {
    const { email, clave } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.error('Error en consulta de login:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const usuario = results[0];
        const validClave = bcrypt.compareSync(clave, usuario.clave);

        if (!validClave) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { idusuario: usuario.idusuario, perfil: usuario.perfil }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Remover la contraseña del objeto usuario antes de enviarlo
        const { clave: _, ...usuarioSinClave } = usuario;

        // Respuesta exitosa con todos los datos necesarios
        res.status(200).json({ 
            success: true,
            message: 'Inicio de sesión exitoso', 
            token, 
            user: usuarioSinClave
        });
    });
};

// Obtener todos los usuarios (solo admin)
exports.getAllUsuarios = (req, res) => {
    const query = 'SELECT idusuario, apellido, nombres, email, perfil FROM usuarios';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error obteniendo usuarios:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(result);
    });
};