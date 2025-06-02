const express = require('express');
const app = express();
const port = 8000;

app.get('/test', (req, res) => {
res.send('Test Successful.');
});

app.listen(port, () => {
console.log(`Example app is listening on port ${port}.`);
});