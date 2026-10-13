import React from 'react';
import { Star, MapPin, Sparkles, Package, ArrowRight, Eye, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onViewDetails: (dest: Destination) => void;
  onBookNow: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onViewDetails,
  onBookNow
}) => {
  const [imgError, setImgError] = React.useState(false);

  const displayImage = imgError && destination.fallbackImage
    ? destination.fallbackImage
    : destination.heroImage;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Photograph Container */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={destination.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay for Top Badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20">
            <MapPin className="w-3 h-3 text-amber-400" />
            {destination.district}
          </span>

          <div className="flex items-center gap-1.5">
            {destination.isHiddenGem && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-emerald-100 border border-emerald-400/40">
                <Sparkles className="w-2.5 h-2.5" />
                Hidden Gem
              </span>
            )}
            {destination.isTrending && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-white border border-amber-300/40">
                Trending
              </span>
            )}
          </div>
        </div>

        {/* Bottom Photograph Meta (Category & Rating) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 backdrop-blur-md">
            {destination.category}
          </span>

          {destination.reviewCount > 0 && (
            <div className="inline-flex items-center gap-1 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold border border-amber-500/30">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{destination.rating.toFixed(1)}</span>
              <span className="text-white/60 text-[10px]">({destination.reviewCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
              {destination.name}
            </h3>
            <p className="text-xs text-amber-800/80 font-medium line-clamp-1 mt-0.5">
              {destination.tagline}
            </p>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Key Attractions Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {destination.attractions.slice(0, 3).map((att, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50/80 text-amber-900 border border-amber-200/60"
              >
                {att}
              </span>
            ))}
            {destination.attractions.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium px-1.5 py-0.5">
                +{destination.attractions.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Estimated Cost
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900">
                  ₹{destination.estimatedCostPerPerson.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">/ person</span>
              </div>
            </div>

            {destination.availablePackages?.length > 0 && (
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Tour Packages
                </p>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  <Package className="w-3 h-3 text-amber-600" />
                  <span>{destination.availablePackages.length} Available</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetails(destination)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-white hover:bg-amber-50/40"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Details</span>
            </button>

            <button
              onClick={() => onBookNow(destination)}
              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs shadow-amber-600/20"
            >
              <span>Book Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
