require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_university_key_2026';

const REGISTRATION_SERVICE_URL = process.env.REGISTRATION_SERVICE_URL || 'http://localhost:5001';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:5002';
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:5003';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5004';

// Middleware for Role-Based Access Control
const verifyTokenAndRole = (requiredRole) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Denied: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Strict role boundary enforcement
            if (decoded.role !== requiredRole) {
                return res.status(403).json({
                    message: `Forbidden: '${decoded.role}' is not authorized to access this resource`
                });
            }

            req.user = decoded;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access Denied: Expired token' });
            }
            return res.status(401).json({ message: 'Access Denied: Invalid token' });
        }
    };
};

// Public Routes
app.use('/register', proxy(REGISTRATION_SERVICE_URL));
app.use('/auth', proxy(AUTH_SERVICE_URL));

// Admin Routes (Admin-only)
app.use('/admin', verifyTokenAndRole('admin'), proxy(ADMIN_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
        proxyReqOpts.headers['x-user-role'] = srcReq.user.role;
        return proxyReqOpts;
    }
}));

// User Routes (User-only)
app.use('/user', verifyTokenAndRole('user'), proxy(USER_SERVICE_URL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
        proxyReqOpts.headers['x-user-role'] = srcReq.user.role;
        return proxyReqOpts;
    }
}));

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));