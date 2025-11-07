"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const searchUsers = async (req, res) => {
    try {
        const { query } = req.query; // search text
        const search = query ? String(query).trim() : '';
        // Case-insensitive search by name or status
        const users = await User_1.default.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { status: { $regex: search, $options: 'i' } },
            ],
        });
        return res.status(200).json({ users });
    }
    catch (err) {
        console.error('Search error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.searchUsers = searchUsers;
