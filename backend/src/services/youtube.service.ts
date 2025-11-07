// backend/src/services/youtube.service.ts
import axios from 'axios';
import YouTubeVideo from '../models/YouTubeVideo';
import { emailService } from './email.service';

export class YoutubeService {
  private static readonly YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';
  private static readonly MAX_RESULTS = 50; // Max allowed by YouTube API

  static async fetchAndStoreVideos() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      throw new Error('YouTube API key or Channel ID not configured');
    }

    try {
      // Get the most recent video date from our DB
      const latestVideo = await YouTubeVideo.findOne()
        .sort({ published_at: -1 })
        .lean();

      // Fetch videos from YouTube API
      const response = await axios.get<{ items: any[] }>(
        `${this.YOUTUBE_API_URL}/search`,
        {
          params: {
            part: 'snippet',
            channelId,
            maxResults: this.MAX_RESULTS,
            order: 'date',
            type: 'video',
            key: apiKey
          }
        }
      );

      const videos = response.data.items.map((item: any) => ({
        youtube_id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail_url: item.snippet.thumbnails.medium.url,
        published_at: new Date(item.snippet.publishedAt),
        is_visible: true
      }));

      // Get existing video IDs from database
      const existingVideoIds = await YouTubeVideo.find(
        { youtube_id: { $in: videos.map((v: any) => v.youtube_id) } },
        { youtube_id: 1 }
      ).lean();
      
      const existingIds = new Set(existingVideoIds.map(v => v.youtube_id));
      
      // Filter to only new videos (not already in database)
      const newVideos = videos.filter((video: any) => 
        !existingIds.has(video.youtube_id)
      );

      // Save new videos to database
      if (newVideos.length > 0) {
        await YouTubeVideo.insertMany(newVideos, { ordered: false });
        
        // Send email notifications for new videos
        console.log(`Sending email notifications for ${newVideos.length} new video(s)...`);
        
        for (const video of newVideos) {
          try {
            const videoUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;
            const emailHtml = emailService.createYouTubeUpdateEmail(
              video.title,
              video.thumbnail_url,
              videoUrl
            );
            
            const result = await emailService.sendBulkEmail(
              `🎬 New Short: ${video.title}`,
              emailHtml,
              { 'preferences.youtube_updates': true }
            );
            
            console.log(`Email notification sent: ${result.successful}/${result.total} successful`);
          } catch (emailError) {
            console.error('Error sending email notification:', emailError);
            // Continue even if email fails
          }
        }
      }

      return {
        totalFetched: videos.length,
        newVideos: newVideos.length,
        latestVideo: videos[0]?.published_at
      };
    } catch (error) {
      console.error('Error in YouTube service:', error);
      throw error;
    }
  }

  static async getVideos(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [videos, total] = await Promise.all([
        YouTubeVideo.find({ is_visible: true })
          .sort({ published_at: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        YouTubeVideo.countDocuments({ is_visible: true })
      ]);

      return {
        videos,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalVideos: total,
          hasMore: skip + videos.length < total
        }
      };
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  }

  static async updateVisibility(id: string, isVisible: boolean) {
    try {
      const video = await YouTubeVideo.findByIdAndUpdate(
        id,
        { is_visible: isVisible },
        { new: true }
      ).lean();
      
      return video;
    } catch (error) {
      console.error('Error updating video visibility:', error);
      throw error;
    }
  }

  static async deleteVideo(id: string) {
    try {
      const video = await YouTubeVideo.findByIdAndDelete(id);
      return video;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  }
}

export default YoutubeService;