const mongoose = require('mongoose');

// Paquete ya está definido en Paquete.js — solo lo reexportamos
const Paquete = require('./Paquete');

// ── ESQUEMA DE REPARTIDOR ───────────────────────────
const repartidorSchema = new mongoose.Schema({
  nombre:   { type: String, required: true },
  telefono: { type: String, required: true },
  vehiculo: {
    tipo:  { type: String, enum: ['moto', 'bicicleta', 'carro'], default: 'moto' },
    placa: { type: String }
  },
  estado: {
    type:    String,
    enum:    ['Disponible', 'En ruta', 'Descanso'],
    default: 'Disponible'
  },
  ubicacion: {
    lat:                { type: Number, default: 4.7110 },
    lng:                { type: Number, default: -74.0721 },
    direccion:          { type: String, default: 'Bogotá' },
    ultimaActualizacion:{ type: Date,   default: Date.now }
  },
  activo: { type: Boolean, default: true }
}, { timestamps: true });

const Repartidor = mongoose.models.Repartidor || mongoose.model('Repartidor', repartidorSchema);

module.exports = { Paquete, Repartidor };
