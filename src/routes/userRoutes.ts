// src/routes/userRoutes.ts
import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import User from '../models/User';

const router = express.Router();

/**
 * 🔹 GET /api/users?page=1&limit=10
 * Paginated list of users (for lazy loading)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 });

    const total = await User.countDocuments();

    return res.status(200).json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('Pagination error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * 🔍 Search team members by name or status
 * Example: GET /api/users/search?query=sheeraz
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const regex = new RegExp(query as string, 'i'); // case-insensitive search

    const users = await User.find({
      $or: [{ name: regex }, { status: regex }],
    }).select('-password');

    return res.status(200).json({ users });
  } catch (error: any) {
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
router.put('/status', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // ✅ from token (middleware)
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['In Office', 'Out of Office', 'In Meeting', 'On Break', 'On Leave'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Status updated successfully', user });
  } catch (error: any) {
    console.error('Status update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
