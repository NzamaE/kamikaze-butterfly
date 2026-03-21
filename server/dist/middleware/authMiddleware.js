"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// ================================================
// PROTECT — requires valid JWT
// ================================================
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};
exports.protect = protect;
// ================================================
// RESTRICT TO — role based access
// Usage: restrictTo('admin') or restrictTo('vendor', 'admin')
// ================================================
const restrictTo = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
