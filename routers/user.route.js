const express = require('express');
const router = express.Router();
const { verifyJwtEmpToken } = require('../config/jwtHelper');
const { signUp, signIn, getUserProfile } = require('../controllers/user.ctrl');

router.post('/user/userSignup', signUp);
router.post('/user/userSignIn', signIn);
router.post('/user/findProfile', verifyJwtEmpToken, getUserProfile);

module.exports = router;