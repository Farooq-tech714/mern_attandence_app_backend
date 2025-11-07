"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
dotenv_1.default.config();
// ✅ Connect MongoDB
(0, db_1.default)();
const app = (0, express_1.default)();
// 🧰 Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads')); // serve profile images
// 🛣️ Routes
app.use('/api/auth', authRoutes_1.default); // Login, Register
app.use('/api/users', userRoutes_1.default); // For user data
app.use('/api/profile', profileRoutes_1.default); // Profile + Change Password + Upload
// 🚀 Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
