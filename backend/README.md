# LifeStyle Backend API

Express + MongoDB backend for the LifeStyle application.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:
   - `PORT`: Server port (default: 5000)
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - Optional: Instagram token, YouTube API key, Cloudinary credentials

3. **Start MongoDB:**
   - Local: `mongod`
   - Or use MongoDB Atlas connection string

4. **Run the server:**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login

### Public Endpoints
- `GET /api/settings` - Get site settings
- `GET /api/instagram` - Get visible Instagram posts
- `GET /api/youtube` - Get visible YouTube videos
- `GET /api/portfolio` - Get visible portfolio items
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/slug/:slug` - Get blog post by slug
- `POST /api/contact` - Submit contact request
- `POST /api/analytics` - Track page view

### Protected Endpoints (require authentication)
All admin endpoints require JWT token in Authorization header:
`Authorization: Bearer <token>`

#### Settings
- `PUT /api/settings` - Update site settings

#### Instagram
- `GET /api/instagram/all` - Get all Instagram posts
- `PATCH /api/instagram/:id/visibility` - Toggle post visibility
- `DELETE /api/instagram/:id` - Delete post

#### YouTube
- `GET /api/youtube/all` - Get all YouTube videos
- `PATCH /api/youtube/:id/visibility` - Toggle video visibility
- `DELETE /api/youtube/:id` - Delete video

#### Portfolio
- `GET /api/portfolio/all` - Get all portfolio items
- `POST /api/portfolio` - Create portfolio item
- `PUT /api/portfolio/:id` - Update portfolio item
- `DELETE /api/portfolio/:id` - Delete portfolio item

#### Blog
- `GET /api/blog/all` - Get all blog posts
- `GET /api/blog/:id` - Get blog post by ID
- `POST /api/blog` - Create blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post

#### Contact
- `GET /api/contact` - Get all contact requests
- `PATCH /api/contact/:id/status` - Update request status
- `DELETE /api/contact/:id` - Delete contact request

#### Analytics
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/summary` - Get analytics summary

## Database Models

- **AdminUser**: Admin user accounts
- **SiteSettings**: Site configuration
- **InstagramPost**: Instagram posts
- **YouTubeVideo**: YouTube videos
- **PortfolioItem**: Portfolio items
- **BlogPost**: Blog posts
- **ContactRequest**: Contact form submissions
- **Analytics**: Page view tracking

## Development

```bash
npm run dev     # Start dev server with auto-reload
npm run build   # Build for production
npm run lint    # Run linter
```

## Production Deployment

1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Ensure MongoDB is accessible
4. Start the server: `npm start`

## Security Notes

- Always use strong JWT_SECRET in production
- Use HTTPS in production
- Keep dependencies updated
- Use environment variables for sensitive data
- Enable rate limiting for public endpoints if needed
