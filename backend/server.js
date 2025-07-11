const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authenticateJWT = require('./middleware/jwtAuth');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true // Allow cookies
}));

app.use(cookieParser());
app.use(express.json());

app.use('/apiv1/auth', authRoutes);
app.use('/apiv1/medicine', authenticateJWT, medicineRoutes);
app.use('/apiv1/suppliers',authenticateJWT, supplierRoutes);
app.use('/apiv1/customers',authenticateJWT, customerRoutes);

app.get('/test', (req, res) => {
res.send('Test Successful.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
