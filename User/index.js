const express = require('express');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(express.json());
connectDB();

// GET /viewprofile
app.get('/viewprofile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ profile: user });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// PUT /updateprofile
app.put('/updateprofile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { name, phone, password } = req.body;

        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: 'Profile updated successfully',
            profile: updatedUser
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

const PORT = 5004;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));