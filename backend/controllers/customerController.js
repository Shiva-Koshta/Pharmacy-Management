const { 
    Customer, 
    getAllCustomers, 
    getCustomerById, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    searchCustomers,
    getCustomerByEmail,
    getCustomerByPhone,
    checkCustomerExists 
} = require('../models/customerModel');

// Get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers.map(customer => customer.toJSON())
        });
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers',
            error: error.message
        });
    }
};

// Get customer by ID
const getCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID'
            });
        }

        const customer = await getCustomerById(parseInt(id));
        
        res.status(200).json({
            success: true,
            data: customer.toJSON()
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const { name, phone, email } = req.body;

        // Check if customer with same email or phone already exists
        if ((email || phone) && await checkCustomerExists(email, phone)) {
            return res.status(409).json({
                success: false,
                message: 'Customer with this email or phone already exists'
            });
        }

        // Create new Customer instance
        const customer = new Customer(
            null, // id will be auto-generated
            name,
            phone,
            email
        );

        // Validate customer data
        if (!customer.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer data',
                errors: validateCustomerErrors(customer)
            });
        }

        // Additional phone validation
        if (phone && !customer.isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Save to database
        const createdCustomer = await addCustomer(customer);
        
        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: createdCustomer.toJSON()
        });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create customer',
            error: error.message
        });
    }
};

// Update customer
const updateCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email } = req.body;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID'
            });
        }

        // Check if the customer exists
        const existingCustomer = await getCustomerById(parseInt(id));

        // Check if email or phone is being changed and if they already exist
        if (email && existingCustomer.email !== email) {
            const emailExists = await getCustomerByEmail(email);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Customer with this email already exists'
                });
            }
        }

        if (phone && existingCustomer.phone !== phone) {
            const phoneExists = await getCustomerByPhone(phone);
            if (phoneExists) {
                return res.status(409).json({
                    success: false,
                    message: 'Customer with this phone already exists'
                });
            }
        }

        // Create updated customer instance
        const customer = new Customer(
            parseInt(id),
            name,
            phone,
            email
        );

        // Validate customer data
        if (!customer.isValid()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer data',
                errors: validateCustomerErrors(customer)
            });
        }

        // Additional phone validation
        if (phone && !customer.isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Update in database
        const updatedCustomer = await updateCustomer(parseInt(id), customer);
        
        res.status(200).json({
            success: true,
            message: 'Customer updated successfully',
            data: updatedCustomer.toJSON()
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update customer',
            error: error.message
        });
    }
};

// Delete customer
const deleteCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid customer ID'
            });
        }

        const deletedCustomer = await deleteCustomer(parseInt(id));
        
        res.status(200).json({
            success: true,
            message: 'Customer deleted successfully',
            data: deletedCustomer.toJSON()
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to delete customer',
            error: error.message
        });
    }
};

// Search customers
const searchCustomersController = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query || query.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search query must be at least 2 characters long'
            });
        }

        const customers = await searchCustomers(query.trim());

        res.status(200).json({
            success: true,
            count: customers.length,
            query: query,
            data: customers.map(customer => customer.toJSON())
        });
    } catch (error) {
        console.error('Error searching customers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search customers',
            error: error.message
        });
    }
};

// Get customer by email
const getCustomerByEmailController = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const customer = await getCustomerByEmail(email);
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: customer.toJSON()
        });
    } catch (error) {
        console.error('Error fetching customer by email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
};

// Get customer by phone
const getCustomerByPhoneController = async (req, res) => {
    try {
        const { phone } = req.params;
        
        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const customer = await getCustomerByPhone(phone);
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            success: true,
            data: customer.toJSON()
        });
    } catch (error) {
        console.error('Error fetching customer by phone:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customer',
            error: error.message
        });
    }
};

// Get customers count
const getCustomersCount = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json({
            success: true,
            count: customers.length
        });
    } catch (error) {
        console.error('Error getting customers count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get customers count',
            error: error.message
        });
    }
};

// Helper function to validate customer and return specific errors
const validateCustomerErrors = (customer) => {
    const errors = [];
    
    if (!customer.name) {
        errors.push('Customer name is required');
    } else if (customer.name.length > 100) {
        errors.push('Customer name must be 100 characters or less');
    }
    
    if (customer.phone && customer.phone.length > 15) {
        errors.push('Phone number must be 15 characters or less');
    }
    
    if (customer.email && !customer.isValidEmail(customer.email)) {
        errors.push('Invalid email format');
    }
    
    if (customer.email && customer.email.length > 100) {
        errors.push('Email must be 100 characters or less');
    }
    
    return errors;
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
    searchCustomersController,
    getCustomerByEmailController,
    getCustomerByPhoneController,
    getCustomersCount
};
