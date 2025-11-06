  // import express, { Request, Response } from 'express';
  // import bcrypt from 'bcryptjs';
  // import jwt from 'jsonwebtoken';
  // import dotenv from 'dotenv';
  // import User, { IUser } from '../models/User';

  // dotenv.config();
  // const router = express.Router();

  // // 🔹 Register
  // router.post('/register', async (req: Request, res: Response): Promise<Response> => {
  //   try {
  //     const { name, email, password } = req.body as {
  //       name: string;
  //       email: string;
  //       password: string;
  //     };

  //     if (!name || !email || !password) {
  //       return res.status(400).json({ message: 'All fields are required' });
  //     }

  //     const existingUser = await User.findOne({ email });
  //     if (existingUser) {
  //       return res.status(400).json({ message: 'Email already registered' });
  //     }

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const newUser = new User({ name, email, password: hashedPassword });
  //     await newUser.save();

  //     return res.status(201).json({ message: 'User registered successfully' });
  //   } catch (error: any) {
  //     return res.status(500).json({ message: 'Server Error', error: error.message });
  //   }
  // });

  // // 🔹 Login
  // router.post('/login', async (req: Request, res: Response): Promise<Response> => {
  //   try {
  //     const { email, password } = req.body as { email: string; password: string };

  //     if (!email || !password) {
  //       return res.status(400).json({ message: 'Email and password required' });
  //     }

  //     const user = await User.findOne({ email });
  //     if (!user) return res.status(404).json({ message: 'User not found' });

  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  //     const token = jwt.sign(
  //       { id: user._id, email: user.email },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: '1h' }
  //     );

  //     return res.status(200).json({
  //       message: 'Login successful',
  //       token,
  //       user: { id: user._id, name: user.name, email: user.email },
  //     });
  //   } catch (error: any) {
  //     return res.status(500).json({ message: 'Server Error', error: error.message });
  //   }
  // });

  // export default router;


  // import express, { Request, Response } from 'express';
  // import bcrypt from 'bcryptjs';
  // import jwt from 'jsonwebtoken';
  // import dotenv from 'dotenv';
  // import axios from 'axios';
  // import User from '../models/User';

  // dotenv.config();
  // const router = express.Router();

  // // 🧭 Define your office location
  // const OFFICE_LOCATION = {
  //   latitude: 28.6139,  // Example: New Delhi
  //   longitude: 77.2090,
  //   radiusMeters: 100,  // Allowed range to count "In Office"
  // };

  // // Helper to calculate distance between two coordinates (Haversine formula)
  // function getDistanceFromLatLonInMeters(
  //   lat1: number,
  //   lon1: number,
  //   lat2: number,
  //   lon2: number
  // ): number {
  //   const R = 6371000; // Radius of earth in meters
  //   const dLat = ((lat2 - lat1) * Math.PI) / 180;
  //   const dLon = ((lon2 - lon1) * Math.PI) / 180;
  //   const a =
  //     Math.sin(dLat / 2) ** 2 +
  //     Math.cos((lat1 * Math.PI) / 180) *
  //     Math.cos((lat2 * Math.PI) / 180) *
  //     Math.sin(dLon / 2) ** 2;
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return R * c;
  // }

  // // 🔹 Register
  // router.post('/register', async (req: Request, res: Response) => {
  //   try {
  //     const { name, email, password } = req.body;

  //     if (!name || !email || !password)
  //       return res.status(400).json({ message: 'All fields are required' });

  //     const existingUser = await User.findOne({ email });
  //     if (existingUser)
  //       return res.status(400).json({ message: 'Email already registered' });

  //     const hashedPassword = await bcrypt.hash(password, 10);
  //     const newUser = new User({ name, email, password: hashedPassword });
  //     await newUser.save();

  //     return res.status(201).json({ message: 'User registered successfully' });
  //   } catch (error: any) {
  //     return res.status(500).json({ message: 'Server Error', error: error.message });
  //   }
  // });

  // // 🔹 Login (with GeoLocation)
  // router.post('/login', async (req: Request, res: Response) => {
  //   try {
  //     const { email, password } = req.body;

  //     if (!email || !password)
  //       return res.status(400).json({ message: 'Email and password required' });

  //     const user = await User.findOne({ email });
  //     if (!user) return res.status(404).json({ message: 'User not found' });

  //     const isMatch = await bcrypt.compare(password, user.password);
  //     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  //     // Get user IP
  //     const ip =
  //       req.headers['x-forwarded-for']?.toString().split(',')[0] ||
  //       req.socket.remoteAddress;

  //     // Fetch location by IP
  //     let locationData = null;
  //     try {
  //       const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
  //       locationData = {
  //         ip,
  //         city: geoResponse.data.city,
  //         region: geoResponse.data.region,
  //         country: geoResponse.data.country_name,
  //         latitude: geoResponse.data.latitude,
  //         longitude: geoResponse.data.longitude,
  //       };
  //     } catch (geoError) {
  //       console.error('Error fetching geolocation:', geoError);
  //       locationData = { error: 'Unable to fetch location' };
  //     }

  //     // Generate JWT
  //     const token = jwt.sign(
  //       { id: user._id, email: user.email },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: '1h' }
  //     );

  //     return res.status(200).json({
  //       message: 'Login successful',
  //       token,
  //       user: { id: user._id, name: user.name, email: user.email },
  //       location: locationData,
  //     });
  //   } catch (error: any) {
  //     return res.status(500).json({ message: 'Server Error', error: error.message });
  //   }
  // });

  // // 🔹 Check Attendance Status (In Office / Out of Office)
  // router.post('/check-status', async (req: Request, res: Response) => {
  //   try {
  //     const { latitude, longitude } = req.body;

  //     if (!latitude || !longitude) {
  //       return res.status(400).json({ message: 'Latitude and longitude required' });
  //     }

  //     const distance = getDistanceFromLatLonInMeters(
  //       OFFICE_LOCATION.latitude,
  //       OFFICE_LOCATION.longitude,
  //       latitude,
  //       longitude
  //     );

  //     const status =
  //       distance <= OFFICE_LOCATION.radiusMeters ? 'In Office' : 'Out of Office';

  //     return res.status(200).json({
  //       message: 'Status checked successfully',
  //       status,
  //       distance: Math.round(distance),
  //     });
  //   } catch (error: any) {
  //     return res.status(500).json({ message: 'Server Error', error: error.message });
  //   }
  // });

  // export default router;


  import express, { Request, Response } from 'express';
  import bcrypt from 'bcryptjs';
  import jwt from 'jsonwebtoken';
  import dotenv from 'dotenv';
  import axios from 'axios';
  import User from '../models/User';

  dotenv.config();
  const router = express.Router();

  /**
   * 🔹 REGISTER USER
   */
  router.post('/register', async (req: Request, res: Response): Promise<Response> => {
    try {
      let { name, email, password } = req.body as {
        name: string;
        email: string;
        password: string;
      };

      // 🧩 Validation
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // 🧹 Normalize email (trim + lowercase)
      email = email.trim().toLowerCase();

      // 🕵️‍♂️ Debug log
      console.log("📩 Checking email:", email);

      // 🔍 Check existing user
      const existingUser = await User.findOne({ email });
      console.log("🔍 Found existing user:", existingUser);

      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // 🔐 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🆕 Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  });


  /**
   * 🔹 LOGIN USER + GEOLOCATION + ATTENDANCE STATUS
   */
  router.post('/login', async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

      // 🔹 Get IP Address
      let ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress?.replace('::ffff:', '') ||
        'Unknown';

      // ✅ Handle localhost case — simulate office IP for local testing
      if (ip === '::1' || ip === '127.0.0.1') {
        ip = '192.168.1.24'; // your office LAN IP (for testing)
      }

      // 🔹 Fetch Geolocation Info
      let locationData: any = null;
      try {
        const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
        locationData = {
          ip,
          city: geoResponse.data.city,
          region: geoResponse.data.region,
          country: geoResponse.data.country_name,
          latitude: geoResponse.data.latitude,
          longitude: geoResponse.data.longitude,
        };
      } catch (geoError) {
        console.error('Error fetching geolocation:', geoError);
        locationData = { ip, error: 'Unable to fetch location' };
      }

      // 🔹 Determine Attendance Status
      const officeIP = '192.168.1.24'; // Replace with your office IP
      let attendanceStatus = 'Out of Office';

      // Check if IP matches office LAN range
      if (ip === officeIP || ip.startsWith('192.168.1.')) {
        attendanceStatus = 'In Office';
      }

      // 🔹 Generate JWT Token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // 🔹 Send Response
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        location: locationData,
        attendanceStatus,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server Error', error: error.message });
    }
  });

  export default router;

