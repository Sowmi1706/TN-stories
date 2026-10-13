import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Sparkles, Compass, ArrowRight } from 'lucide-react';
import { Destination } from '../types';

interface HeroSliderProps {
  destinations: Destination[];
  onExploreClick: () => void;
  onBookClick: (destId?: string) => void;
  onSelectDestination: (dest: Destination) => void;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  tagline: string;
  location: string;
  image: string;
  fallbackImage: string;
  destId: string;
  accent: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  destinations,
  onExploreClick,
  onBookClick,
  onSelectDestination
}) => {
  const slides: HeroSlide[] = [
    {
      title: "Ooty & Nilgiri Mountain Railway",
      subtitle: "Misty tea hills, blue mountain pine ridges and the iconic UNESCO heritage toy train.",
      tagline: "Queen of Hill Stations",
      location: "The Nilgiris • 2,240m Altitude",
      image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
      destId: "ooty",
      accent: "from-emerald-900/90 via-slate-900/60 to-black/80"
    },
    {
      title: "Madurai Meenakshi Sundareswarar",
      subtitle: "Gopurams sculpted with 33,000 timeless deities, fragrant jasmine bazaars, and 2,500 years of living history.",
      tagline: "Ancient Temple Capital",
      location: "Madurai • Vaigai River Basin",
      image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
      destId: "madurai",
      accent: "from-amber-950/90 via-slate-900/60 to-black/80"
    },
    {
      title: "Kanyakumari & Cape Comorin",
      subtitle: "Where three mighty oceans converge — witness simultaneous sunsets and moonrises over Vivekananda Rock.",
      tagline: "The Southernmost Tip of India",
      location: "Kanyakumari • Triveni Sangam",
      image: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
      destId: "kanyakumari",
      accent: "from-cyan-950/90 via-slate-900/60 to-black/80"
    },
    {
      title: "Mahabalipuram UNESCO Shore Temple",
      subtitle: "7th-century rock-cut monuments, Pancha Rathas carved from single boulders, and salty ocean spray.",
      tagline: "Pallava Architectural Marvel",
      location: "Chengalpattu • Coromandel Coast",
      image: "https://images.unsplash.com/photo-1600100397608-f010f4438317?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85",
      destId: "mahabalipuram",
      accent: "from-stone-950/90 via-slate-900/60 to-black/80"
    },
    {
      title: "Kodaikanal Star Lake & Pillar Rocks",
      subtitle: "Shola forests, cascading waterfalls, and cool mountain cycling trails in the Palani Hills.",
      tagline: "Princess of Hill Stations",
      location: "Dindigul • Palani Range",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1600&q=85",
      destId: "kodaikanal",
      accent: "from-teal-950/90 via-slate-900/60 to-black/80"
    },
    {
      title: "Thanjavur Brihadisvara Great Temple",
      subtitle: "Thousand-year-old architectural triumph built from 130,000 tonnes of solid granite by the Chola emperors.",
      tagline: "Cradle of Chola Dynasty",
      location: "Thanjavur • Cauvery Delta",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85",
      fallbackImage: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1600&q=85",
      destId: "thanjavur",
      accent: "from-amber-950/90 via-slate-900/60 to-black/80"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Quick Discovery Form State
  const [quickDest, setQuickDest] = useState('ooty');
  const [quickCompanion, setQuickCompanion] = useState('family');

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentSlide];

  const handleQuickFind = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destinations.find(d => d.id === quickDest);
    if (dest) {
      onSelectDestination(dest);
    } else {
      onExploreClick();
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      {/* Slider Viewport */}
      <div 
        className="relative min-h-[560px] sm:min-h-[620px] lg:min-h-[700px] flex items-center"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Images with Crossfade */}
        {slides.map((slide, idx) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== slide.fallbackImage) {
                  target.src = slide.fallbackImage;
                }
              }}
            />
            {/* Gradient Overlays for High Legibility */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        ))}

        {/* Content Container */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-3xl">
            {/* Brand Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>TN Stories • Official Tamil Nadu Tourism Experience</span>
            </div>

            {/* Main Headlines */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-serif leading-[1.15] mb-5">
              Discover the Beauty of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">Tamil Nadu</span>
            </h1>

            <p className="text-base sm:text-xl text-amber-100/90 font-normal leading-relaxed mb-8 max-w-2xl">
              Your journey, your story. Explore amazing places and create unforgettable memories.
            </p>

            {/* Active Slide Spotlight Tag */}
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs text-amber-200 mb-8">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">{current.title}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80">{current.location}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onBookClick(current.destId)}
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-xl shadow-amber-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
              >
                <span>Book Your Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/30 backdrop-blur-md hover:border-white/50 active:scale-95 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Explore Destinations</span>
              </button>
            </div>
          </div>

          {/* Quick Booking / Discovery Bar */}
          <div className="mt-12 lg:mt-16 bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 max-w-4xl">
            <form onSubmit={handleQuickFind} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Destination
                </label>
                <div className="relative">
                  <select
                    value={quickDest}
                    onChange={(e) => setQuickDest(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.district})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Companion
                </label>
                <select
                  value={quickCompanion}
                  onChange={(e) => setQuickCompanion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="solo">Solo Travel (Alone)</option>
                  <option value="family">Family Trip</option>
                  <option value="friends">Friends Group</option>
                  <option value="meet_travellers">Join Group Departure</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Travel Assistance
                </label>
                <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between">
                  <span>Caretaker / Guide</span>
                  <span className="text-emerald-700 font-bold">Optional</span>
                </div>
              </div>

              <div className="sm:col-span-3 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  <span>Plan & Book</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
