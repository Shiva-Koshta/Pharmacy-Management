const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');


app.use(express.json());
app.use('/apiv1/auth', authRoutes);

app.get('/test', (req, res) => {
res.send('Test Successful.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
