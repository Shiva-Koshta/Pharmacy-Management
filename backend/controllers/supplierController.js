const { 
    Supplier, 
    getAllSuppliers, 
    getSupplierById, 
    addSupplier, 
    updateSupplier, 
    deleteSupplier,
    searchSuppliers,
    checkSupplierExists 
} = require('../models/supplierModel');

// Get all suppliers
const getSuppliers = async (req, res) => {
    try {
        const suppliers = await getAllSuppliers();
        res.status(200).json({
            success: true,
            count: suppliers.length,
            data: suppliers.map(supplier => supplier.toJSON())
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suppliers',
            error: error.message
        });
    }
};

// Get supplier by ID
const getSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid supplier ID'
            });
        }

        const supplier = await getSupplierById(parseInt(id));
        
        res.status(200).json({
            success: true,
            data: supplier.toJSON()
        });
    } catch (error) {
        console.error('Error fetching supplier:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch supplier',
            error: error.message
        });
    }
};

// Create new supplier
const createSupplier = async (req, res) => {
    try {
        const {
            name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        // Check if supplier with same email already exists
        if (email && await checkSupplierExists(email)) {
            return res.status(409).json({
                success: false,
                message: 'Supplier with this email already exists'
            });
        }

        // Create new Supplier instance
        const supplier = new Supplier(
            null, // supplier_id will be auto-generated
            name,
            contact_person,
            phone,
            email,
            address
        );

        // Validate supplier data
        if (!supplier.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid supplier data',
                errors: validateSupplierErrors(supplier)
            });
        }

        // Save to database
        const createdSupplier = await addSupplier(supplier);
        
        res.status(201).json({
            success: true,
            message: 'Supplier created successfully',
            data: createdSupplier.toJSON()
        });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create supplier',
            error: error.message
        });
    }
};

// Update supplier
const updateSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            contact_person,
            phone,
            email,
            address
        } = req.body;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid supplier ID'
            });
        }

        // Check if email is being changed and if it already exists
        if (email) {
            const existingSupplier = await getSupplierById(parseInt(id));
            if (existingSupplier.email !== email && await checkSupplierExists(email)) {
                return res.status(409).json({
                    success: false,
                    message: 'Supplier with this email already exists'
                });
            }
        }

        // Create updated supplier instance
        const supplier = new Supplier(
            parseInt(id),
            name,
            contact_person,
            phone,
            email,
            address
        );

        // Validate supplier data
        if (!supplier.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid supplier data',
                errors: validateSupplierErrors(supplier)
            });
        }

        // Update in database
        const updatedSupplier = await updateSupplier(parseInt(id), supplier);
        
        res.status(200).json({
            success: true,
            message: 'Supplier updated successfully',
            data: updatedSupplier.toJSON()
        });
    } catch (error) {
        console.error('Error updating supplier:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update supplier',
            error: error.message
        });
    }
};

// Delete supplier
const deleteSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid supplier ID'
            });
        }

        const deletedSupplier = await deleteSupplier(parseInt(id));
        
        res.status(200).json({
            success: true,
            message: 'Supplier deleted successfully',
            data: deletedSupplier.toJSON()
        });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to delete supplier',
            error: error.message
        });
    }
};

// Search suppliers
const searchSuppliersController = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        const suppliers = await searchSuppliers(query.trim());

        res.status(200).json({
            success: true,
            count: suppliers.length,
            query: query,
            data: suppliers.map(supplier => supplier.toJSON())
        });
    } catch (error) {
        console.error('Error searching suppliers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search suppliers',
            error: error.message
        });
    }
};

// Get suppliers count
const getSuppliersCount = async (req, res) => {
    try {
        const suppliers = await getAllSuppliers();
        res.status(200).json({
            success: true,
            count: suppliers.length
        });
    } catch (error) {
        console.error('Error getting suppliers count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get suppliers count',
            error: error.message
        });
    }
};

// Helper function to validate supplier and return specific errors
const validateSupplierErrors = (supplier) => {
    const errors = [];
    
    if (!supplier.name) {
        errors.push('Supplier name is required');
    } else if (supplier.name.length > 100) {
        errors.push('Supplier name must be 100 characters or less');
    }
    
    if (supplier.contact_person && supplier.contact_person.length > 100) {
        errors.push('Contact person name must be 100 characters or less');
    }
    
    if (supplier.phone && supplier.phone.length > 15) {
        errors.push('Phone number must be 15 characters or less');
    }
    
    if (supplier.email && !supplier.isValidEmail(supplier.email)) {
        errors.push('Invalid email format');
    }
    
    if (supplier.email && supplier.email.length > 100) {
        errors.push('Email must be 100 characters or less');
    }
    
    return errors;
};

module.exports = {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplierById,
    deleteSupplierById,
    searchSuppliersController,
    getSuppliersCount
};
