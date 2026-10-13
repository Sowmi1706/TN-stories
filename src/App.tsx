import React, { useState, useEffect } from 'react';
import { 
  Compass, MapPin, Sparkles, Filter, Search, Package, Star, 
  ArrowRight, ShieldCheck, Heart, Clock, CheckCircle, Tag, Layers
} from 'lucide-react';
import { 
  Destination, PromotionConfig, ServiceCatalog, Booking, 
  Review, User, TourismCategory 
} from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { PromoBanner } from './components/PromoBanner';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailsModal } from './components/DestinationDetailsModal';
import { BookingWizard } from './components/BookingWizard';
import { ReviewsSection } from './components/ReviewsSection';
import { ReviewModal } from './components/ReviewModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';

// Default Persona Users
const DEFAULT_USERS: User[] = [
  {
    id: "usr-arun",
    name: "Arun Kumar",
    email: "arun.kumar@example.com",
    phone: "+91 98410 99887",
    role: "traveler",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: false,
    createdAt: "2026-04-01T08:00:00Z"
  },
  {
    id: "usr-priya",
    name: "Priya Sundaram",
    email: "priya.s@example.com",
    phone: "+91 98401 23456",
    role: "traveler",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: true,
    createdAt: "2026-02-15T09:30:00Z"
  },
  {
    id: "usr-admin",
    name: "Sowmiya (TN Stories Administrator)",
    email: "admin@tnstories.in",
    phone: "+91 94440 11223",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    hasCompletedBookings: false,
    createdAt: "2026-01-01T00:00:00Z"
  }
];

