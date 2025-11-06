import { Request, Response } from 'express';
import User from '../models/User';

export const searchUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { query } = req.query; // search text
    const search = query ? String(query).trim() : '';

    // Case-insensitive search by name or status
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ],
    });

    return res.status(200).json({ users });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
