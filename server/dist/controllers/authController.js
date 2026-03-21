"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = __importDefault(require("../db/index"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
// ================================================
// REGISTER
// POST /api/auth/register
// ================================================
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        const existing = await index_1.default.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Hash the password
        const salt = await bcryptjs_1.default.genSalt(10);
        const password_hash = await bcryptjs_1.default.hash(password, salt);
        // Only allow client or vendor on register (not admin)
        const userRole = role === 'vendor' ? 'vendor' : 'client';
        // Insert user
        const result = await index_1.default.query(`INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`, [name, email, password_hash, userRole]);
        const user = result.rows[0];
        // Sign JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
// ================================================
// LOGIN
// POST /api/auth/login
// ================================================
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user
        const result = await index_1.default.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = result.rows[0];
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
// ================================================
// GET ME
// GET /api/auth/me
// ================================================
const getMe = async (req, res) => {
    try {
        const result = await index_1.default.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
