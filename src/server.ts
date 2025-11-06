import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

// ✅ Connect MongoDB
connectDB();

const app: Application = express();

// 🧰 Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve profile images

// 🛣️ Routes
app.use('/api/auth', authRoutes); // Login, Register
app.use('/api/users', userRoutes); // For user data
app.use('/api/profile', profileRoutes); // Profile + Change Password + Upload

// 🚀 Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`))
