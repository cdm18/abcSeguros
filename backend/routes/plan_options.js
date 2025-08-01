const router = require('express').Router();
const c = require('../controllers/plan_options.controller');

router.get('/:basePlanId/options', c.getOptionsByBasePlanId);
router.get('/', (req, res) => {
    res.json({ message: 'Usa /:basePlanId/options para obtener opciones por plan base' });
});

module.exports = router;
