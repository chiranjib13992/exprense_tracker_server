const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/user.ctrl');

router.post('/user/userSignup', signUp);

router.post('/user/signIn', signIn);

module.exports = router;