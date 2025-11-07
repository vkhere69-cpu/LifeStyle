const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return { data: data.user, error: null };
  }

  async register(email: string, password: string, name: string) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    return { data: data.user, error: null };
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Settings
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // YouTube
  async getYouTubeVideos(page = 1, limit = 10) {
    return this.request(`/youtube?page=${page}&limit=${limit}`);
  }

  async updateYouTubeVisibility(id: string, is_visible: boolean) {
    return this.request(`/youtube/${id}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ is_visible }),
    });
  }

  async deleteYouTubeVideo(id: string) {
    return this.request(`/youtube/${id}`, {
      method: 'DELETE',
    });
  }

  // Portfolio
  async getPortfolioItems(includeHidden = false) {
    const endpoint = includeHidden ? '/portfolio/all' : '/portfolio';
    return this.request(endpoint);
  }

  async createPortfolioItem(item: any) {
    return this.request('/portfolio', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updatePortfolioItem(id: string, item: any) {
    return this.request(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deletePortfolioItem(id: string) {
    return this.request(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog
  async getBlogPosts(includeUnpublished = false) {
    const endpoint = includeUnpublished ? '/blog/all' : '/blog';
    return this.request(endpoint);
  }

  async getBlogPostBySlug(slug: string) {
    return this.request(`/blog/slug/${slug}`);
  }

  async getBlogPostById(id: string) {
    return this.request(`/blog/${id}`);
  }

  async createBlogPost(post: any) {
    return this.request('/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updateBlogPost(id: string, post: any) {
    return this.request(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  async deleteBlogPost(id: string) {
    return this.request(`/blog/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact
  async createContactRequest(contact: any) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async getContactRequests() {
    return this.request('/contact');
  }

  async updateContactStatus(id: string, status: string) {
    return this.request(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteContactRequest(id: string) {
    return this.request(`/contact/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics
  async trackPageView(page_view: string, visitor_ip?: string, user_agent?: string) {
    return this.request('/analytics', {
      method: 'POST',
      body: JSON.stringify({ page_view, visitor_ip, user_agent }),
    });
  }

  async getAnalytics() {
    return this.request('/analytics');
  }

  async getAnalyticsSummary() {
    return this.request('/analytics/summary');
  }


async getYouTubeVideoById(id: string) {
  return this.request(`/youtube/${id}`);
}

async syncYouTubeVideos() {
  return this.request('/youtube/sync', { method: 'POST' });
}

// Hero Content
async getHeroContent() {
  return this.request('/hero');
}

async updateHeroContent(content: any) {
  return this.request('/hero', {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}

// Notifications
async getNotifications() {
  return this.request('/notifications');
}

async getAllNotifications() {
  return this.request('/notifications/all');
}

async createNotification(notification: any) {
  return this.request('/notifications', {
    method: 'POST',
    body: JSON.stringify(notification),
  });
}

async updateNotification(id: string, notification: any) {
  return this.request(`/notifications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(notification),
  });
}

async deleteNotification(id: string) {
  return this.request(`/notifications/${id}`, {
    method: 'DELETE',
  });
}

// Subscribers
async subscribe(email: string) {
  return this.request('/subscribers/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async unsubscribe(email: string) {
  return this.request('/subscribers/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

async getSubscribers() {
  return this.request('/subscribers');
}

async getSubscriberStats() {
  return this.request('/subscribers/stats');
}

async deleteSubscriber(id: string) {
  return this.request(`/subscribers/${id}`, {
    method: 'DELETE',
  });
}
}

export const apiClient = new ApiClient();
