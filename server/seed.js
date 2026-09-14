require('dotenv').config();
const mongoose = require('mongoose');
const { Paquete, Repartidor } = require('./models');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB conectado');

  // Limpiar colecciones
  await Paquete.deleteMany({});
  await Repartidor.deleteMany({});
  console.log('🗑️  Colecciones limpiadas');

  // Crear repartidores demo
  const repartidores = await Repartidor.insertMany([
    {
      nombre: 'Andrés Ruiz',
      telefono: '3118420415',
      vehiculo: { tipo: 'moto', placa: 'ABC-123' },
      estado: 'En ruta',
      ubicacion: { lat: 4.7110, lng: -74.0721, direccion: 'Chapinero, Bogotá' }
    },
    {
      nombre: 'Luis Herrera',
      telefono: '3159876543',
      vehiculo: { tipo: 'moto', placa: 'XYZ-456' },
      estado: 'Disponible',
      ubicacion: { lat: 4.6782, lng: -74.0582, direccion: 'Usaquén, Bogotá' }
    },
    {
      nombre: 'Camila Ríos',
      telefono: '3101234567',
      vehiculo: { tipo: 'bicicleta', placa: null },
      estado: 'En ruta',
      ubicacion: { lat: 4.6351, lng: -74.0881, direccion: 'Kennedy, Bogotá' }
    }
  ]);
  console.log(`✅ ${repartidores.length} repartidores creados`);

  // Crear paquetes demo
  const paquetes = await Paquete.insertMany([
    {
      guia: 'STRNG-A1B2C3',
      remitente: { nombre: 'STRNG Store', telefono: '3118420415', direccion: 'Bodega STRNG, Bogotá' },
      destinatario: { nombre: 'Carlos Martínez', telefono: '3011234567', direccion: 'Calle 100 #15-20', ciudad: 'Bogotá' },
      descripcion: 'Suplementos deportivos',
      productos: [
        { nombre: 'WHEY PROTEIN', sabor: 'Chocolate', qty: 1, precio: 189000, imagen: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200' },
        { nombre: 'CREATINA MONO', sabor: 'Sin sabor', qty: 2, precio: 79000, imagen: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=200' }
      ],
      total: 347000,
      estado: 'En ruta',
      repartidor: repartidores[0]._id,
      historialEstados: [
        { estado: 'En bodega', descripcion: 'Pedido recibido y confirmado.', ubicacion: 'Bodega STRNG, Bogotá', hora: new Date(Date.now() - 3*3600000) },
        { estado: 'Empacado', descripcion: 'Paquete empacado y listo.', ubicacion: 'Bodega STRNG, Bogotá', hora: new Date(Date.now() - 2*3600000) },
        { estado: 'En ruta', descripcion: 'Domiciliario recogió el pedido.', ubicacion: 'Chapinero, Bogotá', hora: new Date(Date.now() - 40*60000) }
      ]
    },
    {
      guia: 'STRNG-D4E5F6',
      remitente: { nombre: 'STRNG Store', telefono: '3118420415', direccion: 'Bodega STRNG, Bogotá' },
      destinatario: { nombre: 'Valentina Gómez', telefono: '3209876543', direccion: 'Av. 19 #85-32', ciudad: 'Bogotá' },
      descripcion: 'Vitaminas y suplementos',
      productos: [
        { nombre: 'BCAA 2:1:1', sabor: 'Mango', qty: 1, precio: 99000, imagen: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=200' },
        { nombre: 'VITAMINA D3 + K2', sabor: 'Cápsulas', qty: 1, precio: 68000, imagen: 'https://images.unsplash.com/photo-1550572017-37b5bdc63f37?w=200' }
      ],
      total: 167000,
      estado: 'Entregado',
      repartidor: repartidores[1]._id,
      historialEstados: [
        { estado: 'En bodega', descripcion: 'Pedido recibido.', ubicacion: 'Bodega STRNG, Bogotá', hora: new Date(Date.now() - 5*3600000) },
        { estado: 'En ruta', descripcion: 'En camino.', ubicacion: 'Usaquén, Bogotá', hora: new Date(Date.now() - 2*3600000) },
        { estado: 'Entregado', descripcion: '¡Entregado exitosamente!', ubicacion: 'Usaquén, Bogotá', hora: new Date(Date.now() - 30*60000) }
      ]
    },
    {
      guia: 'STRNG-G7H8I9',
      remitente: { nombre: 'STRNG Store', telefono: '3118420415', direccion: 'Bodega STRNG, Bogotá' },
      destinatario: { nombre: 'Sebastián Torres', telefono: '3155551234', direccion: 'Kr 7 #45-10', ciudad: 'Bogotá' },
      descripcion: 'Pre-entreno y omega 3',
      productos: [
        { nombre: 'PRE-ENTRENO C4', sabor: 'Sandía', qty: 1, precio: 145000, imagen: 'https://images.unsplash.com/photo-1579722822029-d2fe3b6f58b3?w=200' },
        { nombre: 'OMEGA 3 FISH OIL', sabor: 'Cápsulas', qty: 2, precio: 95000, imagen: 'https://images.unsplash.com/photo-1550572017-37b5bdc63f37?w=200' }
      ],
      total: 335000,
      estado: 'En bodega',
      historialEstados: [
        { estado: 'En bodega', descripcion: 'Pedido recibido. Preparando paquete.', ubicacion: 'Bodega STRNG, Bogotá', hora: new Date(Date.now() - 30*60000) }
      ]
    }
  ]);
  console.log(`✅ ${paquetes.length} paquetes creados`);
  console.log('\n📦 Guías de prueba:');
  paquetes.forEach(p => console.log(`   ${p.guia} → ${p.estado}`));

  mongoose.disconnect();
  console.log('\n🎉 Seed completado');
}

seed().catch(err => { console.error(err); process.exit(1); });
