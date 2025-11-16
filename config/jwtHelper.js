const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/db');

exports.verifyJwtEmpToken = async (req, res, next) => {
    try {
        let token;
        if (req.headers && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(403).send('No token provided');
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                return res.status(401).send('Token authentication failed.');
            }
            try {
                const [user] = await executeQuery(
                    'SELECT * FROM users WHERE user_id = ?',
                    [decode.id]
                );
                if (user) {
                    req.id = decode.user_id;
                    req.user = decode;
                    next()
                } else {
                    return res.status(401).send('Authentication failed');
                }
            } catch (err) {
                return res.status(401).send('Authentication failed');
            }
        })

    } catch (err) {
        console.log(err);
    }
}