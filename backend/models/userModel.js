const pool = require('../config/db');

const findUserByPhone = async (phone) => {
  const res = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return res.rows[0];
};

module.exports = { findUserByPhone };
