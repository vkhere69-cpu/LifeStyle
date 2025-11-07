export interface SiteSettings {
  id: string;
  logo_url: string;
  tagline: string;
  theme: string;
  instagram_token: string;
  youtube_api_key: string;
  cloudinary_cloud_name: string;
  cloudinary_api_key: string;
  updated_at: string;
}

export interface InstagramPost {
  id: string;
  instagram_id: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  caption: string;
  permalink: string;
  timestamp: string;
  is_visible: boolean;
  created_at: string;
}

export interface YouTubeVideo {
  _id: string;
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  is_visible: boolean;
  created_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  description: string;
  category: string;
  order_index: number;
  is_visible: boolean;
  created_at: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  media_urls: string[];
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ContactRequest {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
