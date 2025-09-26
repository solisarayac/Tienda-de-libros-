const express = require('express'); // Importa Express
const { register, login } = require('../controllers/authController'); // Importa las funciones del authController

const router = express.Router(); // Crea un router de Express

// Rutas de autenticación
router.post('/register', register); // POST /register → registra un usuario
router.post('/login', login);       // POST /login → inicia sesión

module.exports = router; // Exporta el router para usarlo en app.js
