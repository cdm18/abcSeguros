const router = require('express').Router();
const c = require('../controllers/policies.controller');

router.get('/', c.getAll);      // listado
router.get('/:id', c.getById);  // detalle
router.post('/', c.create);     // crear
router.put('/:id', c.update);   // actualizar
router.delete('/:id', c.remove);// eliminar
router.get('/:id/metadata', c.getMetadata);
router.put('/:id/metadata', c.updateMetadata);


module.exports = router;