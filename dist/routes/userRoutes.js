"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
/**
 * 🔹 GET /api/users?page=1&limit=10
 * Paginated list of users (for lazy loading)
 */
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await User_1.default.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ name: 1 });
        const total = await User_1.default.countDocuments();
        return res.status(200).json({
            users,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (err) {
        console.error('Pagination error:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});
/**
 * 🔍 Search team members by name or status
 * Example: GET /api/users/search?query=sheeraz
 */
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }
        const regex = new RegExp(query, 'i'); // case-insensitive search
        const users = await User_1.default.find({
            $or: [{ name: regex }, { status: regex }],
        }).select('-password');
        return res.status(200).json({ users });
    }
    catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
/**
 * 🟢 Update logged-in user's status
 * PUT /api/users/status
 * Headers: Authorization: Bearer <token>
 * Body: { status: "On Break" }
 */
router.put('/status', authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // ✅ from token (middleware)
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        const validStatuses = ['In Office', 'Out of Office', 'In Meeting', 'On Break', 'On Leave'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const user = await User_1.default.findByIdAndUpdate(userId, { status }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'Status updated successfully', user });
    }
    catch (error) {
        console.error('Status update error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
