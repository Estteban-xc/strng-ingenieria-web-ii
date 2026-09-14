const router = require('express').Router();
const ctrl = require('../controllers/repartidoresController');
const { authAdmin, requiereScope } = require('../middleware/auth');

router.get('/ubicaciones', authAdmin, requiereScope('repartidores:read'), ctrl.ubicaciones);
router.get('/', authAdmin, requiereScope('repartidores:read'), ctrl.listar);
router.post('/', authAdmin, requiereScope('repartidores:write'), ctrl.crear);
router.put('/:id/ubicacion', authAdmin, requiereScope('repartidores:write'), ctrl.actualizarUbicacion);
router.put('/:id', authAdmin, requiereScope('repartidores:write'), ctrl.actualizar);
router.delete('/:id', authAdmin, requiereScope('repartidores:write'), ctrl.eliminar);

module.exports = router;
