const express = require('express');
const cors    = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db      = require('./db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));

// Middleware para logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Crear directorio para avatares si no existe
const uploadDir = 'uploads/avatars/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer para subir archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)'));
        }
    }
});

/* ----------------  AUTH ---------------- */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    db.query(
        'SELECT id, username, full_name, phone, bio, avatar_url FROM users WHERE username=? AND password=?',
        [username, password],
        (err, rows) => {
            if (err) {
                console.error('Error en login:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (!rows.length) {
                return res.status(401).json({ error: 'Credenciales incorrectas' });
            }

            const user = rows[0];
            res.json({
                message: 'Login exitoso',
                user: {
                    id: user.id,
                    username: user.username,
                    full_name: user.full_name,
                    phone: user.phone,
                    bio: user.bio,
                    avatar_url: user.avatar_url
                }
            });
        }
    );
});

/* ----------------  USER DATA ---------------- */
app.get('/api/me', (req, res) => {
    // Por ahora usamos userId=1 fijo; después implementar JWT
    const userId = 1;

    db.query(
        'SELECT id, username, full_name, phone, bio, avatar_url FROM users WHERE id=?',
        [userId],
        (err, rows) => {
            if (err) {
                console.error('Error obteniendo usuario:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (!rows.length) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json(rows[0]);
        }
    );
});

/* ----------------  UPDATE USER PROFILE ---------------- */
app.put('/api/me', (req, res) => {
    // Por ahora usamos userId=1 fijo; después implementar JWT
    const userId = 1;
    const { full_name, phone, bio } = req.body;

    // Validar que full_name no esté vacío
    if (!full_name || !full_name.trim()) {
        return res.status(400).json({ error: 'El nombre completo es requerido' });
    }

    const sql = `
        UPDATE users 
        SET full_name = ?, phone = ?, bio = ?, updated_at = NOW()
        WHERE id = ?
    `;

    db.query(sql, [full_name.trim(), phone || null, bio || null, userId], (err, result) => {
        if (err) {
            console.error('Error actualizando perfil:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ message: 'Perfil actualizado exitosamente' });
    });
});

/* ----------------  UPLOAD AVATAR ---------------- */
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha enviado ningún archivo' });
    }

    const userId = 1; // Por ahora usamos userId=1 fijo
    const avatarUrl = `http://localhost:3000/uploads/avatars/${req.file.filename}`;

    // Actualizar la URL del avatar en la base de datos
    db.query(
        'UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?',
        [avatarUrl, userId],
        (err, result) => {
            if (err) {
                console.error('Error actualizando avatar:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            res.json({ avatar_url: avatarUrl });
        }
    );
});

/* ----------------  DASHBOARD ---------------- */
app.get('/api/dashboard/summary', (req, res) => {
    const sql = `
    SELECT
      (SELECT COUNT(*) FROM clients) AS totalClients,
      (SELECT COUNT(*) FROM policies) AS totalPolicies,
      (SELECT COUNT(*) FROM payments WHERE status='ON_TIME') AS onTimePayments,
      (SELECT COUNT(*) FROM payments WHERE status='PENDING') AS pendingPayments
  `;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error obteniendo resumen:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Asegurar que los valores sean números
        const summary = {
            totalClients: parseInt(rows[0].totalClients) || 0,
            totalPolicies: parseInt(rows[0].totalPolicies) || 0,
            onTimePayments: parseInt(rows[0].onTimePayments) || 0,
            pendingPayments: parseInt(rows[0].pendingPayments) || 0
        };

        res.json(summary);
    });
});

app.get('/api/dashboard/clients', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;

    const sql = `
    SELECT 
      c.id,
      CONCAT(c.first_name, ' ', c.last_name) AS name,
      c.email,
      pl.name AS plan,
      pol.total_premium AS total,
      pol.status
    FROM clients c
    LEFT JOIN policies pol ON pol.client_id = c.id AND pol.status = 'ACTIVE'
    LEFT JOIN plans pl ON pl.id = pol.plan_id
    ORDER BY c.created_at DESC, c.id DESC
    LIMIT ?
  `;

    db.query(sql, [limit], (err, rows) => {
        if (err) {
            console.error('Error obteniendo clientes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Procesar los datos para el frontend
        const clients = rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            plan: row.plan,
            total: row.total ? parseFloat(row.total) : null,
            status: row.status
        }));

        res.json(clients);
    });
});

/* ----------------  SEARCH ---------------- */
app.get('/api/search', (req, res) => {
    const term = req.query.term;

    if (!term) {
        return res.json([]);
    }

    const searchTerm = `%${term}%`;

    const sqlClients = `
    SELECT 
      id, 
      CONCAT(first_name, ' ', last_name) AS label,
      'client' AS type
    FROM clients
    WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?
    LIMIT 5
  `;

    const sqlPolicies = `
    SELECT 
      id, 
      policy_number AS label,
      'policy' AS type
    FROM policies
    WHERE policy_number LIKE ?
    LIMIT 5
  `;

    // Ejecutar búsqueda de clientes
    db.query(sqlClients, [searchTerm, searchTerm, searchTerm], (err, clientResults) => {
        if (err) {
            console.error('Error en búsqueda de clientes:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Ejecutar búsqueda de pólizas
        db.query(sqlPolicies, [searchTerm], (err, policyResults) => {
            if (err) {
                console.error('Error en búsqueda de pólizas:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            const results = [...clientResults, ...policyResults];
            res.json(results);
        });
    });
});

/* ----------------  ROUTERS ADICIONALES ---------------- */
// Importar y usar routers adicionales
try {
    const profileRoutes = require('./routes/profile');
    app.use('/api', profileRoutes);
} catch (error) {
    console.warn('Profile routes no se pudo cargar:', error.message);
}

try {
    app.use('/api', require('./routes/auth'));
    app.use('/api', require('./routes/plans'));
    app.use('/api', require('./routes/quotations'));
} catch (error) {
    console.warn('Algunos routers no se pudieron cargar:', error.message);
}

/* ----------------  ERROR HANDLING ---------------- */
// Manejo de errores de multer
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 2MB.' });
        }
        return res.status(400).json({ error: 'Error en la carga del archivo.' });
    }

    if (error.message === 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)') {
        return res.status(400).json({ error: error.message });
    }

    next(error);
});

// Error handler general
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

/* ----------------  START SERVER ---------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Backend ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Dashboard disponible en http://localhost:4200`);
});

// Manejo de errores de base de datos
db.on('error', (err) => {
    console.error('Error de base de datos:', err);
});

process.on('SIGINT', () => {
    console.log('\n🔄 Cerrando servidor...');
    db.end();
    process.exit(0);
});