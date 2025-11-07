"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const User_1 = __importDefault(require("../models/User"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// 🗂️ Configure multer
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (_, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage });
/**
 * 🟢 Get current user's profile
 */
router.get('/', authMiddleware_1.verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User_1.default.findById(userId).select('-password');
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
/**
 * 🟢 Update profile details (text fields + image in one go)
 */
router.put('/update', authMiddleware_1.verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, department } = req.body;
        const updateData = { name, email, phone, department };
        if (req.file) {
            updateData.profileImage = `/uploads/${req.file.filename}`;
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Profile update failed', error: err.message });
    }
});
exports.default = router;
