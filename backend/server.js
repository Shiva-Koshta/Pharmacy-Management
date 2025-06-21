const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use(express.json());

app.use('/apiv1/auth', authRoutes);
app.use('/apiv1/medicine', medicineRoutes);
app.use('/apiv1/suppliers', supplierRoutes);
app.use('/apiv1/customers', customerRoutes);

app.get('/test', (req, res) => {
res.send('Test Successful.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
