const express = require('express');
const {
    getAllPurchases,
    getPurchase,
    createPurchase,
    getAllSuppliers
} = require('../controllers/purchaseController');

const router = express.Router();

// GET /apiv1/purchase - Get all purchases with filters
router.get('/', getAllPurchases);

// GET /apiv1/purchase/suppliers - Get all suppliers
router.get('/suppliers', getAllSuppliers);

// GET /apiv1/purchase/:id - Get purchase by ID
router.get('/:id', getPurchase);

// POST /apiv1/purchase - Create new purchase
router.post('/', createPurchase);

module.exports = router;
