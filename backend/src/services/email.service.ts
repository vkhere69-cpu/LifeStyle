import nodemailer from 'nodemailer';
import { Subscriber } from '../models/Subscriber.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure transporter with environment variables
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail({ to, subject, html }: EmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME || 'Lifestyle'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }
  }

  async sendBulkEmail(subject: string, html: string, filter: any = {}) {
    try {
      const subscribers = await Subscriber.find({ 
        is_active: true,
        ...filter 
      });

      const results = await Promise.allSettled(
        subscribers.map(subscriber =>
          this.sendEmail({
            to: subscriber.email,
            subject,
            html: this.addUnsubscribeLink(html, subscriber.email),
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      // Update last_notified timestamp
      await Subscriber.updateMany(
        { is_active: true, ...filter },
        { last_notified: new Date() }
      );

      return { 
        total: subscribers.length, 
        successful, 
        failed,
        results 
      };
    } catch (error) {
      console.error('Bulk email error:', error);
      throw error;
    }
  }

  private addUnsubscribeLink(html: string, email: string): string {
    const unsubscribeUrl = `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email)}`;
    const unsubscribeFooter = `
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Don't want these emails? 
          <a href="${unsubscribeUrl}" style="color: #8b5cf6; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    `;
    return html.replace('</body>', `${unsubscribeFooter}</body>`);
  }

  // Email templates
  createYouTubeUpdateEmail(videoTitle: string, videoThumbnail: string, videoUrl: string) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New YouTube Short!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #ffffff 0%, #fef3c7 50%, #ede9fe 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="background: linear-gradient(to right, #7c3aed, #a855f7, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">
        🎬 New Short Available!
      </h1>
    </div>

    <!-- Content Card -->
    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(124, 58, 237, 0.1);">
      <!-- Thumbnail -->
      <img src="${videoThumbnail}" alt="${videoTitle}" style="width: 100%; height: auto; display: block;">
      
      <!-- Content -->
      <div style="padding: 30px;">
        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">
          ${videoTitle}
        </h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
          Check out my latest YouTube Short! I think you'll love this one. 🎉
        </p>

        <!-- CTA Button -->
        <a href="${videoUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #7c3aed, #a855f7); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
          Watch Now →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        Thanks for subscribing! More amazing content coming soon.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  createBlogUpdateEmail(blogTitle: string, blogExcerpt: string, blogUrl: string, featuredImage?: string) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Blog Post!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #ede9fe 0%, #ffffff 50%, #fef3c7 100%);">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="background: linear-gradient(to right, #fbbf24, #7c3aed, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 32px; font-weight: bold; margin: 0;">
        ✍️ Fresh Off the Press!
      </h1>
    </div>

    <!-- Content Card -->
    <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.1);">
      ${featuredImage ? `<img src="${featuredImage}" alt="${blogTitle}" style="width: 100%; height: auto; display: block;">` : ''}
      
      <!-- Content -->
      <div style="padding: 30px;">
        <div style="display: inline-block; padding: 6px 16px; background: linear-gradient(to right, #ede9fe, #fef3c7); border-radius: 9999px; margin-bottom: 15px;">
          <span style="color: #7c3aed; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">New Post</span>
        </div>

        <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 15px 0; font-weight: 600;">
          ${blogTitle}
        </h2>
        
        <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
          ${blogExcerpt}
        </p>

        <!-- CTA Button -->
        <a href="${blogUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #fbbf24, #a855f7); color: white; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(251, 191, 36, 0.4);">
          Read Article →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px;">
      <p style="color: #9ca3af; font-size: 14px; margin: 0;">
        Stay tuned for more updates and stories!
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const emailService = new EmailService();
