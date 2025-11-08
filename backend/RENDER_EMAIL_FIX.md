# Email on Render.com - Connection Timeout Fix

## Problem
Getting `ETIMEDOUT` errors when sending emails on Render.com, but works fine on localhost.

```
Email send error: Error: Connection timeout
code: 'ETIMEDOUT',
command: 'CONN'
```

## Root Cause
**Render.com blocks outbound SMTP connections on ports 25 and 587** to prevent spam. This is common with cloud hosting providers (Heroku, Railway, Fly.io, etc.).

## ✅ Solution: Use Port 465 with SSL

### Step 1: Update Environment Variables on Render.com

Go to your Render.com dashboard → Your service → Environment and update:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

**Important:**
- Port **465** (not 587)
- `SMTP_SECURE=true` (not false)
- Use Gmail App Password (not your regular password)

### Step 2: Redeploy

After updating environment variables, Render.com should automatically redeploy. If not, trigger a manual deploy.

### Step 3: Verify

Check your Render.com logs - you should see successful email sends without timeout errors.

---

## Alternative Solutions (if Port 465 doesn't work)

### Option 1: Use SendGrid (Recommended for Production)

SendGrid has a free tier (100 emails/day) and works reliably on all cloud platforms.

1. **Sign up**: https://signup.sendgrid.com/
2. **Create API Key**: Settings → API Keys → Create API Key
3. **Update Render.com Environment Variables**:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
```

### Option 2: Use Mailgun

1. **Sign up**: https://www.mailgun.com/
2. **Get SMTP credentials**: Sending → Domain Settings → SMTP credentials
3. **Update environment variables**:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_mailgun_smtp_username
SMTP_PASS=your_mailgun_smtp_password
```

### Option 3: Use AWS SES

1. **Set up AWS SES**: https://aws.amazon.com/ses/
2. **Get SMTP credentials**: SES Console → SMTP Settings
3. **Update environment variables**:

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_ses_smtp_username
SMTP_PASS=your_ses_smtp_password
```

---

## Code Changes Made

The email service has been updated to:
- ✅ **Default to port 465** instead of 587
- ✅ **Auto-enable SSL** when port 465 is detected
- ✅ **Add connection timeouts** to fail faster
- ✅ **Disable connection pooling** for better cloud compatibility
- ✅ **Add debug logging** in development mode

---

## Testing Locally vs Production

### Localhost (Development)
You can still use port 587 locally if preferred:

```env
SMTP_PORT=587
SMTP_SECURE=false
```

### Render.com (Production)
Must use port 465:

```env
SMTP_PORT=465
SMTP_SECURE=true
```

The code automatically handles both configurations!

---

## Gmail App Password Setup

If using Gmail, you **must** use an App Password (not your regular password):

1. **Enable 2FA**: https://myaccount.google.com/security
2. **Generate App Password**: 
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password (remove spaces)
3. **Use this password** as `SMTP_PASS`

---

## Troubleshooting

### Still getting timeouts?

1. **Double-check port**: Must be `465` on Render.com
2. **Verify SMTP_SECURE**: Must be `true` for port 465
3. **Test credentials locally first**: Make sure they work on localhost
4. **Check Render logs**: Look for any other error messages
5. **Try SendGrid**: More reliable for production anyway

### Emails sending but not arriving?

1. **Check spam folder**
2. **Verify recipient email** is correct
3. **Check Gmail "Sent" folder** to confirm they're being sent
4. **Review email provider logs** (Gmail, SendGrid, etc.)

---

## Best Practices for Production

1. ✅ **Use a transactional email service** (SendGrid, Mailgun, AWS SES)
2. ✅ **Don't use personal Gmail** for production (has sending limits)
3. ✅ **Monitor email delivery** rates
4. ✅ **Implement retry logic** for failed emails
5. ✅ **Keep credentials in environment variables** (never commit to git)

---

## Quick Reference

| Platform | Port | Secure | Works on Render.com? |
|----------|------|--------|---------------------|
| Gmail 587 | 587 | false | ❌ No (blocked) |
| Gmail 465 | 465 | true | ✅ Yes |
| SendGrid | 465 | true | ✅ Yes |
| Mailgun | 465 | true | ✅ Yes |
| AWS SES | 465 | true | ✅ Yes |
