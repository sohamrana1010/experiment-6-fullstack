const express = require('express');
const app = express();

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleString()} - ${req.method} to ${req.url}`);
    next();
});

// Auth Middleware (Requires ?token=123 in URL)
const auth = (req, res, next) => {
    if (req.query.token === '123') {
        next();
    } else {
        res.status(401).send('Unauthorized: Try adding ?token=123 to the URL');
    }
};

app.get('/', (req, res) => res.send('Public Home Page'));
app.get('/admin', auth, (req, res) => res.send('Admin Dashboard Access Success!'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));