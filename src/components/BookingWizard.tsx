import React, { useState, useEffect } from 'react';
import { 
  X, Check, ChevronLeft, ChevronRight, MapPin, Calendar, Users, 
  User, ShieldCheck, Heart, Sparkles, CheckCircle, Tag, AlertCircle, 
  Compass, ArrowRight, Printer, Clock, HelpCircle, Info, Car, Home, Camera
} from 'lucide-react';
import { 
  Destination, ServiceCatalog, PromotionConfig, User as AppUser, 
  Booking, CompanionType, ArrangementType, AssistanceType 
} from '../types';
import { api } from '../services/api';

interface BookingWizardProps {
  destinations: Destination[];
  services: ServiceCatalog;
  promoConfig: PromotionConfig | null;
  currentUser: AppUser;
  preselectedDestination?: Destination | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  destinations,
  services,
  promoConfig,
  currentUser,
  preselectedDestination,
  onClose,
  onBookingSuccess
}) => {
  // Wizard Step (1 to 9)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedDestId, setSelectedDestId] = useState<string>(
    preselectedDestination?.id || destinations[0]?.id || 'ooty'
  );
  const [destSearch, setDestSearch] = useState<string>('');

  // Step 2: Travel Dates & Counts
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultReturn = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [returnDate, setReturnDate] = useState<string>(defaultReturn);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Step 3: Companion Type
  const [companion, setCompanion] = useState<CompanionType>('family');
  const [selectedGroupDeparture, setSelectedGroupDeparture] = useState<string | null>(null);

  // Step 4: Arrangement
  const [arrangement, setArrangement] = useState<ArrangementType>('curated');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  
  // Custom Services for self-planned
  const [customAccommodationId, setCustomAccommodationId] = useState<string>(
    services.accommodations[0]?.id || ''
  );
  const [customTransportId, setCustomTransportId] = useState<string>(
    services.transportations[0]?.id || ''
  );

  // Step 5: Caretaker & Local Guide
  const [assistance, setAssistance] = useState<AssistanceType>('none');

  // Step 6: Add-ons
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Step 7: Promo verification state
  const [promoCheckResult, setPromoCheckResult] = useState<{
    eligible: boolean;
    reason: string;
    discountPercent: number;
    discountAmount: number;
    maxCapApplied?: boolean;
    promoCode?: string;
  } | null>(null);
  const [isCheckingPromo, setIsCheckingPromo] = useState<boolean>(false);

  // Step 9: Final submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedBooking, setSubmittedBooking] = useState<Booking | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Customer Contact Inputs
  const [contactName, setContactName] = useState<string>(currentUser.name);
  const [contactEmail, setContactEmail] = useState<string>(currentUser.email);
  const [contactPhone, setContactPhone] = useState<string>(currentUser.phone || '+91 98400 12345');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Selected Destination Object
  const currentDestination = destinations.find(d => d.id === selectedDestId) || destinations[0];

  // Set default package when destination changes
  useEffect(() => {
    if (currentDestination?.availablePackages?.length > 0) {
      setSelectedPackageId(currentDestination.availablePackages[0].id);
    }
  }, [selectedDestId, currentDestination]);

  // Compute Trip Duration in Days
  const startMs = new Date(startDate).getTime();
  const returnMs = new Date(returnDate).getTime();
  const durationDays = Math.max(1, Math.round((returnMs - startMs) / (1000 * 60 * 60 * 24)) || 1);

  // Calculate pricing breakdown
  const totalTravellers = adults + children;

  let basePrice = 0;
  if (arrangement === 'curated') {
    const pkg = currentDestination?.availablePackages?.find(p => p.id === selectedPackageId);
    if (pkg) {
      basePrice = pkg.pricePerPerson * adults + Math.round(pkg.pricePerPerson * 0.6) * children;
    } else {
      basePrice = (currentDestination?.estimatedCostPerPerson || 5000) * adults;
    }
  } else {
    // Self-planned base price
    basePrice = (currentDestination?.estimatedCostPerPerson || 4000) * adults + Math.round((currentDestination?.estimatedCostPerPerson || 4000) * 0.5) * children;
  }

  // Assistance Cost
  let assistCost = 0;
  if (assistance === 'caretaker') assistCost = 1200 * durationDays;
  else if (assistance === 'guide') assistCost = 1500 * durationDays;
  else if (assistance === 'both') assistCost = 2300 * durationDays;

  // Custom accommodation & transport
  let customServicesCost = 0;
  const chosenAcc = services.accommodations.find(a => a.id === customAccommodationId);
  const chosenTr = services.transportations.find(t => t.id === customTransportId);

  if (arrangement === 'self_planned') {
    if (chosenAcc) customServicesCost += chosenAcc.pricePerNight * Math.max(1, durationDays - 1);
    if (chosenTr) customServicesCost += chosenTr.pricePerDay * durationDays;
  }

  // Add-ons cost
  let addOnsCost = 0;
  const chosenAddOns = services.addOns.filter(a => selectedAddOnIds.includes(a.id));
  chosenAddOns.forEach(a => {
    addOnsCost += a.price * totalTravellers;
  });

  const subtotal = basePrice + assistCost + customServicesCost + addOnsCost;

  // Live Promotion Check via Backend when reaching Step 7 or subtotal changes
  useEffect(() => {
    if (currentStep >= 7 && subtotal > 0) {
      setIsCheckingPromo(true);
      api.checkPromotionEligibility({
        customerEmail: contactEmail,
        customerId: currentUser.id,
        amount: subtotal
      })
      .then(res => {
        setPromoCheckResult(res);
      })
      .catch(err => {
        console.warn('Backend promo check error', err);
        // Fallback local calculation
        if (promoConfig?.active && subtotal >= promoConfig.minBookingAmount) {
          const discount = Math.min(Math.round((subtotal * promoConfig.discountPercent) / 100), promoConfig.maxDiscountAmount);
          setPromoCheckResult({
            eligible: true,
            reason: 'Eligible for 10% First Booking Offer!',
            discountPercent: promoConfig.discountPercent,
            discountAmount: discount,
            promoCode: promoConfig.code
          });
        }
      })
      .finally(() => setIsCheckingPromo(false));
    }
  }, [currentStep, subtotal, contactEmail, currentUser.id]);

  const discountAmount = promoCheckResult?.eligible ? promoCheckResult.discountAmount : 0;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(afterDiscount * 0.05); // 5% GST
  const finalPayable = afterDiscount + taxAmount;

  // Step Validation Handlers
  const canProceed = () => {
    if (currentStep === 1) return Boolean(selectedDestId);
    if (currentStep === 2) {
      return Boolean(startDate && returnDate && adults >= 1 && returnDate >= startDate);
    }
    if (currentStep === 3) {
      if (companion === 'meet_travellers') {
        const hasGroups = currentDestination?.availablePackages?.some(p => p.isGroupAvailable);
        return Boolean(hasGroups);
      }
      return Boolean(companion);
    }
    if (currentStep === 4) {
      if (arrangement === 'curated') return Boolean(selectedPackageId);
      return Boolean(customAccommodationId && customTransportId);
    }
    if (currentStep === 5) return Boolean(assistance);
    if (currentStep === 8) {
      return Boolean(contactName.trim() && contactEmail.trim() && contactPhone.trim());
    }
    return true;
  };

  // Submit Booking to Backend
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const selectedPkgObj = currentDestination?.availablePackages?.find(p => p.id === selectedPackageId);

      const payload = {
        customerId: currentUser.id,
        customerName: contactName,
        customerEmail: contactEmail,
        customerPhone: contactPhone,
        destinationId: currentDestination.id,
        destinationName: currentDestination.name,
        travelDates: {
          startDate,
          returnDate,
          durationDays
        },
        travellers: {
          adults,
          children,
          total: totalTravellers
        },
        companionType: companion,
        groupDepartureId: companion === 'meet_travellers' ? (selectedGroupDeparture || 'grp-standard') : null,
        arrangementPreference: arrangement,
        selectedPackageId: arrangement === 'curated' ? selectedPackageId : null,
        selectedPackageName: arrangement === 'curated' ? (selectedPkgObj?.name || 'Custom Package') : 'Self-Arranged Custom Itinerary',
        caretakerGuidePreference: assistance,
        caretakerGuideCost: assistCost,
        selectedServices: {
          accommodation: arrangement === 'self_planned' && chosenAcc ? {
            name: chosenAcc.name,
            pricePerNight: chosenAcc.pricePerNight,
            nights: Math.max(1, durationDays - 1),
            total: chosenAcc.pricePerNight * Math.max(1, durationDays - 1)
          } : undefined,
          transportation: arrangement === 'self_planned' && chosenTr ? {
            name: chosenTr.name,
            pricePerDay: chosenTr.pricePerDay,
            days: durationDays,
            total: chosenTr.pricePerDay * durationDays
          } : undefined,
          sightseeingActivities: chosenAddOns.map(a => ({
            name: a.name,
            pricePerPerson: a.price,
            total: a.price * totalTravellers
          }))
        },
        specialRequests: specialRequests.trim(),
        paymentMethod: 'UPI_OR_CARD_ON_ARRIVAL'
      };

      const result = await api.createBooking(payload);
      setSubmittedBooking(result);
      onBookingSuccess(result);
      setCurrentStep(9); // Move to Step 9 confirmation view
    } catch (err: any) {
      console.error('Booking failed', err);
      setSubmissionError(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    "Select Destination",
    "Travel Details",
    "Travel Companion",
    "Travel Arrangement",
    "Caretaker & Guide",
    "Add-on Services",
    "First Booking Offer",
    "Booking Summary",
    "Confirmed Booking"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-amber-50/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                Step {currentStep} of 9
              </span>
              <span className="text-xs text-slate-500 font-medium">TN Stories Booking Wizard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 mt-1">
              {stepsList[currentStep - 1]}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Wizard"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-gradient-to-r from-amber-600 to-amber-500 h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 9) * 100}%` }}
          />
        </div>

        {/* Step Content Body */}
        <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
          {/* STEP 1: SELECT DESTINATION */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-600">
                  Choose your dream destination in Tamil Nadu from our verified tourism database:
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    value={destSearch}
                    onChange={(e) => setDestSearch(e.target.value)}
                    placeholder="Search by destination name, district or attraction..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {destinations
                  .filter(d => 
                    d.name.toLowerCase().includes(destSearch.toLowerCase()) ||
                    d.district.toLowerCase().includes(destSearch.toLowerCase()) ||
                    d.category.toLowerCase().includes(destSearch.toLowerCase())
                  )
                  .map(dest => {
                    const isSelected = selectedDestId === dest.id;
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestId(dest.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                            : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={dest.heroImage}
                            alt=""
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                            onError={(e) => {
                              if (dest.fallbackImage) (e.target as HTMLImageElement).src = dest.fallbackImage;
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">{dest.name}</h4>
                            </div>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                              {dest.district}
                            </p>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 mt-1 inline-block">
                              {dest.category}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">₹{dest.estimatedCostPerPerson.toLocaleString('en-IN')}/person</span>
                          {isSelected ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
                              <CheckCircle className="w-4 h-4 fill-amber-600 text-white" /> Selected
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">Click to choose</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* STEP 2: TRAVEL DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-3">
                <img src={currentDestination.heroImage} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-950">{currentDestination.name}</h4>
                  <p className="text-xs text-amber-800">Ideal duration: {currentDestination.verifiedInfo.idealDuration} • Best Season: {currentDestination.verifiedInfo.bestSeason.split('(')[0]}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travel Start Date *
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (returnDate < e.target.value) setReturnDate(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    min={startDate}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <p className="text-[11px] text-amber-800 mt-1 font-medium">
                    Calculated duration: {durationDays} Day{durationDays > 1 ? 's' : ''} ({durationDays > 1 ? durationDays - 1 : 1} Night{durationDays > 2 ? 's' : ''})
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Adults (Age 12+)</p>
                      <p className="text-xs text-slate-400">Primary travellers</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        disabled={adults <= 1}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold text-slate-700"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-4 text-center">{adults}</span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-800">Children (Age 3-11)</p>
                      <p className="text-xs text-slate-400">Discounted child tariff (40% OFF)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        disabled={children <= 0}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 font-bold text-slate-700"
                      >
                        -
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-4 text-center">{children}</span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRAVEL COMPANION */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
                  Who are you travelling with?
                </h3>
                <p className="text-xs text-slate-500">
                  This helps us tailor your vehicle size, room allocation, and pace.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { id: 'solo', title: 'Solo Travel', desc: 'Travelling alone on a personal journey of discovery.', icon: User },
                  { id: 'family', title: 'Family Trip', desc: 'Travelling with family, parents or children.', icon: Heart },
                  { id: 'friends', title: 'Friends Trip', desc: 'Exploring with friends and adventure companions.', icon: Users },
                  { id: 'group', title: 'Group Trip', desc: 'Travelling with an organized large community group.', icon: Users },
                  { id: 'meet_travellers', title: 'Meet New Travellers', desc: 'Join a suitable group experience & share the joy.', icon: Compass }
                ].map(opt => {
                  const isSelected = companion === opt.id;
                  const Icon = opt.icon;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setCompanion(opt.id as CompanionType)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-amber-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{opt.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{opt.desc}</p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-end">
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-700">
                            <CheckCircle className="w-4 h-4 fill-amber-600 text-white" /> Selected
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">Select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verified Group Availability Handling for 'Meet New Travellers' */}
              {companion === 'meet_travellers' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-700" />
                    Available Verified Group Departures for {currentDestination.name}
                  </h4>
                  {currentDestination.availablePackages?.some(p => p.isGroupAvailable) ? (
                    <div className="space-y-2 mt-2">
                      {currentDestination.availablePackages
                        .filter(p => p.isGroupAvailable)
                        .map(pkg => (
                          <div 
                            key={pkg.id} 
                            onClick={() => setSelectedGroupDeparture(pkg.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                              selectedGroupDeparture === pkg.id || !selectedGroupDeparture
                                ? 'bg-emerald-50 border-emerald-400'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-emerald-950">{pkg.name} — Weekend Fixed Departure</p>
                              <p className="text-[11px] text-emerald-700">Small group (max 10 travelers) • Verified Tour Captain included</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-800">₹{pkg.pricePerPerson.toLocaleString('en-IN')}/seat</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
                      <p className="text-xs text-amber-900 font-semibold">
                        No verified open group departures are currently scheduled for {currentDestination.name} on selected dates.
                      </p>
                      <p className="text-[11px] text-amber-700 mt-1">
                        Please choose Solo, Family, or Friends travel to proceed with guaranteed private arrangements.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: TRAVEL ARRANGEMENT */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
                  How would you like to plan your trip?
                </h3>
                <p className="text-xs text-slate-500">
                  Choose between our all-inclusive curated packages or customize individual services.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setArrangement('curated')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    arrangement === 'curated'
                      ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">Option A: Plan My Trip for Me</span>
                    {arrangement === 'curated' && <CheckCircle className="w-5 h-5 fill-amber-600 text-white" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Curated all-inclusive package with handpicked accommodations, private transport, verified sightseeing itinerary, and breakfast.
                  </p>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                    Recommended for effortless travel
                  </span>
                </div>

                <div
                  onClick={() => setArrangement('self_planned')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    arrangement === 'self_planned'
                      ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900">Option B: I'll Plan My Own Trip</span>
                    {arrangement === 'self_planned' && <CheckCircle className="w-5 h-5 fill-amber-600 text-white" />}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Choose individual services separately. Select your preferred accommodation tier, chauffeur-driven vehicle, and custom activities.
                  </p>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    Flexible custom selection
                  </span>
                </div>
              </div>

              {/* Sub-view for Curated Packages */}
              {arrangement === 'curated' && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Curated Tour Package
                  </h4>
                  {currentDestination.availablePackages?.map(pkg => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/80 shadow-xs ring-1 ring-amber-500'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900">{pkg.name}</span>
                            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{pkg.duration}</span>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{pkg.highlights.join(' • ')}</p>
                          <div className="flex flex-wrap gap-1">
                            {pkg.inclusions.map((inc, i) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">✓ {inc}</span>
                            ))}
                          </div>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <p className="text-base font-black text-slate-900">₹{pkg.pricePerPerson.toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-slate-400">per adult</p>
                          {isSelected && <span className="text-xs font-bold text-amber-700 mt-1 block">✓ Selected</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Sub-view for Self-Planned Individual Services */}
              {arrangement === 'self_planned' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Home className="w-4 h-4 text-amber-700" />
                      Select Accommodation Tier
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {services.accommodations.map(acc => (
                        <div
                          key={acc.id}
                          onClick={() => setCustomAccommodationId(acc.id)}
                          className={`p-3 rounded-xl border cursor-pointer ${
                            customAccommodationId === acc.id ? 'border-amber-600 bg-amber-50/80' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{acc.name}</span>
                            <span className="text-xs font-bold text-slate-800">₹{acc.pricePerNight}/night</span>
                          </div>
                          <span className="text-[10px] text-amber-700 mt-1 block">{acc.badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-amber-700" />
                      Select Private Transportation
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {services.transportations.map(tr => (
                        <div
                          key={tr.id}
                          onClick={() => setCustomTransportId(tr.id)}
                          className={`p-3 rounded-xl border cursor-pointer ${
                            customTransportId === tr.id ? 'border-amber-600 bg-amber-50/80' : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{tr.name}</span>
                            <span className="text-xs font-bold text-slate-800">₹{tr.pricePerDay}/day</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5 block">{tr.capacity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CARETAKER AND LOCAL GUIDE */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
                  Would you like someone to assist you during your trip?
                </h3>
                <p className="text-xs text-slate-500">
                  Optional personalized assistance to make your Tamil Nadu journey comfortable, informative, and completely stress-free.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.caretakerGuides.map(cg => {
                  const isSelected = assistance === cg.type;
                  return (
                    <div
                      key={cg.id}
                      onClick={() => setAssistance(cg.type)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/80 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{cg.name}</h4>
                          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                            {cg.pricePerDay === 0 ? 'Free' : `₹${cg.pricePerDay}/day`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{cg.description}</p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        {cg.pricePerDay > 0 ? (
                          <span className="text-[11px] text-slate-500">Total for {durationDays} days: ₹{(cg.pricePerDay * durationDays).toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Independent travel</span>
                        )}
                        {isSelected ? (
                          <span className="flex items-center gap-1 font-bold text-amber-700">
                            <CheckCircle className="w-4 h-4 fill-amber-600 text-white" /> Selected
                          </span>
                        ) : (
                          <span className="text-slate-400">Select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: PACKAGES AND ADD-ON SERVICES */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
                  Add-On Experiences & Protection
                </h3>
                <p className="text-xs text-slate-500">
                  Select authentic local cultural activities and safety protection (all prices per person):
                </p>
              </div>

              <div className="space-y-3">
                {services.addOns.map(add => {
                  const isChecked = selectedAddOnIds.includes(add.id);
                  return (
                    <div
                      key={add.id}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedAddOnIds(selectedAddOnIds.filter(id => id !== add.id));
                        } else {
                          setSelectedAddOnIds([...selectedAddOnIds, add.id]);
                        }
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isChecked
                          ? 'border-amber-600 bg-amber-50/80 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 ${
                          isChecked ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{add.name}</h4>
                          <p className="text-xs text-slate-600 leading-snug mt-0.5">{add.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900">₹{add.price}</span>
                        <span className="text-[10px] text-slate-500 block">per person</span>
                        <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                          Total: ₹{(add.price * totalTravellers).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: FIRST-BOOKING DISCOUNT */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
                    Welcome Promotion Privilege
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black font-serif mb-1">
                  First-Time Booking 10% Discount
                </h3>
                <p className="text-xs sm:text-sm text-amber-100">
                  We check your account booking records independently on the server to apply your welcome savings.
                </p>

                <div className="mt-6 p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Customer Account:</span>
                    <strong className="text-white">{contactEmail}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Trip Subtotal:</span>
                    <strong className="text-white">₹{subtotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Eligibility Status:</span>
                    {isCheckingPromo ? (
                      <span className="text-amber-300 animate-pulse font-bold">Verifying with server...</span>
                    ) : promoCheckResult?.eligible ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Eligible (10% Applied)
                      </span>
                    ) : (
                      <span className="text-rose-300 font-bold">
                        {promoCheckResult?.reason || 'Not Eligible'}
                      </span>
                    )}
                  </div>

                  {promoCheckResult?.eligible && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                      <span className="text-amber-200 font-bold">You Save Today:</span>
                      <span className="text-lg font-black text-amber-300">
                        -₹{promoCheckResult.discountAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p><strong>Offer Terms & Transparency:</strong></p>
                <p>• Applies once per new customer account on initial confirmed booking.</p>
                <p>• Maximum savings cap: ₹{promoConfig?.maxDiscountAmount.toLocaleString('en-IN') || '2,500'}.</p>
                <p>• Minimum booking spend requirement: ₹{promoConfig?.minBookingAmount.toLocaleString('en-IN') || '3,000'}.</p>
              </div>
            </div>
          )}

          {/* STEP 8: BOOKING SUMMARY */}
          {currentStep === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-900 mb-1">
                  Review Your Trip Itinerary & Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Please verify all travel parameters before final confirmation.
                </p>
              </div>

              {/* Itemized Breakdown Card */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{currentDestination.name}</h4>
                    <p className="text-xs text-slate-500">{currentDestination.district} • {startDate} to {returnDate} ({durationDays} Days)</p>
                  </div>
                  <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full capitalize">
                    {companion}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <p><strong>Travellers:</strong> {adults} Adults{children > 0 ? `, ${children} Children` : ''}</p>
                  <p><strong>Arrangement:</strong> {arrangement === 'curated' ? 'Curated Tour Package' : 'Self-Arranged'}</p>
                  <p><strong>Assistance:</strong> {assistance === 'none' ? 'Self-Guided' : assistance.toUpperCase()}</p>
                  <p><strong>Add-ons:</strong> {chosenAddOns.length > 0 ? chosenAddOns.map(a => a.name).join(', ') : 'None'}</p>
                </div>

                {/* Pricing Table */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Base Tour / Destination Cost:</span>
                    <span>₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                  {customServicesCost > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Selected Vehicle & Stay:</span>
                      <span>₹{customServicesCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {assistCost > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Caretaker / Guide Services:</span>
                      <span>₹{assistCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {addOnsCost > 0 && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Add-on Experiences & Insurance:</span>
                      <span>₹{addOnsCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between font-bold text-slate-800 pt-1 border-t border-slate-100">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between font-bold text-emerald-700">
                      <span>First Booking Discount (10%):</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Taxes & Tourism GST (5%):</span>
                    <span>₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                    <span>Final Payable Amount:</span>
                    <span className="text-amber-700">₹{finalPayable.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Traveler Contact Inputs */}
              <div className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lead Traveler Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Special Requests or Dietary Requirements (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., Elderly ground floor room requested, Jain food, child car seat..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {submissionError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 9: CONFIRMATION VIEW (SUCCESS STATE) */}
          {currentStep === 9 && submittedBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Booking Confirmed & Recorded
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 mt-2">
                  Vanakkam! Your Tamil Nadu Adventure is Set!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Booking Reference ID: <strong className="font-mono text-amber-800 text-base">{submittedBooking.id}</strong>
                </p>
              </div>

              {/* Printable Voucher Card */}
              <div className="p-6 rounded-3xl border border-slate-200 bg-white shadow-md max-w-xl mx-auto text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Destination</span>
                    <h4 className="text-base font-bold text-slate-900">{submittedBooking.destinationName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                    <p className="text-xs font-bold text-emerald-700">CONFIRMED</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travel Dates</span>
                    <span className="font-bold">{submittedBooking.travelDates.startDate} to {submittedBooking.travelDates.returnDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Travellers</span>
                    <span className="font-bold">{submittedBooking.travellers.adults} Adults{submittedBooking.travellers.children > 0 ? `, ${submittedBooking.travellers.children} Kids` : ''}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assistance</span>
                    <span className="font-bold">{submittedBooking.caretakerGuidePreference.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Final Amount</span>
                    <span className="font-black text-amber-800 text-sm">₹{submittedBooking.pricing.finalPayableAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    Payment Workflow & Next Steps:
                  </p>
                  <p>• Your booking is confirmed with payment status: <strong>Pay on Arrival / UPI Token</strong>.</p>
                  <p>• Our local TN Stories ground coordinator will reach out to <strong>{submittedBooking.customerPhone}</strong> within 4 hours to verify chauffeur dispatch and hotel check-in details.</p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Travel Voucher
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                  >
                    Done & Return Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Bottom Navigation Bar */}
        {currentStep < 9 && (
          <div className="p-4 sm:px-8 border-t border-slate-200 bg-white flex items-center justify-between">
            <div>
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}
            </div>

            {/* Estimated Total Pill in Footer */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Estimated Total:</span>
              <span className="text-base font-extrabold text-slate-900">
                ₹{finalPayable.toLocaleString('en-IN')}
              </span>
              {discountAmount > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  (10% Saved)
                </span>
              )}
            </div>

            <div>
              {currentStep < 8 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 active:scale-95 transition-all"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting || !canProceed()}
                  className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <span>Confirm & Book Trip</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
