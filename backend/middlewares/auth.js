import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function (req, res, next) {
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
}
