const pool = require('../config/db');

// ─── USERS ───────────────────────────────────────────

const getProfile = async (user) => {
    if (!user || !user.id) throw new Error('Invalid user data provided');

    const result = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.estado, u.created_at,
                b.id AS brigade_id, b.nombre AS brigade_nombre, b.zona AS brigade_zona
         FROM users u
         LEFT JOIN brigadas b ON u.brigade_id = b.id
         WHERE u.id = $1`,
        [user.id]
    );

    if (result.rows.length === 0) throw new Error('User not found');
    return result.rows[0];
};

const updateUser = async (id, data) => {
    const result = await pool.query(
        `UPDATE users
         SET email = COALESCE($1, email),
             name  = COALESCE($2, name)
         WHERE id = $3
         RETURNING id, email, name, role, estado, created_at`,
        [data.email || null, data.name || null, id]
    );
    if (!result.rows[0]) throw new Error('User not found');
    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query(
        `SELECT u.id, u.email, u.name, u.role, u.estado, u.created_at,
                b.nombre AS brigade_nombre, b.zona AS brigade_zona
         FROM users u
         LEFT JOIN brigadas b ON u.brigade_id = b.id
         ORDER BY u.created_at DESC`
    );
    return result.rows;
};

// Asignar brigada + cambiar estado (solo admin)
const updateUserAdmin = async (id, { brigade_id, estado }) => {
    const result = await pool.query(
        `UPDATE users
         SET brigade_id = COALESCE($1, brigade_id),
             estado     = COALESCE($2, estado)
         WHERE id = $3
         RETURNING id, email, name, role, estado, brigade_id, created_at`,
        [brigade_id || null, estado || null, id]
    );
    if (!result.rows[0]) throw new Error('User not found');
    return result.rows[0];
};

// ─── BRIGADAS ─────────────────────────────────────────

const getAllBrigadas = async () => {
    const result = await pool.query(
        `SELECT b.id, b.nombre, b.dominio, b.zona, b.activa, b.created_at,
                COUNT(u.id) AS total_miembros
         FROM brigadas b
         LEFT JOIN users u ON u.brigade_id = b.id
         GROUP BY b.id
         ORDER BY b.nombre`
    );
    return result.rows;
};

const createBrigada = async ({ nombre, dominio, zona }) => {
    if (!nombre) throw new Error('nombre is required');
    const result = await pool.query(
        `INSERT INTO brigadas (nombre, dominio, zona)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [nombre, dominio || null, zona || null]
    );
    return result.rows[0];
};

const updateBrigada = async (id, { nombre, dominio, zona, activa }) => {
    const result = await pool.query(
        `UPDATE brigadas
         SET nombre = COALESCE($1, nombre),
             dominio = COALESCE($2, dominio),
             zona   = COALESCE($3, zona),
             activa = COALESCE($4, activa)
         WHERE id = $5
         RETURNING *`,
        [nombre || null, dominio || null, zona || null, activa ?? null, id]
    );
    if (!result.rows[0]) throw new Error('Brigada not found');
    return result.rows[0];
};

// ─── BRIGADE RESPONSES ────────────────────────────────

// Brigada acepta reporte → crea o actualiza brigade_response
const brigadeRespond = async (brigade_id, report_id, estado = 'EN_CAMINO') => {
    // Verificar que nadie más ya está EN_CAMINO o EN_SITIO para este reporte
    const conflict = await pool.query(
        `SELECT br.id, b.nombre FROM brigade_responses br
         JOIN brigadas b ON b.id = br.brigade_id
         WHERE br.report_id = $1 AND br.estado IN ('EN_CAMINO','EN_SITIO')
           AND br.brigade_id != $2`,
        [report_id, brigade_id]
    );

    // Upsert: si ya existe respuesta de esta brigada la actualiza, si no crea
    const result = await pool.query(
        `INSERT INTO brigade_responses (brigade_id, report_id, estado, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (brigade_id, report_id)
         DO UPDATE SET estado = $3, updated_at = NOW()
         RETURNING *`,
        [brigade_id, report_id, estado]
    );

    return {
        response: result.rows[0],
        warning: conflict.rows.length > 0
            ? `${conflict.rows[0].nombre} is already responding to this report`
            : null
    };
};

// Actualizar ubicación del camión
const updateBrigadeLocation = async (brigade_id, report_id, lat, lng) => {
    const result = await pool.query(
        `UPDATE brigade_responses
         SET lat = $1, lng = $2, updated_at = NOW()
         WHERE brigade_id = $3 AND report_id = $4
         RETURNING *`,
        [lat, lng, brigade_id, report_id]
    );
    if (!result.rows[0]) throw new Error('No active response found for this brigade and report');
    return result.rows[0];
};

// Camiones activos para el mapa (polling cada 1 minuto)
const getActiveBrigades = async () => {
    const result = await pool.query(
        `SELECT br.id, br.brigade_id, br.report_id, br.estado,
                br.lat, br.lng, br.updated_at,
                b.nombre AS brigade_nombre, b.zona
         FROM brigade_responses br
         JOIN brigadas b ON b.id = br.brigade_id
         WHERE br.estado IN ('EN_CAMINO','EN_SITIO')
           AND br.lat IS NOT NULL AND br.lng IS NOT NULL`
    );
    return result.rows;
};

module.exports = {
    getProfile, updateUser, getAllUsers, updateUserAdmin,
    getAllBrigadas, createBrigada, updateBrigada,
    brigadeRespond, updateBrigadeLocation, getActiveBrigades
};