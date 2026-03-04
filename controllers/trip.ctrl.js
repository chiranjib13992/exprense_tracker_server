const { executeQuery } = require('../config/db');

exports.createtrip = async (req, res) => {
    try {
        const { tripTitle, note, startDate, memebrs } = req.body;
        const created_by = req.user.id;
        const insertTripQuery = 'CALL createTrip(?, ?, ?, ?, ?)';
        await executeQuery(insertTripQuery, [
            tripTitle,
            note,
            startDate,
            JSON.stringify(memebrs),
            created_by
        ]);

        return res.status(201).json({ message: '✅ Trip created successfully' });
    } catch (error) {
        console.error('❌ Trip Creation Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}