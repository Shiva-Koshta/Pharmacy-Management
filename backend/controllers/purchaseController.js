const pool = require('../config/db');

// Get all purchases
const getAllPurchases = async (req, res) => {
  try {
    const query = `
      SELECT p.*, m.name as medicine_name, s.name as supplier_name
      FROM purchases p
      LEFT JOIN medicines m ON p.medicine_id = m.id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      ORDER BY p.purchase_date DESC
    `;
    const { rows } = await pool.query(query);
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get purchase by ID
const getPurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT p.*, m.name as medicine_name, s.name as supplier_name
      FROM purchases p
      LEFT JOIN medicines m ON p.medicine_id = m.id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new purchase
const createPurchase = async (req, res) => {
  try {
    const { medicine_id, supplier_id, quantity, purchase_price, purchase_date, invoice_number } = req.body;
    
    const query = `
      INSERT INTO purchases (medicine_id, supplier_id, quantity, purchase_price, purchase_date, invoice_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [medicine_id, supplier_id, quantity, purchase_price, purchase_date, invoice_number];
    const { rows } = await pool.query(query, values);
    
    res.status(201).json({
      success: true,
      data: rows[0],
      message: 'Purchase created successfully'
    });
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllPurchases,
  getPurchase,
  createPurchase
};
