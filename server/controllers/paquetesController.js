const Paquete    = require('../models/Paquete');
const { Repartidor } = require('../models');
const Producto = require('../models/Producto');

const ORDEN_ESTADOS = ['Procesando', 'Empacado', 'En tránsito', 'En ruta', 'Entregado'];

/* ── POST /api/paquetes ── Crear nuevo envío ─────────── */
exports.crearPaquete = async (req, res) => {
  try {
    const { remitente, destinatario, dimensiones, descripcion, productos, total } = req.body;

    if (!remitente?.nombre || !destinatario?.nombre || !destinatario?.telefono || !destinatario?.direccion) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios.' });
    }

    const lineas = Array.isArray(productos) ? productos : [];
    const lineasConProducto = lineas.filter(linea => linea.productoId);
    const inventario = await Promise.all(lineasConProducto.map(async linea => ({
      linea,
      cantidad: Math.max(1, Number(linea.qty) || 1),
      producto: await Producto.findOne({ _id: linea.productoId, disponible: true })
    })));
    const faltante = inventario.find(({ producto, cantidad }) => !producto || producto.stock < cantidad);
    if (faltante) return res.status(409).json({ ok: false, error: `Stock insuficiente o producto no disponible: ${faltante.linea.nombre || faltante.linea.productoId}` });
    for (const { linea, cantidad } of inventario) {
      await Producto.findByIdAndUpdate(linea.productoId, { $inc: { stock: -cantidad } });
    }

    const paquete = await Paquete.create({
      remitente,
      destinatario,
      dimensiones: dimensiones || {},
      descripcion:  descripcion || '',
      productos:    productos   || [],
      total:        total       || 0,
    });

    res.status(201).json({ ok: true, paquete });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

/* ── GET /api/paquetes ── Listar (admin) ─────────────── */
exports.listarPaquetes = async (req, res) => {
  try {
    const { estado, page = 1, limit = 20 } = req.query;
    const filtro = {};
    if (estado && ORDEN_ESTADOS.includes(estado)) filtro.estado = estado;

    const [paquetes, total] = await Promise.all([
      Paquete.find(filtro)
        .populate('repartidor', 'nombre telefono vehiculo ubicacion estado')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Paquete.countDocuments(filtro),
    ]);

    res.json({ ok: true, paquetes, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ── GET /api/paquetes/estadisticas ─────────────────── */
exports.estadisticas = async (req, res) => {
  try {
    const counts = await Promise.all(
      ['Procesando', 'Empacado', 'En tránsito', 'En ruta', 'Entregado'].map(e =>
        Paquete.countDocuments({ estado: e })
      )
    );
    const total = await Paquete.countDocuments();
    res.json({
      ok: true,
      stats: {
        total,
        procesando:  counts[0],
        empacado:    counts[1],
        enTransito:  counts[2],
        enRuta:      counts[3],
        entregado:   counts[4],
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ── GET /api/paquetes/:guia ── Buscar por guía (público) */
exports.obtenerPaquete = async (req, res) => {
  try {
    const termino = req.params.guia.trim().toUpperCase();

    // Soporta búsqueda por guía o por _id
    const esId = /^[a-f\d]{24}$/i.test(req.params.guia);
    const query = esId
      ? { $or: [{ guia: termino }, { _id: req.params.guia }] }
      : { guia: termino };

    const paquete = await Paquete.findOne(query)
      .populate('repartidor', 'nombre telefono vehiculo ubicacion estado');

    if (!paquete) {
      return res.status(404).json({ ok: false, error: 'Guía no encontrada. Verifica el número e inténtalo de nuevo.' });
    }

    res.json({ ok: true, paquete });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ── PUT /api/paquetes/:id ── Actualizar estado (admin) ─ */
exports.actualizarPaquete = async (req, res) => {
  try {
    const { estado, descripcion, ubicacion, repartidor } = req.body;

    const paquete = await Paquete.findById(req.params.id);
    if (!paquete) return res.status(404).json({ ok: false, error: 'Paquete no encontrado.' });

    if (estado) {
      if (!ORDEN_ESTADOS.includes(estado)) {
        return res.status(400).json({ ok: false, error: `Estado inválido. Válidos: ${ORDEN_ESTADOS.join(', ')}` });
      }
      paquete.estado = estado;
      paquete.historialEstados.push({
        estado,
        descripcion: descripcion || `Estado actualizado a: ${estado}`,
        ubicacion:   ubicacion   || 'Bogotá',
      });
      if (estado === 'Entregado') paquete.fechaEntrega = new Date();
    }

    if (repartidor !== undefined) paquete.repartidor = repartidor || null;

    await paquete.save();
    const actualizado = await Paquete.findById(paquete._id)
      .populate('repartidor', 'nombre telefono vehiculo ubicacion estado');

    res.json({ ok: true, paquete: actualizado });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

/* ── DELETE /api/paquetes/:id ────────────────────────── */
exports.eliminarPaquete = async (req, res) => {
  try {
    const eliminado = await Paquete.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ ok: false, error: 'Paquete no encontrado.' });
    res.json({ ok: true, mensaje: 'Paquete eliminado.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
