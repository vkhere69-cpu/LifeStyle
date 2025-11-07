import { Router, Response } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get site settings (public)
router.get('/', async (_, res: Response): Promise<void> => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update site settings (protected)
router.put('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = await SiteSettings.create(updates);
    } else {
      Object.assign(settings, updates);
      settings.updated_at = new Date();
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
