// routes/auth.js  (nuevo router)
const router = require('express').Router();
const db     = require('../db');

/* Devuelve datos del usuario autenticado.
   Por ahora usa userId=1 fijo; luego cambias a JWT/Session */
router.get('/me', (_, res)=>{
    const userId = 1;                   // TODO: leer de token
    db.query('SELECT id,username,full_name,avatar_url FROM users WHERE id=?',[userId],
        (err,rows)=>
            err ? res.status(500).json({error:err.message})
                : res.json(rows[0])
    );
});

module.exports = router;
