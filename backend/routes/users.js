const router = require('express').Router();
const c = require('../controllers/users.controller');

router.get('/', c.getAll);      // listado
router.get('/:id', c.getById);  // detalle
router.post('/', c.create);     // crear
router.put('/:id', c.update);   // actualizar
router.delete('/:id', c.remove);// eliminar

module.exports = router;