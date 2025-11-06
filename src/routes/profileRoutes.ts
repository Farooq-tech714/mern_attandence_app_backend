import express from 'express';
import multer from 'multer';
import path from 'path';
import User from '../models/User';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// 🗂️ Configure multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

/**
 * 🟢 Get current user's profile
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('-password');
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🟢 Update profile details (text fields + image in one go)
 */
router.put('/update', verifyToken, upload.single('profileImage'), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, department } = req.body;

    const updateData: any = { name, email, phone, department };

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
});

export default router;
