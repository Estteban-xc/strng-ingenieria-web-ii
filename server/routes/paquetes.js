const router = require('express').Router();
const ctrl = require('../controllers/paquetesController');
const { authAdmin, requiereScope } = require('../middleware/auth');

router.get('/estadisticas', authAdmin, requiereScope('paquetes:read'), ctrl.estadisticas);
router.get('/', authAdmin, requiereScope('paquetes:read'), ctrl.listarPaquetes);
router.post('/', ctrl.crearPaquete);
router.get('/:guia', ctrl.obtenerPaquete);
router.put('/:id', authAdmin, requiereScope('paquetes:write'), ctrl.actualizarPaquete);
router.delete('/:id', authAdmin, requiereScope('paquetes:write'), ctrl.eliminarPaquete);

module.exports = router;
