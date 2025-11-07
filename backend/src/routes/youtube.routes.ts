// backend/src/routes/youtube.routes.ts
import { Router } from 'express';
import YoutubeService from '../services/youtube.service';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get paginated videos
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    const result = await YoutubeService.getVideos(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Sync videos from YouTube API
router.post('/sync', authenticate, async (req, res) => {
  try {
    const result = await YoutubeService.fetchAndStoreVideos();
    res.json({
      success: true,
      message: 'Videos synced successfully',
      ...result
    });
  } catch (error) {
    console.error('Error syncing videos:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync videos' 
    });
  }
});

// Update video visibility
router.patch('/:id/visibility', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_visible } = req.body;
    
    const video = await YoutubeService.updateVisibility(id, is_visible);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ success: true, video });
  } catch (error) {
    console.error('Error updating video visibility:', error);
    res.status(500).json({ error: 'Failed to update video visibility' });
  }
});

// Delete video from database (not from YouTube)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await YoutubeService.deleteVideo(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Video deleted from database. It will be re-synced if still on YouTube.' 
    });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

export default router;