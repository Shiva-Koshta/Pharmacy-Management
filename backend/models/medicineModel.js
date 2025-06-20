const pool = require('../config/db');

class Medicine {
    constructor(id = null, name = "", brand = "", batch_id = "", quantity = 0, unit_price = 0, mrp = 0, max_discount = 0, expiry_date = "", added_on = null) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.batch_id = batch_id;
        this.quantity = quantity;
        this.unit_price = parseFloat(unit_price);
        this.mrp = parseFloat(mrp);
        this.max_discount = parseFloat(max_discount);
        this.expiry_date = expiry_date;
        this.added_on = added_on;
    }

    // Create from database row
    static fromRow(row) {
        return new Medicine(
            row.id,
            row.name,
            row.brand,
            row.batch_id,
            row.quantity,
            row.unit_price,
            row.mrp,
            row.max_discount,
            row.expiry_date,
            row.added_on
        );
    }

    // Check if medicine is expired
    isExpired() {
        if (!this.expiry_date) return false;
        return new Date(this.expiry_date) < new Date();
    }

    // Calculate discounted price
    calculateDiscountedPrice() {
        return this.mrp - (this.mrp * this.max_discount / 100);
    }

    // Validate medicine data
    isValid() {
        return this.name &&
            this.name.length <= 100 &&
            (!this.brand || this.brand.length <= 100) &&
            (!this.batch_id || this.batch_id.length <= 50) &&
            this.quantity >= 0 &&
            this.unit_price > 0 &&
            this.mrp > 0 &&
            this.max_discount >= 0 && this.max_discount <= 100;
    }

    // Convert to JSON for API responses
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            brand: this.brand,
            batch_id: this.batch_id,
            quantity: this.quantity,
            unit_price: this.unit_price,
            mrp: this.mrp,
            max_discount: this.max_discount,
            expiry_date: this.expiry_date,
            added_on: this.added_on,
            is_expired: this.isExpired(),
            discounted_price: this.calculateDiscountedPrice()
        };
    }

    // Get data for database insertion (excluding auto-generated fields)
    getInsertData() {
        return {
            name: this.name,
            brand: this.brand,
            batch_id: this.batch_id,
            quantity: this.quantity,
            unit_price: this.unit_price,
            mrp: this.mrp,
            max_discount: this.max_discount,
            expiry_date: this.expiry_date
        };
    }
}


const getAllMedicines = async () => {
    const query = 'SELECT * FROM medicines';
    const { rows } = await pool.query(query);
    
    return rows;
    // return rows.map(row => Medicine.fromRow(row));
};
const getMedicineById = async (id) => {
    const query = 'SELECT * FROM medicines WHERE id = $1';
    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
        throw new Error(`Medicine with ID ${id} not found`);
    }
    return Medicine.fromRow(rows[0]);
};

const addMedicine = async (medicine) => {
    const query = `
        INSERT INTO medicines (name, brand, batch_id, quantity, unit_price, mrp, max_discount, expiry_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
    `;
    const values = [
        medicine.name,
        medicine.brand,
        medicine.batch_id,
        medicine.quantity,
        medicine.unit_price,
        medicine.mrp,
        medicine.max_discount,
        medicine.expiry_date
    ];
    const { rows } = await pool.query(query, values);
    return rows[0].id;
};
module.exports = {
    Medicine,
    getAllMedicines,
    getMedicineById,
    addMedicine,
};