export default function App() {
  // App Data State
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [promotion, setPromotion] = useState<PromotionConfig | null>(null);
  const [services, setServices] = useState<ServiceCatalog>({
    accommodations: [],
    transportations: [],
    caretakerGuides: [],
    addOns: []
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // SEPARATE CUSTOMER AND ADMIN AUTH SESSIONS
  const [currentCustomer, setCurrentCustomer] = useState<User | null>(() => {
    const saved = localStorage.getItem('tn_stories_customer');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return DEFAULT_USERS[0]; // Arun Kumar as default traveler demo
  });

  const [currentAdmin, setCurrentAdmin] = useState<User | null>(() => {
    const saved = localStorage.getItem('tn_stories_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return null; // Not logged in as admin by default
  });

  const [promoEligible, setPromoEligible] = useState<boolean>(true);

  // Separate Login Modals State
  const [isCustomerLoginOpen, setIsCustomerLoginOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Filtering & Discovery State
  const [selectedCategory, setSelectedCategory] = useState<TourismCategory>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('explore'); // 'explore' | 'packages' | 'hidden' | 'reviews'
  const [selectedDestinationForDetails, setSelectedDestinationForDetails] = useState<Destination | null>(null);
  const [isBookingWizardOpen, setIsBookingWizardOpen] = useState<boolean>(false);
  const [preselectedBookingDest, setPreselectedBookingDest] = useState<Destination | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalTargetDest, setReviewModalTargetDest] = useState<Destination | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial data
  const loadAppData = async () => {
    setIsLoading(true);
    try {
      const [destList, promoData, servData, bookList, revList] = await Promise.all([
        api.getDestinations(),
        api.getPromotionConfig(),
        api.getServices(),
        api.getBookings(),
        api.getReviews()
      ]);

      setDestinations(destList);
      setPromotion(promoData);
      setServices(servData);
      setBookings(bookList);
      setReviews(revList);

      // Check customer eligibility
      if (currentCustomer) {
        checkUserPromoEligibility(currentCustomer, bookList);
      }
    } catch (err) {
      console.error('Failed to load application data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  // Update eligibility whenever customer changes or bookings change
  const checkUserPromoEligibility = (user: User, currentBookings: Booking[]) => {
    const hasPriorBooking = currentBookings.some(
      b => (b.customerId === user.id || b.customerEmail?.toLowerCase() === user.email.toLowerCase()) &&
           b.bookingStatus !== 'CANCELLED'
    );
    setPromoEligible(!hasPriorBooking);
  };

  const handleCustomerLoginSuccess = (user: User) => {
    setCurrentCustomer(user);
    localStorage.setItem('tn_stories_customer', JSON.stringify(user));
    checkUserPromoEligibility(user, bookings);
    showToast(`Welcome, ${user.name}! Traveler session active.`);
  };

  const handleCustomerLogout = () => {
    setCurrentCustomer(null);
    localStorage.removeItem('tn_stories_customer');
    showToast('Signed out of customer account.');
  };

  const handleAdminLoginSuccess = (admin: User) => {
    setCurrentAdmin(admin);
    localStorage.setItem('tn_stories_admin', JSON.stringify(admin));
    setIsAdminDashboardOpen(true);
    showToast(`Administrative access granted: ${admin.name}`);
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('tn_stories_admin');
    setIsAdminDashboardOpen(false);
    showToast('Logged out of Administrator Portal.');
  };

  // Open Details Modal and record recently viewed
  const handleOpenDetails = (dest: Destination) => {
    setSelectedDestinationForDetails(dest);
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== dest.id);
      return [dest.id, ...filtered].slice(0, 4);
    });
  };

  // Open Booking Wizard
  const handleOpenBooking = (dest?: Destination) => {
    setPreselectedBookingDest(dest || destinations[0] || null);
    setIsBookingWizardOpen(true);
  };

  // Booking Success
  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    if (currentCustomer) {
      checkUserPromoEligibility(currentCustomer, [newBooking, ...bookings]);
    }
    showToast(`Trip booked successfully! Booking Ref: ${newBooking.id}`);
  };

  // Review Submitted
  const handleReviewSubmitted = (newOrUpdatedReview: Review) => {
    setReviews(prev => {
      const exists = prev.some(r => r.id === newOrUpdatedReview.id);
      if (exists) {
        return prev.map(r => r.id === newOrUpdatedReview.id ? newOrUpdatedReview : r);
      }
      return [newOrUpdatedReview, ...prev];
    });
    showToast("Thank you! Your travel experience has been recorded.");
    loadAppData(); // Refresh destination ratings
  };

  // Review Deleted
  const handleDeleteReview = async (reviewId: string) => {
    try {
      await api.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      showToast("Review deleted successfully.");
      loadAppData();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  // Filtered Destinations
  const filteredDestinations = destinations.filter(dest => {
    // Tab filter
    if (activeTab === 'hidden' && !dest.isHiddenGem) return false;
    // Category
    if (selectedCategory !== 'All' && dest.category !== selectedCategory) return false;
    // District
    if (selectedDistrict !== 'All' && dest.district !== selectedDistrict) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dest.name.toLowerCase().includes(q);
      const matchDist = dest.district.toLowerCase().includes(q);
      const matchDesc = dest.description.toLowerCase().includes(q);
      const matchAttr = dest.attractions.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchDist && !matchDesc && !matchAttr) return false;
    }
    return true;
  });

  // Unique Districts for Dropdown Filter
  const availableDistricts = Array.from(new Set(destinations.map(d => d.district))).sort();

  // Recently viewed destinations
  const recentlyViewedDestinations = destinations.filter(d => recentlyViewedIds.includes(d.id));

  // Popular and Trending slices
  const popularDestinations = destinations.filter(d => d.isPopular);
  const hiddenDestinations = destinations.filter(d => d.isHiddenGem);

  const categories: TourismCategory[] = [
    'All',
    'Hill Station',
    'Heritage & Temples',
    'Coastal & Beach',
    'Nature & Wildlife',
    'Cultural & Culinary'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/20 text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentCustomer={currentCustomer}
        currentAdmin={currentAdmin}
        onOpenCustomerLogin={() => setIsCustomerLoginOpen(true)}
        onCustomerLogout={handleCustomerLogout}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onAdminLogout={handleAdminLogout}
        onOpenAdminDashboard={() => {
          if (currentAdmin) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onOpenBooking={() => handleOpenBooking()}
        onOpenProfile={() => {
          if (currentCustomer) {
            setIsProfileModalOpen(true);
          } else {
            setIsCustomerLoginOpen(true);
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        promoEligible={promoEligible}
      />

      <main className="flex-1">
        {/* Hero Slider with smooth crossfade and quick discovery search */}
        <HeroSlider
          destinations={destinations}
          onExploreClick={() => {
            setActiveTab('explore');
            const el = document.getElementById('destinations-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onBookClick={(destId) => {
            const target = destinations.find(d => d.id === destId);
            handleOpenBooking(target);
          }}
          onSelectDestination={handleOpenDetails}
        />

        {/* First-Time Customer Promotion Banner */}
        <PromoBanner
          promo={promotion}
          isEligible={promoEligible}
          onClaim={() => handleOpenBooking()}
        />

        {/* Main Content Area based on Tab */}
        {activeTab === 'reviews' ? (
          /* Dedicated Traveler Stories Tab */
          <ReviewsSection
            reviews={reviews}
            destinations={destinations}
            currentUser={currentCustomer || DEFAULT_USERS[0]}
            onEditReview={(rev) => {
              setEditingReview(rev);
              setIsReviewModalOpen(true);
            }}
            onDeleteReview={handleDeleteReview}
            onWriteReviewClick={() => {
              setEditingReview(null);
              setReviewModalTargetDest(null);
              setIsReviewModalOpen(true);
            }}
          />
        ) : activeTab === 'packages' ? (
          /* Recommended Tour Packages Showcase Tab */
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full">
                All-Inclusive Itineraries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 mt-2">
                Curated Tamil Nadu Tour Packages
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Handcrafted multi-day circuits featuring certified private transport, boutique heritage stays, and guided cultural storytelling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.flatMap(d => (d.availablePackages || []).map(pkg => ({ ...pkg, dest: d }))).map(pkg => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-16/9 rounded-2xl overflow-hidden mb-4 relative">
                      <img src={pkg.dest.heroImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                        📍 {pkg.dest.name}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {pkg.duration}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">{pkg.name}</h3>
                    <p className="text-xs text-slate-600 mb-3">{pkg.highlights.join(' • ')}</p>

                    <div className="space-y-1.5 mb-4">
                      {pkg.inclusions.map((inc, i) => (
                        <p key={i} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{inc}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Tariff</span>
                      <p className="text-lg font-black text-slate-900">₹{pkg.pricePerPerson.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/person</span></p>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(pkg.dest)}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <span>Book Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          /* Standard Discovery & Explorer Layout */
          <div id="destinations-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black font-serif text-slate-900">
                    Explore Destinations of Tamil Nadu
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filter by district, tourism category, or search attractions
                  </p>
                </div>

                {/* District Filter & Search Field */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[160px]">
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="All">All Districts (38)</option>
                      {availableDistricts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative min-w-[220px]">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search places or foods..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                    />
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/20'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-amber-50 hover:text-amber-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Destinations Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">
                    Showing {filteredDestinations.length} Destination{filteredDestinations.length !== 1 ? 's' : ''}
                  </span>
                  {selectedCategory !== 'All' && (
                    <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                      {selectedCategory}
                    </span>
                  )}
                </div>

                {(selectedCategory !== 'All' || selectedDistrict !== 'All' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedDistrict('All');
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-amber-700 hover:underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {filteredDestinations.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                  <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-800">No destinations matched your criteria</h4>
                  <p className="text-xs text-slate-500 mt-1">Try clearing your filters or searching for popular places like Ooty, Madurai, or Kodaikanal.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDestinations.map(dest => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      onViewDetails={handleOpenDetails}
                      onBookNow={handleOpenBooking}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Hidden Tourist Spots Section */}
            <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    Untouched Wilderness & Heritage
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif mt-2 text-white">
                    Hidden Gems of Tamil Nadu
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
                    Escape the tourist crowds and explore pristine shola forests, ancient Chettinad merchant palaces, and thunderous river canyons.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('hidden')}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 self-start md:self-auto transition-all shadow-md shadow-emerald-900/40"
                >
                  <span>View All Hidden Spots</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {hiddenDestinations.slice(0, 3).map(dest => (
                  <div
                    key={dest.id}
                    onClick={() => handleOpenDetails(dest)}
                    className="group bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <div className="aspect-16/10 rounded-xl overflow-hidden mb-3">
                      <img src={dest.heroImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase">{dest.district}</span>
                    <h4 className="text-base font-bold font-serif text-white mt-0.5">{dest.name}</h4>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1">{dest.description}</p>
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-300">₹{dest.estimatedCostPerPerson.toLocaleString('en-IN')}/person</span>
                      <span className="text-[11px] font-bold text-white group-hover:translate-x-1 transition-transform">Explore →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed Destinations if any */}
            {recentlyViewedDestinations.length > 0 && (
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Recently Viewed Places</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyViewedDestinations.map(dest => (
                    <div
                      key={dest.id}
                      onClick={() => handleOpenDetails(dest)}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 cursor-pointer transition-all flex items-center gap-3"
                    >
                      <img src={dest.heroImage} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{dest.name}</h4>
                        <p className="text-[10px] text-slate-500">{dest.district}</p>
                        <span className="text-xs font-bold text-amber-800">₹{dest.estimatedCostPerPerson.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traveler Stories Preview Strip */}
            <ReviewsSection
              reviews={reviews.slice(0, 3)}
              destinations={destinations}
              currentUser={currentCustomer || DEFAULT_USERS[0]}
              onEditReview={(rev) => {
                setEditingReview(rev);
                setIsReviewModalOpen(true);
              }}
              onDeleteReview={handleDeleteReview}
              onWriteReviewClick={() => {
                setEditingReview(null);
                setReviewModalTargetDest(null);
                setIsReviewModalOpen(true);
              }}
            />
          </div>
        )}
      </main>

      {/* Destination Details Modal */}
      {selectedDestinationForDetails && (
        <DestinationDetailsModal
          destination={selectedDestinationForDetails}
          onClose={() => setSelectedDestinationForDetails(null)}
          onBookNow={handleOpenBooking}
          reviews={reviews}
          onWriteReview={(dest) => {
            setSelectedDestinationForDetails(null);
            setReviewModalTargetDest(dest);
            setEditingReview(null);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* Booking Wizard Modal */}
      {isBookingWizardOpen && (
        <BookingWizard
          destinations={destinations}
          services={services}
          promoConfig={promotion}
          currentUser={currentCustomer || DEFAULT_USERS[0]}
          preselectedDestination={preselectedBookingDest}
          onClose={() => setIsBookingWizardOpen(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          destination={reviewModalTargetDest}
          destinations={destinations}
          userBookings={bookings.filter(b => b.customerId === (currentCustomer?.id || 'usr-arun'))}
          currentUser={currentCustomer || DEFAULT_USERS[0]}
          existingReview={editingReview}
          onClose={() => {
            setIsReviewModalOpen(false);
            setEditingReview(null);
          }}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      {/* User Profile Modal */}
      {isProfileModalOpen && (
        <UserProfileModal
          currentUser={currentCustomer || DEFAULT_USERS[0]}
          bookings={bookings}
          reviews={reviews}
          destinations={destinations}
          promoEligible={promoEligible}
          onClose={() => setIsProfileModalOpen(false)}
          onWriteReviewForBooking={(b) => {
            const dest = destinations.find(d => d.id === b.destinationId);
            setReviewModalTargetDest(dest || null);
            setEditingReview(null);
            setIsProfileModalOpen(false);
            setIsReviewModalOpen(true);
          }}
          onEditReview={(rev) => {
            setEditingReview(rev);
            setIsProfileModalOpen(false);
            setIsReviewModalOpen(true);
          }}
          onDeleteReview={handleDeleteReview}
        />
      )}

      {/* Admin Dashboard */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          destinations={destinations}
          bookings={bookings}
          reviews={reviews}
          promotion={promotion || {
            code: 'FIRST10',
            discountPercent: 10,
            minBookingAmount: 3000,
            maxDiscountAmount: 2500,
            active: true,
            startDate: '2026-01-01',
            endDate: '2026-12-31',
            title: 'Welcome 10%',
            description: 'First booking discount'
          }}
          services={services}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshData={loadAppData}
        />
      )}

      {/* Dedicated Customer / Traveler Login Modal */}
      {isCustomerLoginOpen && (
        <CustomerAuthModal
          onClose={() => setIsCustomerLoginOpen(false)}
          onLoginSuccess={handleCustomerLoginSuccess}
        />
      )}

      {/* Dedicated Administrator Gateway Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginOpen(false)}
          onAdminLoginSuccess={handleAdminLoginSuccess}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat as TourismCategory);
          setActiveTab('explore');
        }}
        onSelectDestination={(id) => {
          const dest = destinations.find(d => d.id === id);
          if (dest) handleOpenDetails(dest);
        }}
        onOpenCustomerLogin={() => setIsCustomerLoginOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />
    </div>
  );
}
