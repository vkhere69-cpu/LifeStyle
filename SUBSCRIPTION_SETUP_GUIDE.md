# 📧 Subscription Feature Setup Guide

## Overview
Complete email subscription system with mass email notifications for YouTube shorts and blog posts.

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `nodemailer` - For sending emails
- `@types/nodemailer` - TypeScript definitions

### 2. Configure Email Service

Update your `.env` file with SMTP settings:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM_NAME=Lifestyle
FRONTEND_URL=http://localhost:5173
```

#### For Gmail Users:
1. Enable 2-Factor Authentication
2. Generate an "App Password" at: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

---

## ✨ Features Implemented

### Backend

#### 1. **Subscriber Model** (`backend/src/models/Subscriber.ts`)
- Email validation and uniqueness
- Subscription preferences (YouTube, Blog, Portfolio)
- Active/inactive status
- Last notification timestamp

#### 2. **Email Service** (`backend/src/services/email.service.ts`)
- Single email sending
- Bulk email to subscribers
- HTML email templates with white/yellow/violet theme
- Automatic unsubscribe links
- YouTube update email template
- Blog update email template

#### 3. **Subscriber Routes** (`/api/subscribers`)
- `POST /subscribe` - Subscribe with email (public)
- `POST /unsubscribe` - Unsubscribe (public)
- `GET /` - Get all subscribers (admin)
- `GET /stats` - Get subscriber statistics (admin)
- `DELETE /:id` - Delete subscriber (admin)

#### 4. **Auto-Notifications**

**YouTube Scheduler Integration:**
- Automatically sends email when new shorts are fetched
- Uses YouTube thumbnail and video link
- Only sends to subscribers with `youtube_updates: true`

**Blog Post Integration:**
- Sends email when blog post is published
- Triggers on create or status change to "published"
- Only sends to subscribers with `blog_updates: true`

### Frontend

#### 1. **SubscribeForm Component** (`src/components/SubscribeForm.tsx`)
- Three variants: hero, footer, sidebar
- Email validation
- Duplicate subscription detection
- Success/error messages
- Loading states with animations

#### 2. **Integration Points**
- **Hero Section**: Subscribe form with backdrop styling
- **Footer**: Full subscribe section (4-column layout)
- Easily add to any page with `<SubscribeForm />`

---

## 🎨 Email Templates

### YouTube Short Notification
- Hero image with video thumbnail
- "Watch Now" CTA button
- Gradient styling (violet/purple)
- Responsive design

### Blog Post Notification
- Featured image support
- Post excerpt
- "Read Article" CTA button
- Gradient styling (yellow/violet/purple)

Both templates include:
- Branded header
- Unsubscribe link in footer
- Mobile-responsive design
- White/Yellow/Violet theme colors

---

## 📊 Admin Management

### View Subscribers
```javascript
const subscribers = await apiClient.getSubscribers();
// Returns: { total, active, subscribers[] }
```

### Get Statistics
```javascript
const stats = await apiClient.getSubscriberStats();
// Returns: { total, active, inactive, recentSubscribers[] }
```

---

## 🔧 API Usage

### Frontend (User-facing)
```typescript
// Subscribe
await apiClient.subscribe('user@example.com');

// Unsubscribe
await apiClient.unsubscribe('user@example.com');
```

### Backend (Manual Email Sending)
```typescript
import { emailService } from './services/email.service';

// Send to specific email
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  html: '<h1>Hello!</h1>'
});

// Send bulk email with filter
await emailService.sendBulkEmail(
  'Subject',
  htmlContent,
  { 'preferences.youtube_updates': true }
);
```

---

## 🔒 Security Features

1. **Email Validation**: Regex pattern validation
2. **Duplicate Prevention**: Unique email constraint
3. **Admin-Only Routes**: Protected with authentication
4. **Unsubscribe Links**: Auto-generated in all emails
5. **Preferences**: Granular control over notification types

---

## 📱 User Flow

### Subscription
1. User enters email in any subscribe form
2. System checks for existing subscription
3. If exists: "You are already subscribed!"
4. If inactive: Reactivates subscription
5. If new: Creates subscription with default preferences
6. Success message displayed

### Email Notifications
1. YouTube scheduler fetches new videos (hourly)
2. For each new video:
   - Generates email with template
   - Sends to all active subscribers (youtube_updates: true)
   - Updates `last_notified` timestamp
3. Same process for blog posts on publish

---

## 🎯 Testing

### Test Subscription
1. Navigate to home page or footer
2. Enter your email
3. Click "Subscribe"
4. Check for success message

### Test Emails
1. Publish a new blog post (set status to "published")
2. Or wait for YouTube scheduler to fetch new videos
3. Check your email inbox
4. Verify email template rendering

---

## 🚨 Troubleshooting

### Emails Not Sending
- Check SMTP credentials in `.env`
- Verify Gmail app password if using Gmail
- Check backend logs for errors

### Duplicate Subscription Error
- This is expected behavior
- User sees "already subscribed" message

### Template Not Rendering
- Ensure `FRONTEND_URL` is set in `.env`
- Check that featured images have valid URLs

---

## 📈 Future Enhancements

- Subscriber preferences page
- Email open/click tracking
- A/B testing for email templates
- Schedule email send times
- Subscriber segmentation
- Welcome email sequence
- Double opt-in confirmation

---

## 🎨 Theme Colors in Emails

- **Violet**: `#7c3aed`
- **Purple**: `#a855f7`
- **Yellow**: `#fbbf24`
- **Gradients**: Multiple gradient combinations for modern look

---

## 📝 Notes

- All email HTML is inline-styled for maximum compatibility
- Templates are mobile-responsive
- Unsubscribe links use URL encoding for email safety
- Error handling prevents email failures from blocking content creation
- Bulk email operations use `Promise.allSettled` for resilience
