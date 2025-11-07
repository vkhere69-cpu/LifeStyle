# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Configure Backend Environment

```bash
# In the backend directory
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lifestyle  # or your MongoDB Atlas URI
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
mongod
```

### Option B: MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Step 4: Start Backend Server

```bash
# In the backend directory
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

## Step 5: Install Frontend Dependencies

```bash
# In the root directory
cd ..
npm install
```

## Step 6: Configure Frontend Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## Step 7: Start Frontend Server

```bash
npm run dev
```

Frontend will run on: http://localhost:5173

## Step 8: Create Admin User

Open a new terminal and run:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "name": "Admin User"
  }'
```

Or use an API client like Postman/Insomnia.

## Step 9: Login to Admin Dashboard

1. Go to http://localhost:5173
2. Navigate to `/admin/login`
3. Login with your admin credentials
4. Start managing your content!

## Directory Structure

```
LifeStyle-main/
├── backend/                 # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Database config
│   │   └── server.ts       # Main server file
│   ├── package.json
│   └── .env
├── src/                    # React frontend
│   ├── components/
│   ├── pages/
│   ├── lib/
│   │   └── api-client.ts  # API client (replaces Supabase)
│   └── contexts/
├── supabase/              # ⚠️ Can be deleted (legacy)
├── package.json
└── .env
```

## Testing the Setup

### Test Backend Health
```bash
curl http://localhost:5000/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### Test Frontend
Visit http://localhost:5173 - you should see the homepage

### Test Admin Login
1. Go to http://localhost:5173/admin/login
2. Enter your credentials
3. Should redirect to admin dashboard

## Common Issues

### Backend won't start
- ✅ Check MongoDB is running
- ✅ Check `MONGODB_URI` is correct
- ✅ Check port 5000 is available

### Frontend can't connect to backend
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Check backend is running on port 5000
- ✅ Check CORS settings in `backend/src/server.ts`

### Authentication issues
- ✅ Check `JWT_SECRET` is set in backend `.env`
- ✅ Clear browser localStorage and try again
- ✅ Check browser console for errors

## Next Steps

1. **Customize Settings**: Go to Admin → Settings
2. **Add Content**: Use admin dashboard to add portfolio items, blog posts
3. **Optional Integrations**:
   - Add Instagram token for Instagram sync
   - Add YouTube API key for YouTube sync
   - Add Cloudinary credentials for media uploads

## Production Deployment

See `MIGRATION_GUIDE.md` for detailed production deployment instructions.

## Need Help?

- Check `backend/README.md` for API documentation
- Check `MIGRATION_GUIDE.md` for detailed migration info
- Check browser console for errors
- Check backend logs for server errors

## Cleanup

You can now safely delete:
- `/supabase` folder (old Supabase config)
- `/src/lib/supabase.ts` (old Supabase client)

These are no longer used.
