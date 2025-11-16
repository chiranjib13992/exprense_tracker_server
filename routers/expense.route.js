const express = require('express');
const router = express.Router();
const { verifyJwtEmpToken } = require('../config/jwtHelper');
const { createExpense, getExpenses } = require('../controllers/expense.ctrl');

router.post('/create-expense', verifyJwtEmpToken, createExpense );
router.get('/all-expenses', verifyJwtEmpToken, getExpenses);

module.exports = router;