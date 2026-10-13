import React, { useState } from 'react';
import { 
  X, BarChart3, MapPin, Package, CalendarCheck, Settings, 
  Tag, MessageSquare, Plus, Edit2, Trash2, Check, AlertCircle, 
  DollarSign, Users, Star, ArrowUpRight, ShieldCheck, CheckCircle
} from 'lucide-react';
import { 
  Destination, Booking, Review, PromotionConfig, ServiceCatalog, 
  TourismCategory 
} from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  destinations: Destination[];
  bookings: Booking[];
  reviews: Review[];
  promotion: PromotionConfig;
  services: ServiceCatalog;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  destinations,
  bookings,
  reviews,
  promotion,
  services,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'destinations' | 'bookings' | 'services' | 'offers' | 'reviews'
  >('overview');

  // Promotion Edit State
  const [promoForm, setPromoForm] = useState<PromotionConfig>({ ...promotion });
  const [promoSaveSuccess, setPromoSaveSuccess] = useState(false);

  // Destination Edit/Add State
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [isAddingDest, setIsAddingDest] = useState(false);
  const [destForm, setDestForm] = useState<Partial<Destination>>({
    name: '',
    tagline: '',
    district: '',
    region: 'Western Ghats',
    category: 'Hill Station',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    estimatedCostPerPerson: 6500,
    isHiddenGem: false,
    isTrending: true,
    isPopular: true,
    attractions: ['Sightseeing', 'Cultural Center'],
    verifiedInfo: {
      idealDuration: '2 - 3 Days',
      bestSeason: 'October to March',
      nearestAirport: 'Coimbatore Airport',
      nearestRailway: 'Local Station',
      weatherHighlight: 'Pleasant and breezy',
      localCuisine: ['Filter Coffee', 'Traditional Thali'],
      cultureHighlights: ['Temple Arts', 'Handloom']
    },
    availablePackages: []
  });

  // Calculate Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.pricing?.finalPayableAmount || 0), 0);
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED').length;
  const totalReviewsCount = reviews.length;
  const promoRedemptions = bookings.filter(b => b.pricing?.discountAmount > 0).length;
  const totalDiscountGranted = bookings.reduce((sum, b) => sum + (b.pricing?.discountAmount || 0), 0);

  // Handle Promo Save
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updatePromotionConfig(promoForm);
      setPromoSaveSuccess(true);
      setTimeout(() => setPromoSaveSuccess(false), 3000);
      onRefreshData();
    } catch (err) {
      alert('Failed to save promotion settings');
    }
  };

  // Handle Booking Status Update
  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await api.updateBookingStatus(bookingId, { bookingStatus: status });
      onRefreshData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to remove this review under the moderation policy?')) {
      await api.deleteReview(reviewId);
      onRefreshData();
    }
  };

  // Handle Destination Save
  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDest) {
        await api.updateDestination(editingDest.id, destForm);
      } else {
        await api.createDestination(destForm);
      }
      setIsAddingDest(false);
      setEditingDest(null);
      onRefreshData();
    } catch (err) {
      alert('Failed to save destination');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-serif">TN Stories Administration Portal</h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/30">
                  Role: Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Tourism Inventory, Pricing Engine, Bookings & Moderation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Admin Portal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Nav Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 px-4 sm:px-6 bg-slate-50 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'overview' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview & KPI
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'destinations' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" /> Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'bookings' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'services' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" /> Services & Assistance
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'offers' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" /> First-Booking Offer
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'reviews' ? 'border-purple-600 text-purple-800 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Reviews Moderation ({reviews.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Total Bookings</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-900">{totalBookings}</span>
                    <span className="text-xs text-emerald-700 font-bold">{confirmedBookings} Confirmed</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Gross Value</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-slate-500">Gross</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Welcome Discount Granted</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-900">₹{totalDiscountGranted.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-amber-700 font-bold">{promoRedemptions} Redemptions</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Customer Reviews</span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-black text-slate-900">{totalReviewsCount}</span>
                    <span className="text-xs text-blue-700 font-bold">100% Moderated</span>
                  </div>
                </div>
              </div>

              {/* Recent Bookings Queue */}
              <div className="pt-4">
                <h4 className="text-base font-bold font-serif text-slate-900 mb-3">
                  Live Booking Activity Feed
                </h4>
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Reference</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Destination</th>
                        <th className="p-3">Dates & Count</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-amber-800">{b.id}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{b.customerName}</span>
                            <span className="text-[10px] text-slate-400">{b.customerPhone}</span>
                          </td>
                          <td className="p-3 font-bold text-slate-800">{b.destinationName}</td>
                          <td className="p-3">{b.travelDates.startDate} ({b.travellers.total} pax)</td>
                          <td className="p-3 font-bold text-slate-900">₹{b.pricing.finalPayableAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DESTINATIONS INVENTORY */}
          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold font-serif text-slate-900">Tamil Nadu Destinations Catalog</h4>
                  <p className="text-xs text-slate-500">Configure photographs, categories, attractions, and tour packages.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingDest(null);
                    setIsAddingDest(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Destination
                </button>
              </div>

              {/* Destination Form if adding or editing */}
              {(isAddingDest || editingDest) && (
                <form onSubmit={handleSaveDestination} className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-purple-900">
                      {editingDest ? `Edit Destination: ${editingDest.name}` : 'Create New Destination'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => { setIsAddingDest(false); setEditingDest(null); }}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Destination Name *</label>
                      <input
                        type="text"
                        required
                        value={destForm.name}
                        onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">District *</label>
                      <input
                        type="text"
                        required
                        value={destForm.district}
                        onChange={(e) => setDestForm({ ...destForm, district: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category *</label>
                      <select
                        value={destForm.category}
                        onChange={(e) => setDestForm({ ...destForm, category: e.target.value as TourismCategory })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      >
                        <option value="Hill Station">Hill Station</option>
                        <option value="Heritage & Temples">Heritage & Temples</option>
                        <option value="Coastal & Beach">Coastal & Beach</option>
                        <option value="Nature & Wildlife">Nature & Wildlife</option>
                        <option value="Cultural & Culinary">Cultural & Culinary</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={destForm.tagline}
                      onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="text-xs">
                    <label className="block font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={destForm.description}
                      onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Photograph URL</label>
                      <input
                        type="url"
                        value={destForm.heroImage}
                        onChange={(e) => setDestForm({ ...destForm, heroImage: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Estimated Cost / Traveler (₹)</label>
                      <input
                        type="number"
                        value={destForm.estimatedCostPerPerson}
                        onChange={(e) => setDestForm({ ...destForm, estimatedCostPerPerson: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={destForm.isHiddenGem}
                        onChange={(e) => setDestForm({ ...destForm, isHiddenGem: e.target.checked })}
                      />
                      <span>Mark as Hidden Gem</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={destForm.isTrending}
                        onChange={(e) => setDestForm({ ...destForm, isTrending: e.target.checked })}
                      />
                      <span>Trending Destination</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                  >
                    Save Destination
                  </button>
                </form>
              )}

              {/* Destinations Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Destination</th>
                      <th className="p-3">District & Category</th>
                      <th className="p-3">Est. Cost</th>
                      <th className="p-3">Packages</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {destinations.map(d => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="p-3 flex items-center gap-2.5">
                          <img src={d.heroImage} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-slate-900 block">{d.name}</span>
                            {d.isHiddenGem && <span className="text-[10px] text-emerald-700 font-bold">Hidden Gem</span>}
                          </div>
                        </td>
                        <td className="p-3">
                          <span>{d.district}</span>
                          <span className="text-[10px] text-slate-400 block">{d.category}</span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">₹{d.estimatedCostPerPerson.toLocaleString('en-IN')}</td>
                        <td className="p-3">{d.availablePackages?.length || 0} Tour Packages</td>
                        <td className="p-3">★ {d.rating} ({d.reviewCount})</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingDest(d);
                              setDestForm(d);
                              setIsAddingDest(false);
                            }}
                            className="text-purple-700 hover:text-purple-900 font-bold mr-3"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold font-serif text-slate-900">Manage Customer Bookings</h4>
                <p className="text-xs text-slate-500">Update status (Confirmed, In Progress, Completed, Cancelled) and inspect customer requirements.</p>
              </div>

              <div className="space-y-3">
                {bookings.map(b => (
                  <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{b.destinationName}</span>
                        <span className="text-[11px] text-slate-500">({b.travelDates.startDate} to {b.travelDates.returnDate})</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong>Customer:</strong> {b.customerName} ({b.customerEmail}, {b.customerPhone})
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {b.travellers.total} Travelers • {b.companionType.toUpperCase()} • Assistance: {b.caretakerGuidePreference.toUpperCase()}
                      </p>
                      {b.specialRequests && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded mt-1 inline-block">
                          Note: {b.specialRequests}
                        </p>
                      )}
                    </div>

                    <div className="md:text-right shrink-0">
                      <p className="text-base font-black text-slate-900">₹{b.pricing.finalPayableAmount.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1.5 mt-2 md:justify-end">
                        <span className="text-[11px] font-bold text-slate-500">Status:</span>
                        <select
                          value={b.bookingStatus}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-bold bg-slate-50 text-slate-800"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="IN_PROGRESS">IN_PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES & ASSISTANCE */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold font-serif text-slate-900">Travel Assistance & Services Catalog</h4>
                <p className="text-xs text-slate-500">Configured rates for Caretakers, Local Certified Guides, Vehicles, and Accommodations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">Caretaker & Guide Tiers</h5>
                  {services.caretakerGuides.map(cg => (
                    <div key={cg.id} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{cg.name}</p>
                        <p className="text-[11px] text-slate-500">{cg.description}</p>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0 ml-2">₹{cg.pricePerDay}/day</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-700">Chauffeur Transportation Options</h5>
                  {services.transportations.map(tr => (
                    <div key={tr.id} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{tr.name}</p>
                        <p className="text-[11px] text-slate-500">{tr.capacity}</p>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0 ml-2">₹{tr.pricePerDay}/day</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FIRST-BOOKING PROMO CONFIG */}
          {activeTab === 'offers' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h4 className="text-base font-bold font-serif text-slate-900">First-Booking Offer Configuration</h4>
                <p className="text-xs text-slate-500">Configure welcome discount rules, validity dates, and redemption caps.</p>
              </div>

              <form onSubmit={handleSavePromo} className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Promotion Status</span>
                    <p className="text-[11px] text-slate-400">Enable or disable welcome discount engine</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={promoForm.active}
                      onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={promoForm.discountPercent}
                      onChange={(e) => setPromoForm({ ...promoForm, discountPercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minimum Booking Spend (₹)</label>
                    <input
                      type="number"
                      value={promoForm.minBookingAmount}
                      onChange={(e) => setPromoForm({ ...promoForm, minBookingAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Maximum Discount Cap (₹)</label>
                    <input
                      type="number"
                      value={promoForm.maxDiscountAmount}
                      onChange={(e) => setPromoForm({ ...promoForm, maxDiscountAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={promoForm.startDate}
                      onChange={(e) => setPromoForm({ ...promoForm, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={promoForm.endDate}
                      onChange={(e) => setPromoForm({ ...promoForm, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {promoSaveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Promotion rules updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs"
                >
                  Save Promotion Configuration
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold font-serif text-slate-900">Moderate Customer Reviews</h4>
                <p className="text-xs text-slate-500">Review submitted stories and remove spam or abusive content under moderation guidelines.</p>
              </div>

              <div className="space-y-3">
                {reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                        <span className="text-xs font-bold text-amber-600">★ {rev.rating}/5</span>
                        <span className="text-[11px] text-slate-400">({rev.travelDate})</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-800">"{rev.title}"</h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{rev.content}</p>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
