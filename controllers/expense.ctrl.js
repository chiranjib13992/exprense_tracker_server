const { executeQuery } = require('../config/db');
exports.createExpense = async (req, res) => {
    try {
        const { id, item, amount, date, purpose, payment_method, category, note } = req.body;

        if (!item || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "item, amount, and date are required"
            });
        }

        if (id) {
            const updateQuery = `
                UPDATE expenses
                SET item = ?, 
                    amount = ?, 
                    expense_date = ?, 
                    purpose = ?, 
                    payment_method = ?, 
                    category = ?, 
                    note = ?
                WHERE id = ? AND userId = ?
            `;

            await executeQuery(updateQuery, [
                item,
                amount,
                date,
                purpose || null,
                payment_method || null,
                category || null,
                note || null,
                id,
                req.user.id
            ]);

            return res.status(200).json({
                success: true,
                message: "Expense updated successfully"
            });
        }

        const insertQuery = `
            INSERT INTO expenses 
            (item, amount, expense_date, purpose, payment_method, category, note, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await executeQuery(insertQuery, [
            item,
            amount,
            date,
            purpose || null,
            payment_method || null,
            category || null,
            note || null,
            req.user.id
        ]);

        return res.status(201).json({
            success: true,
            message: "Expense added successfully",
            expenseId: result.insertId
        });

    } catch (error) {
        console.error("Error saving expense:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        const id = req.user.id;
        const query = `
SELECT 
    ex.item AS source,
    ex.category AS category,
    ex.id AS id,
    ex.payment_method AS payment_method,
    ex.amount AS amount,
    ex.expense_date AS income_date,
    u.name AS fullname,
    u.phone AS phone,
    'expense' AS type,
    ex.purpose AS descriptions
FROM expenses ex
LEFT JOIN users u ON ex.userId = u.user_id
WHERE ex.userId = ${id}

UNION ALL

SELECT 
    inc.source AS source,
    inc.category AS category,
    inc.id AS id,
    inc.payment_method AS payment_method,
    inc.amount AS amount,
    inc.income_date AS income_date,
    u.name AS fullname,
    u.phone AS phone,
    'income' AS type,
    inc.descriptions AS descriptions
FROM income inc
LEFT JOIN users u ON inc.userId = u.user_id
WHERE inc.userId = ${id}

ORDER BY income_date DESC;
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

