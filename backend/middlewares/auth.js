const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ msg: 'Usuario no existe' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token inválido o expirado' });
  }
};
