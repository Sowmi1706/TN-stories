import React, { useState } from 'react';
import { X, Calendar, MapPin, Tag, CheckCircle, Clock, ShieldCheck, Printer, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import { User, Booking, Review, Destination } from '../types';

interface UserProfileModalProps {
  currentUser: User;
  bookings: Booking[];
  reviews: Review[];
  destinations: Destination[];
  promoEligible: boolean;
  onClose: () => void;
  onWriteReviewForBooking: (booking: Booking) => void;
  onEditReview: (review: Review) => void;
  onDeleteReview: (reviewId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  bookings,
  reviews,
  destinations,
  promoEligible,
  onClose,
  onWriteReviewForBooking,
  onEditReview,
  onDeleteReview
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews'>('bookings');
  const [selectedVoucher, setSelectedVoucher] = useState<Booking | null>(null);

  const userBookings = bookings.filter(b => 
    b.customerId === currentUser.id || 
    b.customerEmail?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const userReviews = reviews.filter(r => r.customerId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-t-3xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
              }}
            />
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-xl sm:text-2xl font-bold font-serif">{currentUser.name}</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 tracking-wider">
                  {currentUser.role === 'admin' ? 'Administrator' : 'Explorer'}
                </span>
              </div>
              <p className="text-xs text-amber-200">{currentUser.email} • {currentUser.phone}</p>
              
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {promoEligible ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/40 text-amber-100 border border-amber-400/50">
                    <Tag className="w-3.5 h-3.5 text-amber-300" />
                    10% First Booking Offer Eligible!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/40">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    Verified Traveler Account
                  </span>
                )}
                <span className="text-xs text-white/70">
                  {userBookings.length} Trips Booked • {userReviews.length} Reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 sm:px-8 bg-slate-50">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'bookings'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Trips & Bookings ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Travel Reviews ({userReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'bookings' && (
            <div>
              {userBookings.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-700">No bookings found yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Book your first trip to Tamil Nadu with 10% OFF today!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:border-amber-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                            {b.id}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            b.bookingStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                            b.bookingStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {b.bookingStatus}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {b.paymentStatus === 'PAID' ? '• Paid' : '• Pay on Arrival'}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">{b.destinationName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {b.travelDates.startDate} to {b.travelDates.returnDate} • {b.travellers.total} Travelers • {b.arrangementPreference === 'curated' ? (b.selectedPackageName || 'Curated Package') : 'Custom Plan'}
                        </p>
                        {b.caretakerGuidePreference !== 'none' && (
                          <span className="text-[11px] text-amber-700 font-semibold block mt-1">
                            Assistance: {b.caretakerGuidePreference.toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="sm:text-right shrink-0">
                        <p className="text-lg font-black text-slate-900">
                          ₹{b.pricing?.finalPayableAmount?.toLocaleString('en-IN')}
                        </p>
                        {b.pricing?.discountAmount > 0 && (
                          <p className="text-[10px] text-emerald-700 font-bold">
                            Saved ₹{b.pricing.discountAmount.toLocaleString('en-IN')} (First Booking Offer)
                          </p>
                        )}

                        <div className="flex items-center gap-2 mt-2 sm:justify-end">
                          <button
                            onClick={() => setSelectedVoucher(b)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" /> Voucher
                          </button>
                          <button
                            onClick={() => onWriteReviewForBooking(b)}
                            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" /> Review Trip
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {userReviews.length === 0 ? (
                <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-700">You haven't written any reviews yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Share your experience to help fellow travelers explore Tamil Nadu.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userReviews.map((rev) => {
                    const dest = destinations.find(d => d.id === rev.destinationId);
                    return (
                      <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-white">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-amber-800">
                            📍 {dest ? dest.name : rev.destinationId}
                          </span>
                          <span className="text-xs font-bold text-amber-600">★ {rev.rating}/5</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 font-serif">"{rev.title}"</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.content}</p>
                        <div className="flex items-center justify-end gap-3 mt-3 pt-2 border-t border-slate-100 text-xs">
                          <button
                            onClick={() => onEditReview(rev)}
                            className="text-slate-600 hover:text-amber-800 font-bold flex items-center gap-1 text-[11px]"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => onDeleteReview(rev.id)}
                            className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voucher Modal Overlay if clicked */}
        {selectedVoucher && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center pb-4 border-b border-slate-100">
                <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  TN Stories Official Travel Voucher
                </span>
                <h4 className="text-xl font-bold font-serif text-slate-900 mt-2">{selectedVoucher.destinationName}</h4>
                <p className="text-xs font-mono text-slate-500 font-bold">Booking ID: {selectedVoucher.id}</p>
              </div>
              <div className="py-4 space-y-2 text-xs text-slate-700">
                <p><strong>Lead Traveler:</strong> {selectedVoucher.customerName} ({selectedVoucher.customerPhone})</p>
                <p><strong>Travel Dates:</strong> {selectedVoucher.travelDates.startDate} to {selectedVoucher.travelDates.returnDate} ({selectedVoucher.travelDates.durationDays} Days)</p>
                <p><strong>Travelers:</strong> {selectedVoucher.travellers.adults} Adults, {selectedVoucher.travellers.children} Kids</p>
                <p><strong>Companion Type:</strong> {selectedVoucher.companionType.toUpperCase()}</p>
                <p><strong>Assistance:</strong> {selectedVoucher.caretakerGuidePreference.toUpperCase()}</p>
                <p><strong>Total Payable:</strong> ₹{selectedVoucher.pricing.finalPayableAmount.toLocaleString('en-IN')}</p>
                <p><strong>Payment Status:</strong> {selectedVoucher.paymentStatus}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Voucher
                </button>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
