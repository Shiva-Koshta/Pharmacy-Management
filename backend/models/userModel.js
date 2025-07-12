const pool = require('../config/db');

const findUserByPhone = async (phone) => {
  const res = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return res.rows[0];
};

const createUser = async ({ name, email, phone, license_no, password, role }) => {
  const query = `
    INSERT INTO users (name, email, phone, license_no, password, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, email, phone, license_no, role, created_at;
  `;

  const values = [name, email, phone, license_no, password, role || 'pharmacist'];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getUserByEmailOrPhone = async (email, phone) => {
  const query = `SELECT * FROM users WHERE email = $1 OR phone = $2`;
  const { rows } = await pool.query(query, [email, phone]);
  return rows[0];
};

const getUserById = async (id) => {
  const query = `SELECT id, name, email, phone, license_no, role, created_at FROM users WHERE id = $1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  findUserByPhone,
  createUser,
  getUserByEmailOrPhone,
  getUserById,
};
