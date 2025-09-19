// Importamos el modelo de Usuario
const User = require('../models/User');
// Importamos jsonwebtoken para manejar tokens de autenticación
const jwt = require('jsonwebtoken');

// Función para generar un token JWT a partir del id del usuario
const generateToken = (id) => {
    // El token expira en 7 días
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
    try {
        // Desestructuramos los datos enviados en el body
        const { nombre, email, password, rol, grado } = req.body;
        
        // Verificar si el usuario ya existe por email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        const user = await User.create({
            nombre,
            email,
            password,
            rol,
            // Guardar grado solo si el rol es estudiante
            grado: rol === 'estudiante' ? grado : undefined
        });

        // Responder con los datos del usuario y un token de autenticación
        res.status(201).json({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            token: generateToken(user._id)
        });
    } catch (error) {
        // Si hay un error interno del servidor
        res.status(500).json({ message: error.message });
    }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
    try {
        // Desestructuramos email y password del body
        const { email, password } = req.body;
        
        // Buscar usuario por email
        const user = await User.findOne({ email });

        // Verificar contraseña usando el método comparePassword del modelo
        if (user && (await user.comparePassword(password))) {
            // Si todo es correcto, responder con los datos del usuario y token
            res.json({
                _id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                token: generateToken(user._id)
            });
        } else {
            // Si credenciales incorrectas
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        // Error interno del servidor
        res.status(500).json({ message: error.message });
    }
};
