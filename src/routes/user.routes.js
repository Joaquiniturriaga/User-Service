const express = require('express');
const {
    getProfile, updateUser, getAllUsers, updateUserAdmin,
    getAllBrigadas, createBrigada, updateBrigada,
    brigadeRespond, updateBrigadeLocation, getActiveBrigades
} = require('../controller/user.controller');
const { validateToken, authorizeRole, validateUserData } = require('../middlewares');

const router = express.Router();

// ─── USERS ───────────────────────────────────────────
router.get('/profile',               validateToken,                          getProfile);
router.put('/update',                validateToken, validateUserData,        updateUser);
router.get('/users',                 validateToken, authorizeRole('admin'),  getAllUsers);
router.put('/users/:id/admin',       validateToken, authorizeRole('admin'),  updateUserAdmin);

// ─── BRIGADAS ─────────────────────────────────────────
// ─── BRIGADE RESPONSES ────────────────────────────────
router.post('/brigadas/respond',     validateToken,                          brigadeRespond);
router.put('/brigadas/location',     validateToken,                          updateBrigadeLocation);  
router.get('/brigadas/active',       validateToken,                          getActiveBrigades);

// ─── BRIGADAS ─────────────────────────────────────────
router.get('/brigadas',              validateToken,                          getAllBrigadas);
router.post('/brigadas',             validateToken, authorizeRole('admin'),  createBrigada);
router.put('/brigadas/:id',          validateToken, authorizeRole('admin'),  updateBrigada);  

module.exports = { router };