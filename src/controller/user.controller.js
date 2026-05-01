const userService = require('../service/user.service');

const getProfile = (req, res) => {
    try {
        const user = userService.getProfile(req.user);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const updateUser = (req, res) => {
    try {
        const updated = userService.updateUser(req.user.id, req.body);
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUsers = (req, res) => {
    try {
        const users = userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getProfile, updateUser, getAllUsers };