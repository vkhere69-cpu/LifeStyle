import { Router, Request, Response } from 'express';
import Analytics from '../models/Analytics.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create analytics entry (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const analytics = await Analytics.create(req.body);
    res.status(201).json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics (protected)
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analytics = await Analytics.find().sort({ created_at: -1 }).limit(1000);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics summary (protected)
router.get('/summary', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const total = await Analytics.countDocuments();
    const uniqueIps = await Analytics.distinct('visitor_ip');
    
    const pageViews = await Analytics.aggregate([
      {
        $group: {
          _id: '$page_view',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      total_views: total,
      unique_visitors: uniqueIps.length,
      page_views: pageViews
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
