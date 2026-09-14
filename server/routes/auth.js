const router = require('express').Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { hashToken, generarAccessToken, generarRefreshToken, verificarToken } = require('../middleware/auth');

const publicUser = user => ({ id: user._id, username: user.username, nombre: user.nombre, role: user.role, scopes: user.scopes || [] });

async function issueRefresh(user) {
  const raw = generarRefreshToken();
  await RefreshToken.create({ user: user._id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
  return raw;
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) return res.status(400).json({ ok: false, error: 'Usuario y contraseña requeridos.' });
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user || !user.activo || !(await user.compararPassword(password))) return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    const refreshToken = await issueRefresh(user);
    res.json({ ok: true, accessToken: generarAccessToken(user), refreshToken, expiresIn: 900, user: publicUser(user) });
  } catch (err) { console.error('Login error:', err); res.status(500).json({ ok: false, error: 'Error interno del servidor.' }); }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (typeof refreshToken !== 'string' || !refreshToken) return res.status(401).json({ ok: false, error: 'Refresh token requerido.' });
    const record = await RefreshToken.findOne({ tokenHash: hashToken(refreshToken), revokedAt: null }).populate('user');
    if (!record || record.expiresAt <= new Date() || !record.user?.activo) return res.status(401).json({ ok: false, error: 'Refresh token inválido o expirado.' });
    record.revokedAt = new Date();
    await record.save();
    const nextRefresh = await issueRefresh(record.user);
    res.json({ ok: true, accessToken: generarAccessToken(record.user), refreshToken: nextRefresh, expiresIn: 900, user: publicUser(record.user) });
  } catch (err) { res.status(401).json({ ok: false, error: 'Refresh token inválido o expirado.' }); }
});

router.get('/verify', verificarToken, (req, res) => res.json({ ok: true, user: publicUser(req.user) }));

router.post('/logout', async (req, res) => {
  try {
    if (req.body?.refreshToken) await RefreshToken.findOneAndUpdate({ tokenHash: hashToken(req.body.refreshToken), revokedAt: null }, { revokedAt: new Date() });
    res.json({ ok: true, mensaje: 'Sesión cerrada correctamente.' });
  } catch (err) { res.status(500).json({ ok: false, error: 'No se pudo cerrar la sesión.' }); }
});

router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ ok: false, error: 'No disponible en producción.' });
  try {
    const existe = await User.findOne({ username: 'admin' });
    if (existe) return res.json({ ok: true, mensaje: 'Admin ya existe.' });
    const admin = await User.create({ username: 'admin', password: 'strng2025', nombre: 'Administrador STRNG', role: 'admin' });
    res.status(201).json({ ok: true, mensaje: 'Admin creado.', user: publicUser(admin) });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

module.exports = router;
