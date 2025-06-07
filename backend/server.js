// const express = require('express');
// const app = express();
// const port = 8000;

// app.get('/test', (req, res) => {
// res.send('Test Successful.');
// });

// app.listen(port, () => {
// console.log(`Example app is listening on port ${port}.`);
// });

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URL,
});

pool.connect()
    .then(() => {
        console.log('PostgreSQL connected successfully!');
        return pool.end(); // Close connection after check
    })
    .catch((err) => {
        console.error(' PostgreSQL connection failed:', err.message);
    });
