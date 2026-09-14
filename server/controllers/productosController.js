const Producto = require('../models/Producto');
const camposPermitidos = ['nombre', 'marca', 'descripcion', 'precio', 'precioAntes', 'categoria', 'sabores', 'imagen', 'emoji', 'stock', 'disponible', 'destacado'];
const datosProducto = body => Object.fromEntries(camposPermitidos.filter(c => Object.prototype.hasOwnProperty.call(body, c)).map(c => [c, body[c]]));

// GET /api/productos
exports.listar = async (req, res) => {
  try {
    const { categoria, disponible } = req.query;
    const filtro = {};
    if (categoria && categoria !== 'todos') filtro.categoria = categoria;
    if (disponible !== undefined) filtro.disponible = disponible === 'true';

    const productos = await Producto.find(filtro).sort({ destacado: -1, createdAt: -1 });
    res.json({ ok: true, productos });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// GET /api/productos/:id
exports.obtener = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, producto });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/productos
exports.crear = async (req, res) => {
  try {
    const producto = new Producto(datosProducto(req.body));
    await producto.save();
    res.status(201).json({ ok: true, producto });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

// PUT /api/productos/:id
exports.actualizar = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id, datosProducto(req.body), { new: true, runValidators: true }
    );
    if (!producto) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, producto });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

// DELETE /api/productos/:id
exports.eliminar = async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });
    res.json({ ok: true, mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
