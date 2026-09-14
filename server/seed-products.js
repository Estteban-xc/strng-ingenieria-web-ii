require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const productos = [
  { nombre: 'WHEY PROTEIN', marca: 'Optimum Nutrition', descripcion: 'Gold Standard Whey — 24g de proteína por scoop. La referencia mundial en proteína de suero de leche.', precio: 189000, precioAntes: 220000, categoria: 'proteina', sabores: ['Chocolate', 'Vainilla', 'Fresa', 'Natural'], imagen: '/assets/images/whey.jpg', emoji: '🥛', stock: 25, disponible: true, destacado: true },
  { nombre: 'CREATINA MONO', marca: 'MyProtein', descripcion: 'Monohidrato de creatina micronizada. 5g por porción, sin sabor. Aumenta fuerza y recuperación.', precio: 79000, precioAntes: null, categoria: 'fuerza', sabores: ['Sin sabor'], imagen: '/assets/images/crea.jpg', emoji: '⚡', stock: 60, disponible: true, destacado: true },
  { nombre: 'PRE-ENTRENO C4', marca: 'Cellucor', descripcion: 'Fórmula explosiva con cafeína, beta-alanina y citrulina malato. Energía y foco máximos.', precio: 145000, precioAntes: 165000, categoria: 'energia', sabores: ['Sandía', 'Naranja', 'Frutos rojos'], imagen: '/assets/images/c4.jpg', emoji: '🔥', stock: 20, disponible: true, destacado: false },
  { nombre: 'OMEGA 3 FISH OIL', marca: 'Nordic Naturals', descripcion: 'Aceite de pescado de alta pureza. 1000mg EPA+DHA por cápsula. Inflamación, corazón y cerebro.', precio: 95000, precioAntes: null, categoria: 'salud', sabores: ['Cápsulas'], imagen: '/assets/images/o3.jpg', emoji: '🐟', stock: 30, disponible: true, destacado: false },
  { nombre: 'PROTEÍNA VEGANA', marca: 'Garden of Life', descripcion: 'Proteína de guisante y arroz integral. 22g de proteína por scoop, sin lactosa ni gluten.', precio: 165000, precioAntes: null, categoria: 'proteina', sabores: ['Chocolate', 'Vainilla'], imagen: '/assets/images/vp.jpg', emoji: '🌱', stock: 18, disponible: true, destacado: false },
  { nombre: 'BCAA 2:1:1', marca: 'Scivation', descripcion: 'Aminoácidos de cadena ramificada para recuperación y reducción del catabolismo muscular.', precio: 99000, precioAntes: 120000, categoria: 'recuperacion', sabores: ['Mango', 'Sandía', 'Uva'], imagen: '/assets/images/BCA.jpg', emoji: '🧬', stock: 25, disponible: true, destacado: true },
  { nombre: 'VITAMINA D3 + K2', marca: 'Thorne', descripcion: 'Combo esencial para absorción de calcio, sistema inmune y salud ósea. 5000 UI D3 + 100mcg K2.', precio: 68000, precioAntes: null, categoria: 'salud', sabores: ['Cápsulas'], imagen: '/assets/images/D3.jpg', emoji: '☀️', stock: 40, disponible: true, destacado: false },
  { nombre: 'CAFEÍNA 200MG', marca: 'Now Foods', descripcion: 'Cafeína pura anhidra. El estimulante más estudiado del mundo. Foco, energía y quema de grasa.', precio: 35000, precioAntes: null, categoria: 'energia', sabores: ['Cápsulas'], imagen: '/assets/images/cafe.jpg', emoji: '☕', stock: 35, disponible: true, destacado: false },
  { nombre: 'GLUTAMINA', marca: 'Optimum Nutrition', descripcion: 'L-Glutamina micronizada. Recuperación intestinal y muscular, sistema inmune y síntesis proteica.', precio: 72000, precioAntes: null, categoria: 'recuperacion', sabores: ['Sin sabor'], imagen: '/assets/images/glu.jpg', emoji: '🧪', stock: 22, disponible: true, destacado: false }
];

async function seedProducts() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const producto of productos) {
    await Producto.findOneAndUpdate({ nombre: producto.nombre }, producto, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log(`✅ ${productos.length} productos originales restaurados en MongoDB Atlas`);
  await mongoose.disconnect();
}

seedProducts().catch(err => { console.error('❌ Error restaurando productos:', err.message); process.exit(1); });
