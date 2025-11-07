import { Router, Request, Response } from 'express';
import PortfolioItem from '../models/PortfolioItem.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all visible portfolio items (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await PortfolioItem.find({ is_visible: true })
      .sort({ order_index: 1, created_at: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all portfolio items (protected)
router.get('/all', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const items = await PortfolioItem.find().sort({ order_index: 1, created_at: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create portfolio item (protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await PortfolioItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update portfolio item (protected)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await PortfolioItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete portfolio item (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await PortfolioItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
