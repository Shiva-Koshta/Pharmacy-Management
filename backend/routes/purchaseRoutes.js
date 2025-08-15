const express = require('express');
const {
    getAllPurchases,
    getPurchase,
    createPurchase
} = require('../controllers/purchaseController');

const router = express.Router();

// GET /apiv1/purchase - Get all purchases
router.get('/', getAllPurchases);

// GET /apiv1/purchase/:id - Get purchase by ID
router.get('/:id', getPurchase);

// POST /apiv1/purchase - Create new purchase
router.post('/', createPurchase);

module.exports = router;
