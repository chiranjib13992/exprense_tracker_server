// config/db.js
const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../development.env') });

let pool;

const connectDB = () => {
  return new Promise((resolve, reject) => {
    try {
      pool = mysql.createPool({
        host: process.env.MYSQLHOST,
        port: process.env.MYSQLPORT,
        user: process.env.MYSQLUSER,
        password: process.env.MYSQLPASSWORD,
        database: process.env.MYSQLDATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      pool.getConnection((err, connection) => {
        if (err) {
          console.error('❌ MySQL connection failed:', err.message);
          reject(err);
        } else {
          console.log('✅ MySQL Database Connected!');
          connection.release();
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Add this to the bottom of config/db.js
const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { connectDB, executeQuery };

