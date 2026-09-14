const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre:      { type: String, required: true, trim: true },
  marca:       { type: String, required: true, trim: true },
  descripcion: { type: String, default: '' },
  precio:      { type: Number, required: true, min: 0 },
  precioAntes: { type: Number, default: null },
  categoria:   {
    type: String,
    enum: ['proteina', 'fuerza', 'energia', 'salud', 'recuperacion'],
    required: true
  },
  sabores:     { type: [String], default: ['Sin sabor'] },
  imagen:      { type: String, default: '' },
  emoji:       { type: String, default: '💊' },
  stock:       { type: Number, default: 0, min: 0 },
  disponible:  { type: Boolean, default: true },
  destacado:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