exports.getCategoryWiseExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
      SELECT 
        category,
        SUM(amount) AS totalAmount
      FROM expenses
      WHERE userId = ?
      GROUP BY category
    `;

        const result = await executeQuery(query, [userId]);

        const grandTotal = result.reduce(
            (sum, item) => sum + Number(item.totalAmount),
            0
        );

        const categoryExpenses = result.map(item => ({
            category: item.category,
            amount: Number(item.totalAmount),
            percentage: grandTotal
                ? Math.round((item.totalAmount / grandTotal) * 100)
                : 0
        }));

        return res.status(200).json({
            success: true,
            totalExpense: grandTotal,
            categoryExpenses
        });

    } catch (error) {
        console.error("Error fetching category-wise expenses:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


exports.createIncome = async (req, res) => {
    try {
        const { id, source, amount, date, descriptions, category, payment_method, note } = req.body;

        if (!source || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "source, amount, and date are required"
            });
        }

        if (id) {
            const updateQuery = `
                UPDATE income
                SET source = ?,
                    amount = ?,
                    income_date = ?,
                    descriptions = ?,
                    category = ?,
                    payment_method = ?,
                    note = ?
                WHERE id = ? AND userId = ?
            `;

            const result = await executeQuery(updateQuery, [
                source,
                amount,
                date,
                descriptions || null,
                category || null,
                payment_method || null,
                note || null,
                id,
                req.user.id
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Income not found or unauthorized"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Income updated successfully"
            });
        }

        const insertQuery = `
            INSERT INTO income 
            (source, amount, income_date, descriptions, category, payment_method, note, userId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await executeQuery(insertQuery, [
            source,
            amount,
            date,
            descriptions || null,
            category || null,
            payment_method || null,
            note || null,
            req.user.id
        ]);

        return res.status(201).json({
            success: true,
            message: "Income added successfully",
            incomeId: result.insertId
        });

    } catch (error) {
        console.error("Error saving income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Optional: Get all income for a user
exports.getAllIncome = async (req, res) => {
    try {
        const selectQuery = `
            SELECT * FROM income 
            WHERE userId = ? 
            ORDER BY income_date DESC
        `;

        const incomes = await executeQuery(selectQuery, [req.user.id]);

        return res.status(200).json({
            success: true,
            data: incomes,
            count: incomes.length
        });

    } catch (error) {
        console.error("Error fetching income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const selectQuery = `
            SELECT * FROM income 
            WHERE userId = ? 
            ORDER BY income_date DESC
        `;

        const incomes = await executeQuery(selectQuery, [req.user.id]);

        return res.status(200).json({
            success: true,
            data: incomes,
            count: incomes.length
        });
    } catch (error) {
        console.error("Error fetching income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Optional: Get income by ID
exports.getIncomeById = async (req, res) => {
    try {
        const { id } = req.params;

        const selectQuery = `
            SELECT * FROM income 
            WHERE id = ? AND userId = ?
        `;

        const income = await executeQuery(selectQuery, [id, req.user.id]);

        if (income.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: income[0]
        });

    } catch (error) {
        console.error("Error fetching income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const { source, amount, date, description, category, payment_method, note } = req.body;

        const checkQuery = `SELECT id FROM income WHERE id = ? AND userId = ?`;
        const exists = await executeQuery(checkQuery, [id, req.user.id]);

        if (exists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        const updateQuery = `
            UPDATE income 
            SET source = ?, amount = ?, income_date = ?, description = ?, 
                category = ?, payment_method = ?, note = ?
            WHERE id = ? AND userId = ?
        `;

        await executeQuery(updateQuery, [
            source,
            amount,
            date,
            description || null,
            category || null,
            payment_method || null,
            note || null,
            id,
            req.user.id
        ]);

        return res.status(200).json({
            success: true,
            message: "Income updated successfully"
        });

    } catch (error) {
        console.error("Error updating income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        const { id } = req.params;
        const checkQuery = `SELECT id FROM income WHERE id = ? AND userId = ?`;
        const exists = await executeQuery(checkQuery, [id, req.user.id]);

        if (exists.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        const deleteQuery = `DELETE FROM income WHERE id = ? AND userId = ?`;
        await executeQuery(deleteQuery, [id, req.user.id]);

        return res.status(200).json({
            success: true,
            message: "Income deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting income:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.allDashboardData = async (req, res) => {
    try {
        const selectQuery = `
          SELECT
    COALESCE(
        (SELECT SUM(amount)
         FROM income
         WHERE userId = ${req.user.id}
        ),
        0
    )
    -
    COALESCE(
        (SELECT SUM(amount)
         FROM expenses
         WHERE userId = ${req.user.id}
        ),
        0
    ) AS totalBalance,

    COALESCE(
        (SELECT SUM(amount)
         FROM income
         WHERE userId = ${req.user.id}
        ),
        0
    ) AS totalIncome,

    COALESCE(
        (SELECT SUM(amount)
         FROM expenses
         WHERE userId = ${req.user.id}
        ),
        0
    ) AS totalExpense, 
    COALESCE(
        (SELECT SUM(saving.amount)
         FROM savings as saving
         JOIN income as i ON saving.incomeId = i.id
         WHERE i.userId = ${req.user.id}
        ),
        0
    ) AS totalSavings
    ;

        `;
        const result = await executeQuery(selectQuery);
        return res.status(200).json({
            success: true,
            dahboardData: result,
        });
    } catch (err) {
        console.error("Error :", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.addToSavings = async (req, res) => {
    try {
        const { incomeId, amount, note, id } = req.body;

        if (!incomeId) {
            return res.status(400).json({
                success: false,
                message: "incomeId are required"
            });
        }

        if (id) {
            const checkSavingsQuery = `SELECT id FROM savings WHERE id = ?`;
            const exists = await executeQuery(checkSavingsQuery, [id]);
            if (exists.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Savings record not found"
                });
            }
            const updateQuery = `
                UPDATE savings 
                SET amount = ?, note = ?
                WHERE id = ?
            `;
            await executeQuery(updateQuery, [
                amount,
                note || null,
                id
            ]);
            return res.status(200).json({
                success: true,
                message: "Savings updated successfully"
            });
        }
        if (incomeId) {
            const checkQuery = `SELECT id FROM savings WHERE incomeId = ${Number(incomeId)}`;
            const exists = await executeQuery(checkQuery);
            if (exists.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "This income is already added to savings"
                });
            }
        }

        const insertQuery = `
            INSERT INTO savings (incomeId, amount, note)
            VALUES (?, ?, ?)
        `;

        const result = await executeQuery(insertQuery, [
            Number(incomeId),
            amount,
            note || null
        ]);

        return res.status(201).json({
            success: true,
            message: "Add to savings successfully",
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

exports.getTransactionById = async (req, res) => {
    try {
        const { id, type } = req.body;

        if (!id || !type) {
            return res.status(400).json({
                success: false,
                message: "ID and type are required"
            });
        }

        let tableName;

        if (type === "expenses") {
            tableName = "expenses";
        } else if (type === "income") {
            tableName = "income";
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type"
            });
        }

        const query = `
            SELECT * FROM ${tableName}
            WHERE id = ?
        `;

        const result = await executeQuery(query, [id]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        return res.status(200).json({
            success: true,
            transaction: result[0]
        });

    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

exports.getAllSavings = async (req, res) => {
    try {
        const query = `
            SELECT s.id, s.amount, s.note, s.incomeId, i.source, i.income_date , i.amount as income_amount 
            FROM savings s
            JOIN income i ON s.incomeId = i.id 
            WHERE i.userId = ?
            ORDER BY s.id DESC
        `;
        const result = await executeQuery(query, [req.user.id]);
        return res.status(200).json({
            success: true,
            savings: result
        });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

exports.getSavingsByid = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
            SELECT s.id, s.amount, s.note, s.incomeId, i.source, i.income_date , i.amount as income_amount      
            FROM savings s
            JOIN income i ON s.incomeId = i.id 
            WHERE s.id = ? AND i.userId = ?
        `;
        const result = await executeQuery(query, [id, req.user.id]);
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Savings record not found"
            });
        }
        return res.status(200).json({
            success: true,
            savings: result[0]
        });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
