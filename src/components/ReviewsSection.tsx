import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, Edit2, Trash2, Heart, Filter } from 'lucide-react';
import { Review, User as AppUser, Destination } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  destinations: Destination[];
  currentUser: AppUser;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
  onWriteReviewClick: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  destinations,
  currentUser,
  onEditReview,
  onDeleteReview,
  onWriteReviewClick
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterDest, setFilterDest] = useState<string>('all');

  const filteredReviews = reviews.filter(r => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (filterDest !== 'all' && r.destinationId !== filterDest) return false;
    return true;
  });

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Real Traveler Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 tracking-tight">
            Memories of Tamil Nadu
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Read verified customer experiences from family excursions, solo explorations, and cultural tours across the state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Average Rating Badge */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-xl font-black text-slate-900">{avgRating}</span>
            </div>
            <div className="text-left text-xs text-slate-500 font-medium">
              <span>Overall Rating</span>
              <span className="block text-[11px] text-slate-400">({reviews.length} Traveler Reviews)</span>
            </div>
          </div>

          <button
            onClick={onWriteReviewClick}
            className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Share Your Journey</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </span>

        <select
          value={filterDest}
          onChange={(e) => setFilterDest(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
        >
          <option value="all">All Destinations</option>
          {destinations.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          value={filterRating === 'all' ? 'all' : String(filterRating)}
          onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4 Stars Only</option>
          <option value="3">3 Stars & Below</option>
        </select>

        <span className="text-xs text-slate-400 ml-auto">
          Showing {filteredReviews.length} stories
        </span>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((rev) => {
          const dest = destinations.find(d => d.id === rev.destinationId);
          const isOwner = rev.customerId === currentUser.id || currentUser.role === 'admin';

          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: User, Date, Destination Tag */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/40"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{rev.customerName}</h4>
                      <p className="text-[11px] text-slate-400">
                        {rev.travelDate} • {rev.companionType}
                      </p>
                    </div>
                  </div>

                  {rev.isVerifiedBooking && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Trip
                    </span>
                  )}
                </div>

                {/* Destination Name Badge */}
                <div className="mb-2.5">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    📍 {dest ? dest.name : rev.destinationId.toUpperCase()}
                  </span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1.5">{rev.rating}.0</span>
                </div>

                {/* Title & Content */}
                <h3 className="text-base font-bold text-slate-900 mb-1.5 font-serif leading-snug">
                  "{rev.title}"
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rev.content}
                </p>

                {/* Optional Photo Attachment */}
                {rev.photoUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden aspect-16/9 bg-slate-100">
                    <img
                      src={rev.photoUrl}
                      alt="Travel photo"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Owner Edit & Delete Actions */}
              {isOwner && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-amber-700 font-semibold">Your Review</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEditReview(rev)}
                      className="hover:text-amber-700 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this review permanently?')) {
                          onDeleteReview(rev.id);
                        }
                      }}
                      className="hover:text-rose-600 flex items-center gap-1 font-bold text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
