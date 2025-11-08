import { Router } from 'express';
import { Subscriber } from '../models/Subscriber.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Subscribe to newsletter (public)
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    
    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return res.status(200).json({ 
          message: 'You are already subscribed!',
          alreadySubscribed: true 
        });
      } else {
        // Reactivate subscription
        existingSubscriber.is_active = true;
        existingSubscriber.subscribed_at = new Date();
        await existingSubscriber.save();
        return res.status(200).json({ 
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true 
        });
      }
    }

    // Create new subscriber
    const subscriber = await Subscriber.create({
      email: email.toLowerCase(),
    });

    res.status(201).json({
      message: 'Successfully subscribed! You will receive updates about new content.',
      subscriber: {
        email: subscriber.email,
        subscribed_at: subscriber.subscribed_at,
      },
    });
  } catch (error: any) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
  }
});

// Unsubscribe (public)
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    
    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found in subscribers list' });
    }

    subscriber.is_active = false;
    await subscriber.save();

    res.json({ message: 'Successfully unsubscribed' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all subscribers (admin only)
router.get('/', authenticate, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribed_at: -1 });
    res.json({
      total: subscribers.length,
      active: subscribers.filter(s => s.is_active).length,
      subscribers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscriber stats (admin only)
router.get('/stats', authenticate, async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ is_active: true });
    const inactive = await Subscriber.countDocuments({ is_active: false });
    
    const recentSubscribers = await Subscriber.find({ is_active: true })
      .sort({ subscribed_at: -1 })
      .limit(10);

    res.json({
      total,
      active,
      inactive,
      recentSubscribers,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete subscriber (admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
