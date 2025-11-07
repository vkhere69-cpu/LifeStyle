import { Router, Request, Response } from 'express';
import BlogPost from '../models/BlogPost.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { emailService } from '../services/email.service.js';

const router = Router();

// Get all published blog posts (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await BlogPost.find({ status: 'published' })
      .sort({ published_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single blog post by slug (public)
router.get('/slug/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all blog posts (protected)
router.get('/all', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posts = await BlogPost.find().sort({ created_at: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single blog post by ID (protected)
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create blog post (protected)
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const post = await BlogPost.create(req.body);
    
    // Send email notification if post is published
    if (post.status === 'published') {
      try {
        const blogUrl = `${process.env.FRONTEND_URL}/blog/${post.slug}`;
        const excerpt = post.excerpt || post.content.substring(0, 200) + '...';
        const emailHtml = emailService.createBlogUpdateEmail(
          post.title,
          excerpt,
          blogUrl,
          post.featured_image
        );
        
        const result = await emailService.sendBulkEmail(
          `✍️ New Post: ${post.title}`,
          emailHtml,
          { 'preferences.blog_updates': true }
        );
        
        console.log(`Blog notification sent: ${result.successful}/${result.total} successful`);
      } catch (emailError) {
        console.error('Error sending blog notification:', emailError);
      }
    }
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update blog post (protected)
router.put('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const oldPost = await BlogPost.findById(req.params.id);
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    
    // Send email notification if post was just published (status changed to published)
    if (post && oldPost && oldPost.status !== 'published' && post.status === 'published') {
      try {
        const blogUrl = `${process.env.FRONTEND_URL}/blog/${post.slug}`;
        const excerpt = post.excerpt || post.content.substring(0, 200) + '...';
        const emailHtml = emailService.createBlogUpdateEmail(
          post.title,
          excerpt,
          blogUrl,
          post.featured_image
        );
        
        const result = await emailService.sendBulkEmail(
          `✍️ New Post: ${post.title}`,
          emailHtml,
          { 'preferences.blog_updates': true }
        );
        
        console.log(`Blog notification sent: ${result.successful}/${result.total} successful`);
      } catch (emailError) {
        console.error('Error sending blog notification:', emailError);
      }
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete blog post (protected)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
