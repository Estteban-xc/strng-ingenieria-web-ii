const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET es obligatorio');

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

const generarAccessToken = user => jwt.sign(
  { sub: String(user._id), type: 'access', scopes: user.scopes || [] },
  JWT_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_TTL || '15m', issuer: 'strng-api', audience: 'strng-client' }
);

const generarRefreshToken = () => crypto.randomBytes(48).toString('base64url');

const verificarToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ ok: false, error: 'Token requerido. Inicia sesión.' });
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET, { issuer: 'strng-api', audience: 'strng-client' });
    if (decoded.type !== 'access' || !decoded.sub) return res.status(401).json({ ok: false, error: 'Tipo de token inválido.' });
    const user = await User.findById(decoded.sub).select('-password');
    if (!user || !user.activo) return res.status(401).json({ ok: false, error: 'Usuario no encontrado o inactivo.' });
    req.user = user;
    req.tokenScopes = decoded.scopes || user.scopes || [];
    next();
  } catch (err) {
    const error = err.name === 'TokenExpiredError' ? 'Sesión expirada. Renueva el access token.' : 'Token inválido.';
    res.status(401).json({ ok: false, error });
  }
};

const requiereScope = scope => (req, res, next) => {
  if (!req.tokenScopes?.includes(scope)) return res.status(403).json({ ok: false, error: `Scope requerido: ${scope}` });
  next();
};

const soloAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Acceso denegado. Se requiere rol de administrador.' });
  next();
};

const authAdmin = [verificarToken, soloAdmin];
const generarToken = generarAccessToken;

module.exports = { JWT_SECRET, REFRESH_SECRET, hashToken, generarAccessToken, generarRefreshToken, generarToken, verificarToken, requiereScope, soloAdmin, authAdmin };
