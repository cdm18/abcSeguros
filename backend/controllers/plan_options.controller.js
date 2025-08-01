const db = require('../db');
const safeJson = (v) => (!v ? [] : typeof v === 'string' ? JSON.parse(v) : v);

exports.getOptionsByBasePlanId = async (req, res) => {
    const { basePlanId } = req.params;
    try {
        const [rows] = await db.promise().query(
            `SELECT id, base_plan_id, name, description,
                    price_monthly, price_yearly, coverage, benefits
             FROM plan_option
             WHERE base_plan_id = ?`,
            [basePlanId]
        );

        res.json(
            rows.map((opt) => ({
                ...opt,
                price_monthly: Number(opt.price_monthly),
                price_yearly : Number(opt.price_yearly),
                coverage     : safeJson(opt.coverage),
                benefits     : safeJson(opt.benefits)
            }))
        );
    } catch (err) {
        console.error('Error al obtener opciones de plan:', err);
        res.status(500).json({ error: 'Error al obtener las opciones del plan' });
    }
};
