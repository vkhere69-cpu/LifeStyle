import { Router } from 'express';
import { Notification } from '../models/Notification';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get active notifications (public)
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const notifications = await Notification.find({
      is_active: true,
      $or: [
        { expires_at: null },
        { expires_at: { $gt: now } }
      ]
    }).sort({ created_at: -1 });
    
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all notifications (admin only)
router.get('/all', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ created_at: -1 });
    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create notification (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, message, type, icon, link, expires_at } = req.body;
    
    const notification = await Notification.create({
      title,
      message,
      type,
      icon,
      link,
      expires_at: expires_at ? new Date(expires_at) : null,
    });
    
    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update notification (admin only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, message, type, icon, link, is_active, expires_at } = req.body;
    
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {
        title,
        message,
        type,
        icon,
        link,
        is_active,
        expires_at: expires_at ? new Date(expires_at) : null,
        updated_at: new Date(),
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete notification (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
