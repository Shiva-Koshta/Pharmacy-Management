const { Medicine, getAllMedicines, getMedicineById, addMedicine } = require('../models/medicineModel');

// Get all medicines
const getAllMedicine = async (req, res) => {
    try {
        const medicines = await getAllMedicines();
        res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medicines',
            error: error.message
        });
    }
};

// Get medicine by ID
const getMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid medicine ID'
            });
        }

        const medicine = await getMedicineById(parseInt(id));
        
        res.status(200).json({
            success: true,
            data: medicine.toJSON()
        });
    } catch (error) {
        console.error('Error fetching medicine:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medicine',
            error: error.message
        });
    }
};

// Create new medicine
const createMedicine = async (req, res) => {
    try {
        const {
            name,
            brand,
            batch_id,
            quantity,
            unit_price,
            mrp,
            max_discount,
            expiry_date
        } = req.body;

        // Create new Medicine instance
        const medicine = new Medicine(
            null, // id will be auto-generated
            name,
            brand,
            batch_id,
            quantity,
            unit_price,
            mrp,
            max_discount,
            expiry_date
        );

        // Validate medicine data
        if (!medicine.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid medicine data',
                errors: validateMedicineErrors(medicine)
            });
        }

        // Save to database
        const medicineId = await addMedicine(medicine);
        
        // Fetch the created medicine to return complete data
        const createdMedicine = await getMedicineById(medicineId);
        
        res.status(201).json({
            success: true,
            message: 'Medicine created successfully',
            data: createdMedicine.toJSON()
        });
    } catch (error) {
        console.error('Error creating medicine:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create medicine',
            error: error.message
        });
    }
};

// Search medicines by name or brand
const searchMedicines = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        const medicines = await getAllMedicines();
        const searchTerm = query.toLowerCase().trim();
        
        const filteredMedicines = medicines.filter(medicine => 
            medicine.name.toLowerCase().includes(searchTerm) ||
            (medicine.brand && medicine.brand.toLowerCase().includes(searchTerm))
        );

        res.status(200).json({
            success: true,
            count: filteredMedicines.length,
            query: query,
            data: filteredMedicines
        });
    } catch (error) {
        console.error('Error searching medicines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search medicines',
            error: error.message
        });
    }
};

// Get expired medicines
const getExpiredMedicines = async (req, res) => {
    try {
        const medicines = await getAllMedicines();
        const expiredMedicines = medicines.filter(medicine => {
            const med = Medicine.fromRow(medicine);
            return med.isExpired();
        });

        res.status(200).json({
            success: true,
            count: expiredMedicines.length,
            data: expiredMedicines
        });
    } catch (error) {
        console.error('Error fetching expired medicines:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch expired medicines',
            error: error.message
        });
    }
};

// Get medicines expiring soon (within 30 days)
const getMedicinesExpiringSoon = async (req, res) => {
    try {
        const medicines = await getAllMedicines();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const expiringSoon = medicines.filter(medicine => {
            if (!medicine.expiry_date) return false;
            const expiryDate = new Date(medicine.expiry_date);
            const now = new Date();
            return expiryDate > now && expiryDate <= thirtyDaysFromNow;
        });

        res.status(200).json({
            success: true,
            count: expiringSoon.length,
            data: expiringSoon
        });
    } catch (error) {
        console.error('Error fetching medicines expiring soon:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch medicines expiring soon',
            error: error.message
        });
    }
};

// Helper function to validate medicine and return specific errors
const validateMedicineErrors = (medicine) => {
    const errors = [];
    
    if (!medicine.name) {
        errors.push('Medicine name is required');
    } else if (medicine.name.length > 100) {
        errors.push('Medicine name must be 100 characters or less');
    }
    
    if (medicine.brand && medicine.brand.length > 100) {
        errors.push('Brand name must be 100 characters or less');
    }
    
    if (medicine.batch_id && medicine.batch_id.length > 50) {
        errors.push('Batch ID must be 50 characters or less');
    }
    
    if (medicine.quantity < 0) {
        errors.push('Quantity cannot be negative');
    }
    
    if (medicine.unit_price <= 0) {
        errors.push('Unit price must be greater than 0');
    }
    
    if (medicine.mrp <= 0) {
        errors.push('MRP must be greater than 0');
    }
    
    if (medicine.max_discount < 0 || medicine.max_discount > 100) {
        errors.push('Max discount must be between 0 and 100');
    }
    
    return errors;
};

module.exports = {
    getAllMedicine,
    getMedicine,
    createMedicine,
    searchMedicines,
    getExpiredMedicines,
    getMedicinesExpiringSoon
};
