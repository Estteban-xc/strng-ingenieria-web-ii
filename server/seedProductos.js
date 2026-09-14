require('dotenv').config();
const mongoose = require('mongoose');
const Producto = require('./models/Producto');

const productos = [
  { nombre: 'WHEY PROTEIN', marca: 'Optimum Nutrition', descripcion: 'Gold Standard Whey — 24g de proteína por scoop. La referencia mundial en proteína de suero de leche.', precio: 189000, precioAntes: 220000, categoria: 'proteina', sabores: ['Chocolate', 'Vainilla', 'Fresa', 'Natural'], emoji: '🥛', stock: 40, destacado: true },
  { nombre: 'CREATINA MONO', marca: 'MyProtein', descripcion: 'Monohidrato de creatina micronizada. 5g por porción, sin sabor. Aumenta fuerza y recuperación.', precio: 79000, categoria: 'fuerza', sabores: ['Sin sabor'], emoji: '⚡', stock: 60, destacado: true },
  { nombre: 'PRE-ENTRENO C4', marca: 'Cellucor', descripcion: 'Fórmula explosiva con cafeína, beta-alanina y citrulina malato. Energía y foco máximos.', precio: 145000, precioAntes: 165000, categoria: 'energia', sabores: ['Sandía', 'Naranja', 'Frutos rojos'], emoji: '🔥', stock: 25 },
  { nombre: 'OMEGA 3 FISH OIL', marca: 'Nordic Naturals', descripcion: 'Aceite de pescado de alta pureza. 1000mg EPA+DHA por cápsula.', precio: 95000, categoria: 'salud', sabores: ['Cápsulas'], emoji: '🐟', stock: 50 },
  { nombre: 'PROTEÍNA VEGANA', marca: 'Garden of Life', descripcion: 'Proteína de guisante y arroz integral. 22g de proteína por scoop, sin lactosa ni gluten.', precio: 165000, categoria: 'proteina', sabores: ['Chocolate', 'Vainilla'], emoji: '🌱', stock: 20 },
  { nombre: 'BCAA 2:1:1', marca: 'Scivation', descripcion: 'Aminoácidos de cadena ramificada para recuperación y reducción del catabolismo muscular.', precio: 99000, precioAntes: 120000, categoria: 'recuperacion', sabores: ['Mango', 'Sandía', 'Uva'], emoji: '💪', stock: 35 },
  { nombre: 'VITAMINA D3 + K2', marca: 'Thorne', descripcion: 'Combo esencial para absorción de calcio, sistema inmune y salud ósea. 5000 UI D3 + 100mcg K2.', precio: 68000, categoria: 'salud', sabores: ['Cápsulas'], emoji: '☀️', stock: 80 },
  { nombre: 'CAFEÍNA 200MG', marca: 'Now Foods', descripcion: 'Cafeína pura anhidra. El estimulante más estudiado del mundo.', precio: 35000, categoria: 'energia', sabores: ['Cápsulas'], emoji: '☕', stock: 100 },
  { nombre: 'GLUTAMINA', marca: 'Optimum Nutrition', descripcion: 'L-Glutamina micronizada. Recuperación intestinal y muscular, sistema inmune y síntesis proteica.', precio: 72000, categoria: 'recuperacion', sabores: ['Sin sabor'], emoji: '🔬', stock: 45 },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await Producto.deleteMany({});
    await Producto.insertMany(productos);
    console.log(`✅ ${productos.length} productos insertados`);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
