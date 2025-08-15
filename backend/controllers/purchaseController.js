const pool = require('../config/db');

// Get all purchases with filters
const getAllPurchases = async (req, res) => {
  try {
    const { start_date, end_date, supplier_name, medicine_name, invoice_number } = req.query;
    
    let query = `
      SELECT p.*, m.name as medicine_name, m.brand, m.batch_id,
             s.name as supplier_name
      FROM purchases p
      LEFT JOIN medicines m ON p.medicine_id = m.id
      LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 0;
    
    // Add filters
    if (start_date) {
      paramCount++;
      query += ` AND p.purchase_date >= $${paramCount}`;
      queryParams.push(start_date);
    }
    
    if (end_date) {
      paramCount++;
      query += ` AND p.purchase_date <= $${paramCount}`;
      queryParams.push(end_date);
    }
    
    if (supplier_name) {
      paramCount++;
      query += ` AND LOWER(s.name) LIKE LOWER($${paramCount})`;
      queryParams.push(`%${supplier_name}%`);
    }
    
    if (medicine_name) {
      paramCount++;
      query += ` AND LOWER(m.name) LIKE LOWER($${paramCount})`;
      queryParams.push(`%${medicine_name}%`);
    }
    
    if (invoice_number) {
      paramCount++;
      query += ` AND p.invoice_number LIKE $${paramCount}`;
      queryParams.push(`%${invoice_number}%`);
    }
    
    query += ` ORDER BY p.purchase_date DESC, p.invoice_number`;
    
    const { rows } = await pool.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
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

// Create new purchases (bulk purchase with same invoice number)
const createPurchase = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { supplier_name, invoice_number, purchase_date, medicines } = req.body;
    
    // Validate required fields
    if (!supplier_name || !invoice_number || !purchase_date || !medicines || medicines.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: supplier_name, invoice_number, purchase_date, medicines'
      });
    }
    
    // Find or create supplier
    let supplierResult = await client.query(
      'SELECT supplier_id FROM suppliers WHERE LOWER(name) = LOWER($1)',
      [supplier_name]
    );
    
    let supplier_id;
    if (supplierResult.rows.length === 0) {
      // Create new supplier
      const newSupplierResult = await client.query(
        'INSERT INTO suppliers (name) VALUES ($1) RETURNING supplier_id',
        [supplier_name]
      );
      supplier_id = newSupplierResult.rows[0].supplier_id;
    } else {
      supplier_id = supplierResult.rows[0].supplier_id;
    }
    
    const createdPurchases = [];
    
    // Process each medicine
    for (const medicine of medicines) {
      const { name, brand, batch_id, type, expiry_date, quantity, unit_price, mrp, discount } = medicine;
      
      // Validate medicine fields
      if (!name || !quantity || !unit_price) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Missing required medicine fields: name, quantity, unit_price for medicine ${name || 'unknown'}`
        });
      }
      
      // Find or create medicine
      let medicineResult = await client.query(
        'SELECT id FROM medicines WHERE LOWER(name) = LOWER($1) AND batch_id = $2',
        [name, batch_id || null]
      );
      
      let medicine_id;
      if (medicineResult.rows.length === 0) {
        // Create new medicine
        const newMedicineResult = await client.query(`
          INSERT INTO medicines (name, brand, batch_id, quantity, unit_price, mrp, max_discount, expiry_date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `, [name, brand || null, batch_id || null, quantity, unit_price, mrp || null, discount || 0, expiry_date || null]);
        medicine_id = newMedicineResult.rows[0].id;
      } else {
        medicine_id = medicineResult.rows[0].id;
        // Update existing medicine quantity and other details
        await client.query(`
          UPDATE medicines 
          SET quantity = quantity + $1, 
              unit_price = $2,
              mrp = COALESCE($3, mrp),
              max_discount = COALESCE($4, max_discount),
              expiry_date = COALESCE($5, expiry_date),
              brand = COALESCE($6, brand)
          WHERE id = $7
        `, [quantity, unit_price, mrp, discount, expiry_date, brand, medicine_id]);
      }
      
      // Create purchase record
      const purchaseResult = await client.query(`
        INSERT INTO purchases (medicine_id, supplier_id, quantity, purchase_price, purchase_date, invoice_number)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [medicine_id, supplier_id, quantity, unit_price, purchase_date, invoice_number]);
      
      createdPurchases.push(purchaseResult.rows[0]);
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: {
        purchases: createdPurchases,
        supplier_id,
        invoice_number,
        total_items: createdPurchases.length
      },
      message: `Purchase created successfully with ${createdPurchases.length} items`
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create purchase error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  } finally {
    client.release();
  }
};

// Get all suppliers for dropdown
const getAllSuppliers = async (req, res) => {
  try {
    const query = 'SELECT supplier_id, name FROM suppliers ORDER BY name';
    const { rows } = await pool.query(query);
    
    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllPurchases,
  getPurchase,
  createPurchase,
  getAllSuppliers
};
