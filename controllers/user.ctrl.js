const { executeQuery } = require('../config/db');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');


exports.signUp = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const existingUser = await executeQuery(
            'SELECT * FROM users WHERE phone = ? OR email = ?',
            [phone, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'CALL insertUser(?, ?, ?, ?)';
        await executeQuery(insertUserQuery, [name, email, phone, hashedPassword]);

        return res.status(201).json({ message: '✅ User created successfully' });

    } catch (error) {
        console.error('❌ Signup Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.signIn = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error('Login Error:', err);
            return res.status(500).json({ message: 'Server error during login' });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Unauthorized' });
        }

        const token = generateJwt(user);
        return res.status(200).json({
            message: '✅ Login successful',
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    })(req, res, next);
}

function generateJwt(user) {
  return jwt.sign(
    { id: user.user_id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}