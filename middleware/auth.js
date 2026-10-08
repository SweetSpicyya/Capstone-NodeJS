const jwt = require('jsonwebtoken');
const User = require('../modules/user/UserModule');

const signToken = (id) => {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expireTime = process.env.JWT_EXPIRES_IN || '1d';
    return jwt.sign({ id }, secret, { expiresIn: expireTime });
};

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

        const user = await User.findById(decoded.id).populate('permission');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const permissionDesc = req.user.permission?.description || req.user.permission;

    if (permissionDesc !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin only' });
    }

    next();
};

module.exports = {
    signToken,
    verifyToken,
    isAdmin,
};