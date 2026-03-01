const express = require('express');
const router = express.Router();
const { verifyJwtEmpToken } = require('../config/jwtHelper');
const { createExpense, getExpenses, getCategoryWiseExpenses, createIncome, allDashboardData, addToSavings } = require('../controllers/expense.ctrl');

router.post('/create-expense', verifyJwtEmpToken, createExpense );
router.get('/all-expenses', verifyJwtEmpToken, getExpenses);
router.get('/categoriwise-expenses', verifyJwtEmpToken, getCategoryWiseExpenses);
router.post('/create-income', verifyJwtEmpToken, createIncome);
router.get('/all-dashboard-data', verifyJwtEmpToken, allDashboardData);
router.post('/add-to-savings', verifyJwtEmpToken, addToSavings);

module.exports = router;