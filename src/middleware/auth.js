// Importamos JWT y el modelo de usuario
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware de autenticación
 * Verifica que el usuario tenga un token válido antes de acceder a rutas protegidas
 */
const auth = async (req, res, next) => {
  try {
    // Obtener token del encabezado Authorization (Bearer <token>)
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Si no hay token, negar acceso
    if (!token) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. No hay token proporcionado." });
    }

    // Verificar y decodificar token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos, excluyendo la contraseña
    const user = await User.findById(decoded.id).select("-password");

    // Si no se encuentra usuario, token inválido
    if (!user) {
      return res.status(401).json({ message: "Token inválido." });
    }

    // Guardar usuario en el request para usarlo en la ruta
    req.user = user;

    // Pasar al siguiente middleware o controlador
    next();
  } catch (error) {
    // Error general de verificación de token
    res.status(401).json({ message: "Token inválido." });
  }
};

/**
 * Middleware de autenticación para administradores
 * Llama al middleware auth primero y luego verifica rol
 */
const adminAuth = async (req, res, next) => {
  try {
    // Ejecutar auth primero
    await auth(req, res, () => {
      // Verificar rol de administrador
      if (req.user.rol !== "administrador") {
        return res.status(403).json({
          message: "Acceso denegado. Se requieren permisos de administrador.",
        });
      }
      // Si es administrador, continuar
      next();
    });
  } catch (error) {
    // Acceso denegado en caso de cualquier error
    res.status(403).json({ message: "Acceso denegado." });
  }
};

// Exportamos ambos middlewares
module.exports = { auth, adminAuth };
