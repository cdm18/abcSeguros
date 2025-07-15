const router = require('express').Router();
const db     = require('../db');
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

/* ========= GET /api/me  (ya lo usas) ========= */
/* ========= PUT /api/me  (actualizar perfil) ========= */
router.put('/me', (req, res) => {
    const id = 1;                               // ← obtén de la sesión/JWT
    const { full_name, phone, bio } = req.body;

    const sql = 'UPDATE users SET full_name=?, phone=?, bio=? WHERE id=?';
    db.query(sql, [full_name, phone, bio, id], err =>
        err ? res.status(500).json({ error: err.message })
            : res.json({ message: 'Perfil actualizado' })
    );
});

/* ========= POST /api/me/avatar  (subir imagen) ========= */
const upload = multer({ dest: 'uploads/' });

router.post('/me/avatar', upload.single('avatar'), (req, res) => {
    const id = 1;
    if (!req.file) return res.status(400).json({ error: 'Sin archivo' });

    // Mueve/renombra a una carpeta propia
    const ext  = path.extname(req.file.originalname);
    const file = `avatar_${id}${ext}`;
    fs.renameSync(req.file.path, path.join('uploads', file));

    const url = `http://localhost:3000/uploads/${file}`;
    db.query('UPDATE users SET avatar_url=? WHERE id=?', [url, id], err =>
        err ? res.status(500).json({ error: err.message })
            : res.json({ avatar_url: url })
    );
});

module.exports = router;
