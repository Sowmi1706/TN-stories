import React from 'react';
import { Compass, CalendarCheck, ShieldCheck, User as UserIcon, Sparkles, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  users: User[];
  onOpenBooking: () => void;
  onOpenProfile: () => void;
  onOpenAdmin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  promoEligible: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  users,
  onOpenBooking,
  onOpenProfile,
  onOpenAdmin,
  activeTab,
  setActiveTab,
  promoEligible
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top Heritage Notice Ribbon */}
      <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-50 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Experience Tamil Nadu: Land of Timeless Temples, Misty Nilgiris & Pristine Coastlines</span>
          </div>
          <div className="flex items-center gap-4 text-amber-200">
            {promoEligible && (
              <span className="hidden sm:inline-flex items-center gap-1 bg-amber-600/60 px-2 py-0.5 rounded text-[11px] text-white font-semibold">
                <Sparkles className="w-3 h-3 text-amber-300" /> 10% First Booking Offer Active
              </span>
            )}
            <span className="hidden md:inline">24x7 Traveler Support: 1800-4253-1111</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform duration-300 border border-amber-500/30">
            {/* Gopuram / Temple Silhouette SVG */}
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current text-amber-100" strokeWidth="1.5">
              <path d="M12 2L14 6H10L12 2Z" />
              <path d="M8 6H16V9H8V6Z" />
              <path d="M6 9H18V13H6V9Z" />
              <path d="M4 13H20V18H4V13Z" />
              <path d="M2 18H22V22H2V18Z" />
              <path d="M10 18H14V22H10V18Z" fill="#78350F" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight text-amber-950 font-serif">
                TN Stories
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                Tamil Nadu
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Authentic Journeys & Smart Trip Booking</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => { setActiveTab('explore'); }}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-amber-100/70 text-amber-900'
                : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/60'
            }`}
          >
            Explore Places
          </button>
          <button
            onClick={() => { setActiveTab('packages'); }}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'packages'
                ? 'bg-amber-100/70 text-amber-900'
                : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/60'
            }`}
          >
            Tour Packages
          </button>
          <button
            onClick={() => { setActiveTab('hidden'); }}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'hidden'
                ? 'bg-amber-100/70 text-amber-900'
                : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/60'
            }`}
          >
            Hidden Gems
          </button>
          <button
            onClick={() => { setActiveTab('reviews'); }}
            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'reviews'
                ? 'bg-amber-100/70 text-amber-900'
                : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50/60'
            }`}
          >
            Traveler Stories
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-purple-50 text-purple-800 hover:bg-purple-100 flex items-center gap-1.5 transition-all ml-1 border border-purple-200"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              Admin Portal
            </button>
          )}
        </div>

        {/* Right Action Buttons & User Switcher */}
        <div className="flex items-center gap-3">
          {/* User Profile / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-slate-200 hover:border-amber-400 bg-white shadow-2xs hover:shadow-xs transition-all text-left"
              title="Switch user persona"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";
                }}
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {currentUser.name.split(' ')[0]}
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-purple-100 text-purple-700 font-extrabold px-1 rounded">Admin</span>
                  )}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role === 'admin' ? 'Manager' : (promoEligible ? '1st Booking Offer' : 'Member')}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 hover:bg-amber-50 flex items-center gap-2.5"
                  >
                    <UserIcon className="w-4 h-4 text-amber-600" />
                    My Bookings & Reviews
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        onOpenAdmin();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Admin Dashboard
                    </button>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <p className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Switch Test Persona
                  </p>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs flex items-center justify-between ${
                        u.id === currentUser.id ? 'bg-amber-50/80 font-bold text-amber-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 block">{u.role === 'admin' ? 'Admin' : (u.hasCompletedBookings ? 'Repeat Traveler' : 'First Time')}</span>
                        </div>
                      </div>
                      {u.id === currentUser.id && <span className="text-amber-600 text-xs">Active</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA - Book Trip Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-600/30 active:scale-95 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Your Trip</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
