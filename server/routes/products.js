const router = require('express').Router();
const ctrl = require('../controllers/productosController');
const { authAdmin, requiereScope } = require('../middleware/auth');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', authAdmin, requiereScope('productos:write'), ctrl.crear);
router.put('/:id', authAdmin, requiereScope('productos:write'), ctrl.actualizar);
router.delete('/:id', authAdmin, requiereScope('productos:write'), ctrl.eliminar);

module.exports = router;
