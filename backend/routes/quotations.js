const router = require('express').Router();
const c = require('../controllers/quotations.controller');

/* solo registramos funciones que SÍ existen */
router.get('/',      c.getAll);       // lista
router.get('/:id',   c.getById);      // detalle
router.post('/',     c.create);       // crear
router.put('/:id',   c.update);       // actualizar
router.delete('/:id', c.remove);      // borrar

module.exports = router;
