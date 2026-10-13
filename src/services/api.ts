import { Destination, PromotionConfig, ServiceCatalog, Booking, Review, User } from '../types';

export const api = {
  // Authentication APIs
  async customerLogin(credentials: { email: string; password?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/customer-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Customer login failed');
    return data;
  },

  async customerSignup(payload: { name: string; email: string; phone: string; password?: string }): Promise<{ user: User; token: string }> {
    const res = await fetch('/api/auth/customer-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Customer signup failed');
    return data;
  },

  async adminLogin(credentials: { email: string; password?: string; securityPasscode?: string }): Promise<{ admin: User; token: string }> {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Administrator login failed');
    return data;
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/auth/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch {
      return [];
    }
  },
  // Destinations
  async getDestinations(params?: { category?: string; district?: string; search?: string; hidden?: boolean }): Promise<Destination[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.district && params.district !== 'All') query.set('district', params.district);
      if (params?.search) query.set('search', params.search);
      if (params?.hidden) query.set('hidden', 'true');

      const res = await fetch(`/api/destinations?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return await res.json();
    } catch (err) {
      console.warn('API fetch failed, falling back to local fallback if available', err);
      throw err;
    }
  },

  async getDestinationById(id: string): Promise<Destination> {
    const res = await fetch(`/api/destinations/${id}`);
    if (!res.ok) throw new Error('Destination not found');
    return await res.json();
  },

  async createDestination(data: Partial<Destination>): Promise<Destination> {
    const res = await fetch('/api/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create destination');
    return await res.json();
  },

  async updateDestination(id: string, data: Partial<Destination>): Promise<Destination> {
    const res = await fetch(`/api/destinations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update destination');
    return await res.json();
  },

  async deleteDestination(id: string): Promise<boolean> {
    const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete destination');
    return true;
  },

  // Services Catalog
  async getServices(): Promise<ServiceCatalog> {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('Failed to fetch services catalog');
    return await res.json();
  },

  // Promotion
  async getPromotionConfig(): Promise<PromotionConfig> {
    const res = await fetch('/api/promotions/config');
    if (!res.ok) throw new Error('Failed to fetch promotion config');
    return await res.json();
  },

  async updatePromotionConfig(config: Partial<PromotionConfig>): Promise<PromotionConfig> {
    const res = await fetch('/api/promotions/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error('Failed to update promotion');
    return await res.json();
  },

  async checkPromotionEligibility(payload: { customerEmail?: string; customerId?: string; amount: number }): Promise<{
    eligible: boolean;
    reason: string;
    discountPercent: number;
    discountAmount: number;
    maxCapApplied?: boolean;
    promoCode?: string;
  }> {
    const res = await fetch('/api/promotions/check-eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to check eligibility');
    return await res.json();
  },

  // Bookings
  async getBookings(params?: { customerId?: string; customerEmail?: string }): Promise<Booking[]> {
    const query = new URLSearchParams();
    if (params?.customerId) query.set('customerId', params.customerId);
    if (params?.customerEmail) query.set('customerEmail', params.customerEmail);

    const res = await fetch(`/api/bookings?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return await res.json();
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}`);
    if (!res.ok) throw new Error('Booking not found');
    return await res.json();
  },

  async createBooking(bookingData: any): Promise<Booking> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Booking submission failed' }));
      throw new Error(err.error || 'Failed to submit booking');
    }
    return await res.json();
  },

  async updateBookingStatus(id: string, status: { bookingStatus?: string; paymentStatus?: string }): Promise<Booking> {
    const res = await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(status)
    });
    if (!res.ok) throw new Error('Failed to update booking status');
    return await res.json();
  },

  // Reviews
  async getReviews(params?: { destinationId?: string; customerId?: string }): Promise<Review[]> {
    const query = new URLSearchParams();
    if (params?.destinationId) query.set('destinationId', params.destinationId);
    if (params?.customerId) query.set('customerId', params.customerId);

    const res = await fetch(`/api/reviews?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch reviews');
    return await res.json();
  },

  async createReview(reviewData: any): Promise<Review> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Review creation failed' }));
      throw new Error(err.error || 'Failed to submit review');
    }
    return await res.json();
  },

  async updateReview(id: string, reviewData: any): Promise<Review> {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) throw new Error('Failed to update review');
    return await res.json();
  },

  async deleteReview(id: string): Promise<boolean> {
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
    return true;
  },

  // Admin Stats
  async getAdminStats(): Promise<{
    totalBookings: number;
    totalRevenue: number;
    activePromos: number;
    totalReviews: number;
    avgRating: string;
    destinationsCount: number;
  }> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Failed to fetch admin stats');
    return await res.json();
  },

  // AI Travel Chatbot
  async sendChatMessage(payload: { message: string; history?: { role: string; text: string }[] }): Promise<{ reply: string; suggestedDestinations?: string[] }> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to send message to AI Concierge');
    return await res.json();
  }
};
