import { Router, Request, Response } from 'express';
import ContactRequest from '../models/ContactRequest.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create contact request (public)
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await ContactRequest.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all contact requests (protected)
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const contacts = await ContactRequest.find().sort({ created_at: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update contact request status (protected)
router.patch('/:id/status', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const contact = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete contact request (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await ContactRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
