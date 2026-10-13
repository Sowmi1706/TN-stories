import React, { useState } from 'react';
import { X, Star, Upload, Check, AlertCircle, Camera, CheckCircle } from 'lucide-react';
import { Destination, Booking, Review, User as AppUser } from '../types';
import { api } from '../services/api';

interface ReviewModalProps {
  destination?: Destination | null;
  destinations: Destination[];
  userBookings: Booking[];
  currentUser: AppUser;
  existingReview?: Review | null;
  onClose: () => void;
  onReviewSubmitted: (review: Review) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  destination,
  destinations,
  userBookings,
  currentUser,
  existingReview,
  onClose,
  onReviewSubmitted
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(
    existingReview?.destinationId || destination?.id || destinations[0]?.id || 'ooty'
  );
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    existingReview?.bookingId || userBookings[0]?.id || ''
  );
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>(existingReview?.title || '');
  const [content, setContent] = useState<string>(existingReview?.content || '');
  const [travelDate, setTravelDate] = useState<string>(existingReview?.travelDate || 'March 2026');
  const [companionType, setCompanionType] = useState<string>(existingReview?.companionType || 'Family Trip');
  const [photoUrl, setPhotoUrl] = useState<string>(existingReview?.photoUrl || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setErrorMsg('Please provide both a title and your travel story.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      if (existingReview) {
        // Edit existing review
        const updated = await api.updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          content: content.trim(),
          travelDate,
          companionType,
          photoUrl: photoUrl.trim() || null,
          customerId: currentUser.id
        });
        onReviewSubmitted(updated);
      } else {
        // Create new review
        const newRev = await api.createReview({
          destinationId: selectedDestId,
          bookingId: selectedBookingId || undefined,
          customerId: currentUser.id,
          customerName: currentUser.name,
          customerAvatar: currentUser.avatar,
          rating,
          title: title.trim(),
          content: content.trim(),
          travelDate,
          companionType,
          photoUrl: photoUrl.trim() || null
        });
        onReviewSubmitted(newRev);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const samplePhotos = [
    { label: "Temple Sunrise", url: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=600&q=80" },
    { label: "Misty Tea Hills", url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80" },
    { label: "Heritage Courtyard", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80" },
    { label: "Coastal Confluence", url: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80" }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
            {existingReview ? 'Edit Your Travel Story' : 'Share Your Travel Experience'}
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
            {existingReview ? 'Update Your Review' : 'Write a Trip Review'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspire other travelers with your authentic Tamil Nadu memories.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Destination Visited *
            </label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              disabled={Boolean(destination)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {destinations.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.district})</option>
              ))}
            </select>
          </div>

          {/* Associated Booking if any */}
          {userBookings.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Link to Verified Booking (Optional)
              </label>
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700"
              >
                <option value="">No specific booking / Walk-in journey</option>
                {userBookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id} — {b.destinationName} ({b.travelDates.startDate})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Overall Experience Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none transition-colors"
                >
                  <Star 
                    className={`w-7 h-7 ${
                      (hoverRating || rating) >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-700 ml-2">
                {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : rating === 3 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          {/* Companion & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Trip Date</label>
              <input
                type="text"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                placeholder="E.g., March 2026"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Companion Type</label>
              <select
                value={companionType}
                onChange={(e) => setCompanionType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
              >
                <option value="Family Trip">Family Trip</option>
                <option value="Solo Travel">Solo Travel</option>
                <option value="Friends Trip">Friends Trip</option>
                <option value="Group Tour">Group Tour</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Review Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Breathtaking Nilgiri vistas and wonderful caretaker!"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          {/* Review Story Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Travel Story *
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your journey, highlights, local food tasted, local guide assistance..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Optional Trip Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Trip Photograph (Optional Image URL)
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
            />
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] text-slate-400 font-semibold">Or pick a sample photo:</span>
              {samplePhotos.map((sp, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setPhotoUrl(sp.url)}
                  className="text-[10px] text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60"
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all"
            >
              {isSubmitting ? 'Saving Review...' : (existingReview ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
