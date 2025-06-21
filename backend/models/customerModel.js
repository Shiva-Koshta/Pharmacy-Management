const pool = require('../config/db');

class Customer {
    constructor(id = null, name = "", phone = "", email = "") {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }

    // Create from database row
    static fromRow(row) {
        return new Customer(
            row.id,
            row.name,
            row.phone,
            row.email
        );
    }

    // Validate customer data
    isValid() {
        return this.name && 
               this.name.trim().length > 0 &&
               this.name.length <= 100 &&
               (!this.phone || this.phone.length <= 15) &&
               (!this.email || this.isValidEmail(this.email)) &&
               (!this.email || this.email.length <= 100);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate phone number format (basic validation)
    isValidPhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone);
    }

    // Convert to JSON for API responses
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            email: this.email
        };
    }

    // Get data for database insertion (excluding auto-generated fields)
    getInsertData() {
        return {
            name: this.name,
            phone: this.phone,
            email: this.email
        };
    }
}

// Database operations
const getAllCustomers = async () => {
    const query = 'SELECT * FROM customers ORDER BY name ASC';
    const { rows } = await pool.query(query);
    return rows.map(row => Customer.fromRow(row));
};

const getCustomerById = async (id) => {
    const query = 'SELECT * FROM customers WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
        throw new Error(`Customer with ID ${id} not found`);
    }
    return Customer.fromRow(rows[0]);
};

const addCustomer = async (customer) => {
    const query = `
        INSERT INTO customers (name, phone, email)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const data = customer.getInsertData();
    const values = [
        data.name,
        data.phone,
        data.email
    ];
    const { rows } = await pool.query(query, values);
    return Customer.fromRow(rows[0]);
};

const updateCustomer = async (id, customer) => {
    const query = `
        UPDATE customers 
        SET name = $1, phone = $2, email = $3
        WHERE id = $4
        RETURNING *;
    `;
    const data = customer.getInsertData();
    const values = [
        data.name,
        data.phone,
        data.email,
        id
    ];
    const { rows } = await pool.query(query, values);
    
    if (rows.length === 0) {
        throw new Error(`Customer with ID ${id} not found`);
    }
    return Customer.fromRow(rows[0]);
};

const deleteCustomer = async (id) => {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
        throw new Error(`Customer with ID ${id} not found`);
    }
    return Customer.fromRow(rows[0]);
};

const searchCustomers = async (searchTerm) => {
    const query = `
        SELECT * FROM customers 
        WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
        ORDER BY name ASC
    `;
    const { rows } = await pool.query(query, [`%${searchTerm}%`]);
    return rows.map(row => Customer.fromRow(row));
};

const getCustomerByEmail = async (email) => {
    const query = 'SELECT * FROM customers WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return rows.length > 0 ? Customer.fromRow(rows[0]) : null;
};

const getCustomerByPhone = async (phone) => {
    const query = 'SELECT * FROM customers WHERE phone = $1';
    const { rows } = await pool.query(query, [phone]);
    return rows.length > 0 ? Customer.fromRow(rows[0]) : null;
};

const checkCustomerExists = async (email, phone) => {
    const query = 'SELECT COUNT(*) FROM customers WHERE email = $1 OR phone = $2';
    const { rows } = await pool.query(query, [email, phone]);
    return parseInt(rows[0].count) > 0;
};

module.exports = {
    Customer,
    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
    getCustomerByEmail,
    getCustomerByPhone,
    checkCustomerExists
};
