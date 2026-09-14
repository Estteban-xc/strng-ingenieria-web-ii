require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const openapi = require('../docs/openapi.json');
const { rejectUnsafeKeys } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ──────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3001,http://127.0.0.1:3001').split(',').map(x => x.trim());
app.use(helmet());
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Origen no permitido')), methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rejectUnsafeKeys);
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false }));

// ── RUTAS API ───────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/productos',    require('./routes/products'));
app.use('/api/paquetes',     require('./routes/paquetes'));
app.use('/api/repartidores', require('./routes/repartidores'));
// Swagger UI (tercero) usa evaluación dinámica para sus snippets. La excepción
// queda limitada a /api-docs; la API conserva la CSP estricta de Helmet.
app.use('/api-docs', helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'https:'],
  connectSrc: ["'self'"]
} } }), swaggerUi.serve, swaggerUi.setup(openapi));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'STRNG API corriendo', tiempo: new Date().toISOString() });
});

app.use((req, res) => res.status(404).json({ ok: false, error: 'Ruta API no encontrada' }));
app.use((err, req, res, next) => {
  if (err.message === 'Origen no permitido') return res.status(403).json({ ok: false, error: err.message });
  next(err);
});

// ── MONGODB ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 API base: http://localhost:${PORT}/api`);
    });
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });
