# Comedy & Modelling Creator Platform

A complete full-stack platform for comedy and modelling content creators, featuring a beautiful public website and comprehensive admin dashboard.

## Features

### Public Website
- **Hero Section**: Eye-catching landing page with gradient backgrounds and animations
- **Instagram Reels**: Auto-updating Instagram posts fetched via Instagram Graph API
- **YouTube Videos**: Auto-updating YouTube videos fetched via YouTube Data API v3
- **Portfolio Gallery**: Photo and video galleries with category filtering
- **Blog**: Full-featured blog with rich media support
- **About Page**: Professional about section with bio and expertise
- **Contact Form**: Collaboration request form with email integration
- **Dark Mode**: Toggle between light and dark themes
- **Comedy Mascot**: Interactive animated mascot with fun messages
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Dashboard
- **Dashboard Overview**: Analytics and quick stats
- **Instagram Manager**: Sync and manage Instagram posts visibility
- **YouTube Manager**: Sync and manage YouTube videos visibility
- **Portfolio Manager**: Upload and organize modelling photos/videos
- **Blog Manager**: Create, edit, and publish blog posts with media
- **Contact Requests**: View and manage collaboration inquiries
- **Settings**: Configure API keys, theme, and site information

### Technical Features
- **Supabase Database**: Secure PostgreSQL database with Row Level Security
- **Edge Functions**: Automated API sync for Instagram and YouTube
- **Cloudinary Integration**: Media upload and optimization
- **Authentication**: Secure admin login system
- **Real-time Updates**: Dynamic content that updates automatically
- **SEO Optimized**: Semantic HTML and meta tags

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons
- **Vite**: Fast development and building

### Backend
- **Supabase**: Backend as a service
- **PostgreSQL**: Robust database
- **Edge Functions**: Serverless functions for API sync
- **Row Level Security**: Database-level security

### APIs
- **Instagram Graph API**: Fetch Instagram content
- **YouTube Data API v3**: Fetch YouTube videos
- **Cloudinary**: Media management

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

The database schema is already migrated. Tables include:
- `admin_users` - Admin authentication
- `site_settings` - Platform configuration
- `instagram_posts` - Instagram content
- `youtube_videos` - YouTube content
- `portfolio_items` - Portfolio media
- `blog_posts` - Blog articles
- `contact_requests` - Contact form submissions
- `analytics` - Page view tracking

### 4. Create Admin Account

Use the Supabase dashboard to insert an admin user into the `admin_users` table.

### 5. Configure API Keys

Log in to the admin dashboard at `/admin/login` and navigate to Settings to configure:
- Instagram Access Token
- YouTube API Key
- Cloudinary credentials

## Development

Start the development server:

```bash
npm run dev
```

Visit:
- Public site: `http://localhost:5173`
- Admin login: `http://localhost:5173/admin/login`

## Building

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Edge Functions

Two Edge Functions are deployed for automated content sync:

### sync-instagram
Fetches latest Instagram posts and stores them in the database.

### sync-youtube
Fetches latest YouTube videos and stores them in the database.

## Usage Guide

### For Admins

1. **Login**: Navigate to `/admin/login` and sign in
2. **Configure Settings**: Go to Settings and add API keys
3. **Sync Content**: Use Instagram and YouTube managers to sync content
4. **Manage Visibility**: Toggle which posts/videos appear on the public site
5. **Add Portfolio**: Upload modelling photos and videos
6. **Create Blog Posts**: Write and publish blog articles
7. **Handle Contacts**: Review and respond to collaboration requests

### Content Management

#### Instagram & YouTube
- Click "Sync" button to fetch latest content
- Toggle visibility for each post/video
- Content appears on homepage automatically

#### Portfolio
- Add photos or videos with categories
- Organize by drag-and-drop (order_index)
- Toggle visibility per item

#### Blog
- Create text-only or media-rich posts
- Save as draft or publish immediately
- SEO-friendly slugs auto-generated

#### Contact Requests
- Mark as read/replied
- Filter by status
- Delete old requests

## Customization

### Branding
Edit `src/components/Navbar.tsx` and `src/components/Footer.tsx` to customize branding.

### Colors
The platform uses orange and pink accent colors. Edit Tailwind classes to change the color scheme.

### Animations
Custom animations are defined in `tailwind.config.js`:
- `wiggle` - Mascot animation
- `fade-in` - Page entrance animation

## Security

- Row Level Security (RLS) enabled on all tables
- Admin authentication required for dashboard
- Public content filtered by visibility flags
- API keys stored securely in database
- CORS properly configured

## Performance

- Lazy loading for images
- Optimized builds with Vite
- CDN-ready assets
- Efficient database queries
- Edge Functions for API calls

## Support

For issues or questions:
1. Check the console for error messages
2. Verify API keys are configured correctly
3. Ensure database migrations are applied
4. Check Supabase Edge Function logs

## License

This project is private and proprietary.
