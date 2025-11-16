const { executeQuery } = require('../config/db');
exports.createExpense = async (req, res) => {
    try {
        const { item, amount, date, purpose, payment_method, category, note } = req.body;

        if (!item || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "item, amount, and date are required"
            });
        }

        const insertQuery = `
            INSERT INTO expenses (item, amount, expense_date, purpose, payment_method, category, note, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await executeQuery(insertQuery, [
            item,
            amount,
            date,
            purpose || null,
            payment_method || null,
            category || null,
            note,
            req.user.id
        ]);

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expenseId: result.insertId
        });

    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const id = req.user.id;
        const query = `
        SELECT ex.*, u.name as fullname, u.phone as phone FROM expenses as ex
        LEFT JOIN users as u on ex.userId = u.user_id
        WHERE ex.userId = ${id}
        `

        const result = await executeQuery(query);
        return res.status(201).send({
            success: true,
            message: "Expense Fetched successfully",
            allExpenses: result
        })
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}