import { Router } from 'express';
import { HeroContent } from '../models/HeroContent';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get active hero content (public)
router.get('/', async (req, res) => {
  try {
    let heroContent = await HeroContent.findOne({ is_active: true });
    
    // Create default if none exists
    if (!heroContent) {
      heroContent = await HeroContent.create({
        video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        video_type: 'youtube',
        title: 'Welcome to My Page',
        subtitle: 'Discover amazing content',
        is_active: true,
      });
    }
    
    res.json(heroContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update hero content (admin only)
router.put('/', authenticate, async (req, res) => {
  try {
    const { video_url, video_type, title, subtitle, cta_text, cta_link } = req.body;
    
    let heroContent = await HeroContent.findOne({ is_active: true });
    
    if (!heroContent) {
      heroContent = new HeroContent();
    }
    
    if (video_url) heroContent.video_url = video_url;
    if (video_type) heroContent.video_type = video_type;
    if (title) heroContent.title = title;
    if (subtitle) heroContent.subtitle = subtitle;
    if (cta_text) heroContent.cta_text = cta_text;
    if (cta_link) heroContent.cta_link = cta_link;
    
    await heroContent.save();
    
    res.json(heroContent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
