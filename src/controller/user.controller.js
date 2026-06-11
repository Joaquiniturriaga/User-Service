const userService = require('../service/user.service');

// ─── USERS ───────────────────────────────────────────

const getProfile = async (req, res) => {
    try {
        console.log('getProfile called, user:', req.user);
        const user = await userService.getProfile(req.user);
        console.log('getProfile result:', user);
        res.json(user);
    } catch (error) {
        console.error('getProfile error:', error.message);
        res.status(404).json({ error: error.message });
    }
};
const updateUser = async (req, res) => {
    try {
        const updated = await userService.updateUser(req.user.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin: asignar brigada y/o cambiar estado de usuario
const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await userService.updateUserAdmin(id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ─── BRIGADAS ─────────────────────────────────────────

const getAllBrigadas = async (req, res) => {
    try {
        const brigadas = await userService.getAllBrigadas();
        res.json(brigadas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBrigada = async (req, res) => {
    try {
        const brigada = await userService.createBrigada(req.body);
        res.status(201).json(brigada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateBrigada = async (req, res) => {
    try {
        const { id } = req.params;
        const brigada = await userService.updateBrigada(id, req.body);
        res.json(brigada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ─── BRIGADE RESPONSES ────────────────────────────────

const brigadeRespond = async (req, res) => {
    try {
        const { report_id, estado } = req.body;
        const brigade_id = req.user.brigade_id;
        if (!brigade_id) return res.status(403).json({ error: 'User has no brigade assigned' });
        if (!report_id)  return res.status(400).json({ error: 'report_id is required' });

        const result = await userService.brigadeRespond(brigade_id, report_id, estado);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateBrigadeLocation = async (req, res) => {
    try {
        const { report_id, lat, lng } = req.body;
        const brigade_id = req.user.brigade_id;
        if (!brigade_id) return res.status(403).json({ error: 'User has no brigade assigned' });

        const result = await userService.updateBrigadeLocation(brigade_id, report_id, lat, lng);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getActiveBrigades = async (req, res) => {
    try {
        const active = await userService.getActiveBrigades();
        res.json(active);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile, updateUser, getAllUsers, updateUserAdmin,
    getAllBrigadas, createBrigada, updateBrigada,
    brigadeRespond, updateBrigadeLocation, getActiveBrigades
};