const express = require('express');
const {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplierById,
    deleteSupplierById,
    searchSuppliersController,
    getSuppliersCount
} = require('../controllers/supplierController');

const router = express.Router();

// GET /api/suppliers - Get all suppliers
router.get('/', getSuppliers);

// GET /api/suppliers/search?query=term - Search suppliers
router.get('/search', searchSuppliersController);

// GET /api/suppliers/count - Get suppliers count
router.get('/count', getSuppliersCount);

// GET /api/suppliers/:id - Get supplier by ID
router.get('/:id', getSupplier);

// POST /api/suppliers - Create new supplier
router.post('/', createSupplier);

// PUT /api/suppliers/:id - Update supplier by ID
router.put('/:id', updateSupplierById);

// DELETE /api/suppliers/:id - Delete supplier by ID
router.delete('/:id', deleteSupplierById);

module.exports = router;

