const express = require('express');
const {
    getAllMedicine,
    getMedicine,
    createMedicine,
    searchMedicines,
    getExpiredMedicines,
    getMedicinesExpiringSoon
} = require('../controllers/medicineController');

const router = express.Router();

// GET /api/medicines - Get all medicines
router.get('/', getAllMedicine);

// GET /api/medicines/search?query=paracetamol - Search medicines by name or brand
router.get('/search', searchMedicines);

// GET /api/medicines/expired - Get all expired medicines
router.get('/expired', getExpiredMedicines);

// GET /api/medicines/expiring-soon - Get medicines expiring within 30 days
router.get('/expiring-soon', getMedicinesExpiringSoon);

// GET /api/medicines/:id - Get medicine by ID
router.get('/:id', getMedicine);

// POST /api/medicines - Create new medicine
router.post('/', createMedicine);

module.exports = router;
