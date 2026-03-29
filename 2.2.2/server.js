const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

const users = []; 
const SECRET = "bank_secret_2026";

// 1. REGISTER
app.post('/register', async (req, res) => {
    const salt = await bcrypt.genSalt(12); // Cost factor 12 as per lab doc
    const hashed = await bcrypt.hash(req.body.password, salt);
    users.push({ username: req.body.username, password: hashed });
    res.status(201).json({ message: "User registered successfully" });
});

// 2. LOGIN
app.post('/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ name: user.username }, SECRET, { expiresIn: '15m' });
        return res.json({ accessToken: token });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

// 3. PROTECTED BALANCE
app.get('/balance', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        res.json({ balance: "$5,000.00", user: decoded.name });
    });
});

app.listen(3000, () => console.log('Banking API running on port 3000'));
