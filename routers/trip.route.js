const express = require('express');
const router = express.Router();
const { verifyJwtEmpToken } = require('../config/jwtHelper');
const { createtrip } = require('../controllers/trip.ctrl');

router.post('/create-trip', verifyJwtEmpToken, createtrip);

module.exports = router;