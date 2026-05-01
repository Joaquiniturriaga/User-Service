const express = require('express');
const { getProfile, updateUser, getAllUsers } = require('../controller/user.controller');
const { validateToken, authorizeRole, validateUserData } = require('../middlewares');

const router = express.Router();

router.get('/profile', validateToken, getProfile);
router.put('/update', validateToken, validateUserData, updateUser);
router.get('/users', validateToken, authorizeRole('admin'), getAllUsers);

module.exports = { router };