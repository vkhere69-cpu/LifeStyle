# Migration Guide: Supabase to Node.js + Express + MongoDB

This guide documents the migration from Supabase to a custom Node.js backend.

## Overview

The application has been migrated from:
- **Before:** Supabase (PostgreSQL + Auth + Realtime)
- **After:** Node.js + Express + MongoDB + JWT Authentication

## Architecture Changes

### Backend
- **New:** Express.js REST API server
- **Database:** MongoDB (instead of PostgreSQL)
- **Authentication:** JWT-based authentication (instead of Supabase Auth)
- **Location:** `/backend` directory

### Frontend
- **Updated:** All Supabase client calls replaced with REST API calls
- **New API Client:** `/src/lib/api-client.ts`
- **Removed:** `@supabase/supabase-js` dependency
- **Auth:** JWT tokens stored in localStorage

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - Set MONGODB_URI to your MongoDB connection string
# - Set JWT_SECRET to a secure random string
# - Add optional API keys (Instagram, YouTube, Cloudinary)

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install dependencies (Supabase removed)
npm install

# Create/update .env file
cp .env.example .env

# Update .env:
# VITE_API_URL=http://localhost:5000/api
```

### 3. Database Migration

If you have existing data in Supabase:

1. **Export data from Supabase:**
   - Go to Supabase Dashboard → SQL Editor
   - Export each table as CSV or JSON

2. **Import to MongoDB:**
   ```bash
   # Example using mongoimport
   mongoimport --db lifestyle --collection admin_users --file admin_users.json --jsonArray
   mongoimport --db lifestyle --collection instagram_posts --file instagram_posts.json --jsonArray
   # ... repeat for other collections
   ```

3. **Create first admin user:**
   ```bash
   # Use the register endpoint
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"your-password","name":"Admin"}'
   ```

## Key Differences

### Authentication

**Before (Supabase):**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});
```

**After (Custom API):**
```typescript
const { data, error } = await apiClient.login(email, password);
// JWT token automatically stored in localStorage
```

### Data Fetching

**Before (Supabase):**
```typescript
const { data, error } = await supabase
  .from('blog_posts')
  .select('*')
  .eq('status', 'published');
```

**After (Custom API):**
```typescript
const data = await apiClient.getBlogPosts();
// Returns published posts only
```

### Protected Routes

**Before:** Supabase RLS (Row Level Security)

**After:** JWT middleware on backend routes
```typescript
// Protected routes require Authorization header
headers: { Authorization: `Bearer ${token}` }
```

## Database Schema Mapping

| Supabase (PostgreSQL) | MongoDB |
|-----------------------|---------|
| UUID primary keys | MongoDB ObjectId (_id) |
| timestamptz | Date |
| jsonb | Object/Array |
| text | String |
| boolean | Boolean |
| integer | Number |

## API Endpoint Mapping

| Resource | Supabase | New REST API |
|----------|----------|--------------|
| Get posts | `supabase.from('blog_posts').select()` | `GET /api/blog` |
| Create post | `supabase.from('blog_posts').insert()` | `POST /api/blog` |
| Update post | `supabase.from('blog_posts').update().eq()` | `PUT /api/blog/:id` |
| Delete post | `supabase.from('blog_posts').delete().eq()` | `DELETE /api/blog/:id` |

## Environment Variables

### Removed:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Added:
- `VITE_API_URL` (frontend)
- `MONGODB_URI` (backend)
- `JWT_SECRET` (backend)
- `PORT` (backend)

## Features Maintained

✅ All CRUD operations
✅ Authentication
✅ Admin dashboard
✅ Public/private content visibility
✅ Blog management
✅ Portfolio management
✅ Instagram/YouTube integration
✅ Contact form
✅ Analytics tracking

## Removed Features

❌ Real-time subscriptions (Supabase Realtime)
❌ Built-in file storage (use Cloudinary instead)
❌ Row Level Security (replaced with API middleware)

## Running Both Servers

In development, you need to run both servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

## Production Deployment

### Backend Deployment Options:
- Heroku
- Railway
- Render
- DigitalOcean
- AWS/GCP/Azure

### Frontend Deployment Options:
- Vercel
- Netlify
- Cloudflare Pages

**Important:** Update `VITE_API_URL` to your production backend URL

### MongoDB Hosting:
- MongoDB Atlas (recommended)
- Self-hosted
- Managed MongoDB services

## Troubleshooting

### CORS Issues
- Ensure backend CORS is configured for your frontend URL
- Check `backend/src/server.ts` CORS settings

### Authentication Issues
- Verify JWT_SECRET is set
- Check token is being sent in headers
- Ensure token hasn't expired (7 day expiry)

### Database Connection
- Verify MONGODB_URI is correct
- Check MongoDB is running
- Ensure network access is allowed (MongoDB Atlas)

## Next Steps

1. ✅ Install backend dependencies
2. ✅ Set up MongoDB
3. ✅ Configure environment variables
4. ✅ Start both servers
5. ✅ Create admin user
6. ✅ Test all functionality
7. ✅ Deploy to production

## Support

For issues or questions:
- Check backend logs
- Verify MongoDB connection
- Ensure all environment variables are set
- Check API endpoint responses in browser DevTools
