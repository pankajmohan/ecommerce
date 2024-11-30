// server/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Initialize dotenv (for managing environment variables)
dotenv.config();
const pool = require('./db');
// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, this is the server!');
});

// Sample API route
app.get('/api', (req, res) => {
    res.json({ message: "This is an API endpoint" });
});

app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        console.log('Query Result:', result.rows);
        // res.json({message: result.rows});
    } catch (err) {
        console.error('Error querying the database:', err.stack);
        res.status(500).send('Error querying the database');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
