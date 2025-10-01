export default function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ msg: "No autorizado" });
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Solo admins pueden hacer esto" });
  next();
}
