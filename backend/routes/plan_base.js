// routes/plan-base.js
const router = require('express').Router();
const controller = require('../controllers/plan_base.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
