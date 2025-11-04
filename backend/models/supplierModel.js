const pool = require('../config/db');

class Supplier {
    constructor(supplier_id = null, name = "", contact_person = "", phone = "", email = "", address = "") {
        this.supplier_id = supplier_id;
        this.name = name;
        this.contact_person = contact_person;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }

    // Create from database row
    static fromRow(row) {
        return new Supplier(
            row.supplier_id,
            row.name,
            row.contact_person,
            row.phone,
            row.email,
            row.address
        );
    }

    // Validate supplier data
    isValid() {
        return this.name &&
            this.name.length <= 100 &&
            (!this.contact_person || this.contact_person.length <= 100) &&
            (!this.phone || this.phone.length <= 15) &&
            (!this.email || this.isValidEmail(this.email)) &&
            (!this.email || this.email.length <= 100);
    }

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Convert to JSON for API responses
    toJSON() {
        return {
            supplier_id: this.supplier_id,
            name: this.name,
            contact_person: this.contact_person,
            phone: this.phone,
            email: this.email,
            address: this.address
        };
    }

    // Get data for database insertion (excluding auto-generated fields)
    getInsertData() {
        return {
            name: this.name,
            contact_person: this.contact_person,
            phone: this.phone,
            email: this.email,
            address: this.address
        };
    }
}

// Database operations
const getAllSuppliers = async () => {
    const query = 'SELECT * FROM suppliers ORDER BY name ASC';
    const { rows } = await pool.query(query);
    return rows.map(row => Supplier.fromRow(row));
};

const getSupplierById = async (supplier_id) => {
    const query = 'SELECT * FROM suppliers WHERE supplier_id = $1';
    const { rows } = await pool.query(query, [supplier_id]);

    if (rows.length === 0) {
        throw new Error(`Supplier with ID ${supplier_id} not found`);
    }
    return Supplier.fromRow(rows[0]);
};

const addSupplier = async (supplier) => {
    const query = `
        INSERT INTO suppliers (name, contact_person, phone, email, address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const data = supplier.getInsertData();
    const values = [
        data.name,
        data.contact_person,
        data.phone,
        data.email,
        data.address
    ];
    const { rows } = await pool.query(query, values);
    return Supplier.fromRow(rows[0]);
};

const updateSupplier = async (supplier_id, supplier) => {
    const query = `
        UPDATE suppliers 
        SET name = $1, contact_person = $2, phone = $3, email = $4, address = $5
        WHERE supplier_id = $6
        RETURNING *;
    `;
    const data = supplier.getInsertData();
    const values = [
        data.name,
        data.contact_person,
        data.phone,
        data.email,
        data.address,
        supplier_id
    ];
    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
        throw new Error(`Supplier with ID ${supplier_id} not found`);
    }
    return Supplier.fromRow(rows[0]);
};

const deleteSupplier = async (supplier_id) => {
    const query = 'DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *';
    const { rows } = await pool.query(query, [supplier_id]);

    if (rows.length === 0) {
        throw new Error(`Supplier with ID ${supplier_id} not found`);
    }
    return Supplier.fromRow(rows[0]);
};

const searchSuppliers = async (searchTerm) => {
    const query = `
        SELECT * FROM suppliers 
        WHERE name ILIKE $1 OR contact_person ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
        ORDER BY name ASC
    `;
    const { rows } = await pool.query(query, [`%${searchTerm}%`]);
    return rows.map(row => Supplier.fromRow(row));
};

const checkSupplierExists = async (email) => {
    const query = 'SELECT COUNT(*) FROM suppliers WHERE email = $1';
    const { rows } = await pool.query(query, [email]);
    return parseInt(rows[0].count) > 0;
};

module.exports = {
    Supplier,
    getAllSuppliers,
    getSupplierById,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    searchSuppliers,
    checkSupplierExists
};
