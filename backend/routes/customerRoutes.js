const express = require('express');
const {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
    searchCustomersController,
    getCustomerByEmailController,
    getCustomerByPhoneController,
    getCustomersCount
} = require('../controllers/customerController');

const router = express.Router();

// GET /api/customers - Get all customers
router.get('/', getCustomers);

// GET /api/customers/search?query=term - Search customers
router.get('/search', searchCustomersController);

// GET /api/customers/count - Get customers count
router.get('/count', getCustomersCount);

// GET /api/customers/email/:email - Get customer by email
router.get('/email/:email', getCustomerByEmailController);

// GET /api/customers/phone/:phone - Get customer by phone
router.get('/phone/:phone', getCustomerByPhoneController);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', getCustomer);

// POST /api/customers - Create new customer
router.post('/', createCustomer);

// PUT /api/customers/:id - Update customer by ID
router.put('/:id', updateCustomerById);

// DELETE /api/customers/:id - Delete customer by ID
router.delete('/:id', deleteCustomerById);

module.exports = router;
