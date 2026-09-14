const mongoose = require('mongoose');

/* ── Generador de guía única ───────────────────────── */
const generarGuia = () => {
  const ts   = Date.now().toString(36).toUpperCase().slice(-4);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `STRNG-${ts}${rand}`;
};

/* ── Subdocumento: evento de historial ─────────────── */
const eventoSchema = new mongoose.Schema({
  estado:      { type: String, required: true },
  descripcion: { type: String, default: '' },
  ubicacion:   { type: String, default: 'Bogotá' },
  hora:        { type: Date,   default: Date.now },
}, { _id: true });

/* ── Esquema principal ─────────────────────────────── */
const paqueteSchema = new mongoose.Schema({

  guia: {
    type:     String,
    unique:   true,
    index:    true,
    default:  generarGuia,
  },

  /* Remitente */
  remitente: {
    nombre:   { type: String, required: true },
    telefono: { type: String, default: '' },
    direccion:{ type: String, default: '' },
  },

  /* Destinatario */
  destinatario: {
    nombre:   { type: String, required: true },
    telefono: { type: String, required: true },
    direccion:{ type: String, required: true },
    ciudad:   { type: String, default: 'Bogotá' },
  },

  /* Dimensiones */
  dimensiones: {
    peso:  { type: Number, default: 0 },   // kg
    largo: { type: Number, default: 0 },   // cm
    ancho: { type: Number, default: 0 },
    alto:  { type: Number, default: 0 },
  },

  descripcion: { type: String, default: '' },

  /* Productos incluidos */
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', default: null },
    nombre: String,
    sabor:  String,
    qty:    Number,
    precio: Number,
    imagen: String,
  }],

  total: { type: Number, default: 0 },

  /* Estado principal — 5 etapas */
  estado: {
    type:    String,
    enum:    ['Procesando', 'Empacado', 'En tránsito', 'En ruta', 'Entregado'],
    default: 'Procesando',
  },

  /* Historial cronológico */
  historialEstados: [eventoSchema],

  /* Repartidor asignado */
  repartidor: {
    type:    mongoose.Schema.Types.ObjectId,
    ref:     'Repartidor',
    default: null,
  },

  fechaCreacion: { type: Date, default: Date.now },
  fechaEntrega:  { type: Date, default: null },

}, { timestamps: true });

/* ── Pre-save: registrar primer evento automáticamente ─ */
paqueteSchema.pre('save', function (next) {
  if (this.isNew && this.historialEstados.length === 0) {
    this.historialEstados.push({
      estado:      'Procesando',
      descripcion: 'Pedido recibido y registrado en el sistema STRNG.',
      ubicacion:   'Centro de distribución STRNG, Bogotá',
    });
  }
  next();
});

/* ── Virtual: índice del estado actual ─────────────── */
const ORDEN_ESTADOS = ['Procesando', 'Empacado', 'En tránsito', 'En ruta', 'Entregado'];
paqueteSchema.virtual('pasoActual').get(function () {
  return ORDEN_ESTADOS.indexOf(this.estado);
});

paqueteSchema.set('toJSON',   { virtuals: true });
paqueteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Paquete', paqueteSchema);
