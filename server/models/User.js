const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    unique:   true,
    trim:     true,
    lowercase: true,
  },
  password: {
    type:     String,
    required: true,
    minlength: 6,
  },
  role: {
    type:    String,
    enum:    ['admin', 'staff'],
    default: 'admin',
  },
  scopes: {
    type: [String],
    default: ['productos:read', 'productos:write', 'paquetes:read', 'paquetes:write', 'repartidores:read', 'repartidores:write'],
  },
  nombre: {
    type: String,
    default: 'Administrador STRNG',
  },
  activo: {
    type:    Boolean,
    default: true,
  },
}, { timestamps: true });

/* ── Hash antes de guardar ─────────────────────────── */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ── Comparar contraseña ───────────────────────────── */
userSchema.methods.compararPassword = function (candidata) {
  return bcrypt.compare(candidata, this.password);
};

/* ── No exponer password en JSON ───────────────────── */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
