import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { PromotionConfig } from '../types';

interface PromoBannerProps {
  promo: PromotionConfig | null;
  isEligible: boolean;
  onClaim: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  promo,
  isEligible,
  onClaim
}) => {
  if (!promo || !promo.active) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-30 mb-12">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 p-6 sm:p-8 text-white shadow-xl border border-amber-500/30">
        {/* Decorative background glow & traditional kolam pattern hint */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Limited Period Welcome Privilege</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight text-white">
              Welcome to TN Stories! 🎉
            </h3>

            <p className="text-base sm:text-lg text-amber-100 font-medium leading-snug">
              Your first adventure comes with a special offer! Book your first eligible trip and enjoy{' '}
              <span className="text-amber-300 font-black underline decoration-amber-400/60 underline-offset-4">
                10% OFF
              </span>
              .
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-amber-200/90 font-medium">
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-md">
                <Tag className="w-3.5 h-3.5 text-amber-300" />
                Promo Code: <strong className="text-white font-mono">{promo.code}</strong>
              </span>
              <span>• Max Savings: ₹{promo.maxDiscountAmount.toLocaleString('en-IN')}</span>
              <span>• Valid on trips above ₹{promo.minBookingAmount.toLocaleString('en-IN')}</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Auto-verified at checkout
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onClaim}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-sm sm:text-base shadow-lg shadow-amber-900/40 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>{isEligible ? 'Claim Your Offer & Book Now' : 'Plan Your Trip'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
