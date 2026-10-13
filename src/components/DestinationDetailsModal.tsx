import React from 'react';
import { X, MapPin, Calendar, Clock, Plane, Train, Sun, Utensils, Award, Star, CheckCircle, Package, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import { Destination, Review } from '../types';

interface DestinationDetailsModalProps {
  destination: Destination | null;
  onClose: () => void;
  onBookNow: (dest: Destination) => void;
  reviews: Review[];
  onWriteReview: (dest: Destination) => void;
}

export const DestinationDetailsModal: React.FC<DestinationDetailsModalProps> = ({
  destination,
  onClose,
  onBookNow,
  reviews,
  onWriteReview
}) => {
  if (!destination) return null;

  const destReviews = reviews.filter(r => r.destinationId === destination.id && r.status === 'APPROVED');
  const avgRating = destReviews.length > 0 
    ? (destReviews.reduce((acc, r) => acc + r.rating, 0) / destReviews.length).toFixed(1)
    : destination.rating.toFixed(1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Header */}
        <div className="relative aspect-21/9 min-h-[260px] sm:min-h-[320px] w-full overflow-hidden bg-slate-900">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              if (destination.fallbackImage) {
                (e.target as HTMLImageElement).src = destination.fallbackImage;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

          {/* Banner Details */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-600/90 backdrop-blur-md text-white border border-amber-400/40">
                {destination.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {destination.district}, {destination.region}
              </span>
              {destination.isHiddenGem && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600/90 text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Hidden Gem
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white mb-1">
              {destination.name}
            </h2>
            <p className="text-sm sm:text-base text-amber-200/90 font-medium">
              {destination.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                <p className="text-xs font-bold text-slate-800">{destination.verifiedInfo.idealDuration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Sun className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Best Season</p>
                <p className="text-xs font-bold text-slate-800">{destination.verifiedInfo.bestSeason.split('(')[0]}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Rating</p>
                <p className="text-xs font-bold text-slate-800">{avgRating} / 5.0 ({destReviews.length || destination.reviewCount} reviews)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                <span className="font-extrabold text-sm text-amber-800">₹</span>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Estimated Cost</p>
                <p className="text-xs font-bold text-slate-800">₹{destination.estimatedCostPerPerson.toLocaleString('en-IN')} / person</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">About {destination.name}</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {destination.description}
            </p>
          </div>

          {/* Key Attractions */}
          <div>
            <h3 className="text-base font-bold font-serif text-slate-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Must-Visit Attractions & Sights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {destination.attractions.map((att, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span className="text-xs font-medium text-slate-800">{att}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Guidance: Connectivity & Weather */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-amber-700" />
                Connectivity & Travel Guidance
              </h4>
              <p className="text-xs text-slate-700">
                <strong>Nearest Airport:</strong> {destination.verifiedInfo.nearestAirport}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Nearest Railway:</strong> {destination.verifiedInfo.nearestRailway}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Weather Note:</strong> {destination.verifiedInfo.weatherHighlight}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-700" />
                Local Culinary Specialties
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {destination.verifiedInfo.localCuisine.map((dish, idx) => (
                  <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-900 shadow-2xs">
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Available Tour Packages */}
          {destination.availablePackages && destination.availablePackages.length > 0 && (
            <div>
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-700" />
                <span>Verified Tour Packages</span>
              </h3>
              <div className="space-y-3">
                {destination.availablePackages.map(pkg => (
                  <div key={pkg.id} className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{pkg.name}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">{pkg.duration}</span>
                        {pkg.isGroupAvailable && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Group Departure Available</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        {pkg.highlights.join(' • ')}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {pkg.inclusions.map((inc, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="sm:text-right shrink-0">
                      <p className="text-base font-black text-slate-900">₹{pkg.pricePerPerson.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400">per person</p>
                      <button
                        onClick={() => {
                          onClose();
                          onBookNow(destination);
                        }}
                        className="mt-2 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1"
                      >
                        Select & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-700" />
                  <span>Customer Travel Stories & Reviews</span>
                </h3>
                <p className="text-xs text-slate-500">Verified experiences from real travelers</p>
              </div>

              <button
                onClick={() => onWriteReview(destination)}
                className="px-3.5 py-2 rounded-xl border border-amber-600 text-amber-700 hover:bg-amber-50 text-xs font-bold transition-all"
              >
                + Write a Review
              </button>
            </div>

            {destReviews.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-600 font-medium">
                  Be the first traveler to share your journey story for {destination.name}!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {destReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.customerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-300"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.customerName}</p>
                          <p className="text-[10px] text-slate-400">{rev.travelDate} • {rev.companionType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-xs font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{rev.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4 sm:px-8 flex items-center justify-between z-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Starting Price</p>
            <p className="text-xl font-black text-slate-900">
              ₹{destination.estimatedCostPerPerson.toLocaleString('en-IN')}{' '}
              <span className="text-xs font-normal text-slate-500">/ traveler</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(destination);
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Book Trip to {destination.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
