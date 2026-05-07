const pool = require('../config/db');


const getProfile = async (user) => {
    if (!user || !user.id) {
        throw new Error('Invalid user data provided');
    }

    const result = await pool.query(
        'SELECT id, email, role, created_at FROM users WHERE id = $1', 
        [user.id]
    );

    if (result.rows.length === 0) {
        throw new Error('User not found');
    }

    return result.rows[0];
};

const updateUser = async (id, data) => {
    const result = await pool.query(
        `UPDATE users
         SET email = COALESCE($1, email),
             name  = COALESCE($2, name)
         WHERE id = $3
         RETURNING id, email, role, created_at`,
        [data.email || null, data.name || null, id]
    );
    if (!result.rows[0]) throw new Error('User not found');
    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, email, role, created_at FROM users'
    );
    return result.rows;
};

module.exports = { getProfile, updateUser, getAllUsers };
