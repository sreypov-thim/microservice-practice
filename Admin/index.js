require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(express.json());
connectDB();

// GET /searchuser?query=...
app.get('/searchuser', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query parameter is required' });
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('-password');

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found matching the query' });
        }

        res.status(200).json({ results: users });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// GET /viewalluser
app.get('/viewalluser', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ count: users.length, users });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// DELETE /deluser?email=... or via JSON body
app.delete('/deluser', async (req, res) => {
    try {
        const email = req.query.email || req.body.email;
        if (!email) {
            return res.status(400).json({ message: 'User email is required to delete' });
        }

        const deletedUser = await User.findOneAndDelete({ email: email.toLowerCase() });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found to delete' });
        }

        res.status(200).json({ message: `User ${email} deleted successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Admin Service running on port ${PORT}`));