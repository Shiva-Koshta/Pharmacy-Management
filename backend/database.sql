-- Create table: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    license_no VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'pharmacist',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table: medicines
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    batch_id VARCHAR(50),
    quantity INT DEFAULT 0,
    unit_price NUMERIC(10, 2),
    mrp NUMERIC(10, 2),
    max_discount NUMERIC(5, 2),
    expiry_date DATE,
    added_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table: suppliers
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT
);

-- Create table: purchases
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    medicine_id INT NOT NULL,
    supplier_id INT NOT NULL,
    quantity INT NOT NULL,
    purchase_price NUMERIC(10, 2),
    purchase_date DATE,
    invoice_number VARCHAR(50),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE
);

-- Create table: customers
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100)
);

-- Create table: sales
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    customer_id INT,
    total_amount NUMERIC(10, 2),
    discount_applied NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Create table: sales_items
CREATE TABLE sales_items (
    id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL,
    medicine_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2),
    discount NUMERIC(5, 2),
    total NUMERIC(10, 2),
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);
