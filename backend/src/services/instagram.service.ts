import axios from 'axios';

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REEL' | 'STORY';
  media_url: string;
  permalink: string;
  timestamp: string;
  thumbnail_url?: string;
  is_shared_to_feed?: boolean;
  children?: {
    data: Array<{
      id: string;
      media_type: string;
      media_url: string;
    }>;
  };
}

export class InstagramService {
  private static readonly GRAPH_API_BASE = 'https://graph.facebook.com/v24.0';
  private static readonly FIELDS = [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'timestamp',
    'thumbnail_url',
    'is_shared_to_feed',
    'children{media_type,media_url}'
  ].join(',');

  private static async getLongLivedToken(accessToken: string): Promise<string> {
    try {
      const response = await axios.get<{ access_token: string; expires_in: number }>(
        `${this.GRAPH_API_BASE}/oauth/access_token`,
        {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: process.env.INSTAGRAM_APP_ID,
            client_secret: process.env.INSTAGRAM_APP_SECRET,
            fb_exchange_token: accessToken
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting long-lived token:', error);
      throw new Error('Failed to get long-lived access token');
    }
  }

  static async fetchMedia(accessToken: string, userId: string, limit: number = 12): Promise<InstagramMedia[]> {
    try {
      // First get a long-lived token if we don't have one
      const longLivedToken = await this.getLongLivedToken(accessToken);
      
      // Fetch user's media
      const response = await axios.get<{ data: InstagramMedia[] }>(
        `${this.GRAPH_API_BASE}/${userId}/media`,
        {
          params: {
            fields: this.FIELDS,
            access_token: longLivedToken,
            limit,
            // Include both feed posts and reels
            // type: 'FEED,REELS',
          }
        }
      );
      
      return response.data?.data || [];
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      return [];
    }
  }

  static async syncPosts(accessToken: string, instagramUserId: string): Promise<void> {
    try {
      const mediaItems = await this.fetchMedia(accessToken, instagramUserId);
      
      for (const item of mediaItems) {
        // Skip if it's a story or not shared to feed (for reels)
        if (item.media_type === 'STORY' || (item.media_type === 'REEL' && !item.is_shared_to_feed)) {
          continue;
        }

        // Handle carousel albums (multiple images/videos)
        let mediaUrl = item.media_url;
        let mediaType = item.media_type.toLowerCase();
        
        if (item.media_type === 'CAROUSEL_ALBUM' && item.children?.data?.length) {
          // Use the first media item in the carousel
          mediaUrl = item.children.data[0].media_url;
          mediaType = item.children.data[0].media_type.toLowerCase();
        }

      }
      
      console.log('Successfully synced Instagram posts');
    } catch (error) {
      console.error('Error syncing Instagram posts:', error);
      throw error;
    }
  }
}

export default InstagramService;
