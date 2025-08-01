const db = require('../db');

const safeJson = (value) => {
    if (!value) return [];
    if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return []; }
    }
    return value;           // ya es objeto/array → devuélvelo tal cual
};

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT id, code, name, company_id, base_premium, description,
                   price_monthly, price_yearly, coverage, benefits, created_at
            FROM plan_base
        `);

        const parsed = rows.map(plan => ({
            ...plan,
            coverage : safeJson(plan.coverage),
            benefits : safeJson(plan.benefits)
        }));

        res.json(parsed);
    } catch (err) {
        console.error('Error al obtener los planes base:', err);
        res.status(500).json({ error: 'Error al obtener los planes base' });
    }
};

exports.getById = async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            `SELECT id, code, name, company_id, base_premium, description,
                    price_monthly, price_yearly, coverage, benefits, created_at
             FROM plan_base
             WHERE id = ?`,
            [req.params.id]
        );

        if (!rows.length) {
            return res.status(404).json({ message: 'Plan base no encontrado' });
        }

        const plan = {
            ...rows[0],
            coverage: safeJson(rows[0].coverage),
            benefits: safeJson(rows[0].benefits)
        };

        res.json(plan);

    } catch (err) {
        console.error('Error al obtener el plan base por ID:', err);
        res.status(500).json({ error: 'Error interno' });
    }
};


// Crear un nuevo plan base
exports.create = async (req, res) => {
    try {
        const {
            code, name, company_id, base_premium, description,
            price_monthly, price_yearly, coverage, benefits
        } = req.body;

        const [result] = await db.promise().query(`
            INSERT INTO plan_base
                (code, name, company_id, base_premium, description,
                 price_monthly, price_yearly, coverage, benefits)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            code, name, company_id, base_premium, description,
            price_monthly, price_yearly,
            JSON.stringify(coverage), JSON.stringify(benefits)
        ]);

        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Error al crear plan base:', err);
        res.status(500).json({ error: 'Error al crear plan base' });
    }
};

// Actualizar un plan base existente
exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            code, name, company_id, base_premium, description,
            price_monthly, price_yearly, coverage, benefits
        } = req.body;

        await db.promise().query(`
            UPDATE plan_base SET
                code = ?, name = ?, company_id = ?, base_premium = ?, description = ?,
                price_monthly = ?, price_yearly = ?, coverage = ?, benefits = ?
            WHERE id = ?
        `, [
            code, name, company_id, base_premium, description,
            price_monthly, price_yearly,
            JSON.stringify(coverage), JSON.stringify(benefits),
            id
        ]);

        res.json({ message: 'Plan base actualizado' });
    } catch (err) {
        console.error('Error al actualizar plan base:', err);
        res.status(500).json({ error: 'Error al actualizar plan base' });
    }
};

// Eliminar un plan base
exports.remove = async (req, res) => {
    try {
        const id = req.params.id;
        await db.promise().query(`DELETE FROM plan_base WHERE id = ?`, [id]);
        res.json({ message: 'Plan base eliminado' });
    } catch (err) {
        console.error('Error al eliminar plan base:', err);
        res.status(500).json({ error: 'Error al eliminar plan base' });
    }
};

