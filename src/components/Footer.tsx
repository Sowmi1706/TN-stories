import React from 'react';
import { MapPin, Phone, Shield, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onSelectDestination?: (destId: string) => void;
  onOpenCustomerLogin?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectDestination,
  onOpenCustomerLogin,
  onOpenAdminLogin
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md border border-amber-500/30">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-amber-100" strokeWidth="1.5">
                  <path d="M12 2L14 6H10L12 2Z" />
                  <path d="M8 6H16V9H8V6Z" />
                  <path d="M6 9H18V13H6V9Z" />
                  <path d="M4 13H20V18H4V13Z" />
                  <path d="M2 18H22V22H2V18Z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-serif tracking-tight">TN Stories</span>
                <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Tamil Nadu Tourism Portal</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Dedicated to showcasing the cultural heritage, majestic Dravidian architecture, misty mountain sanctuaries, and culinary marvels of Tamil Nadu. Handcrafted itineraries with verified local caretakers and guides.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-amber-200">
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Helpline: <strong>1800-4253-1111</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>TN Tourism Certified</span>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Destinations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Iconic Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              {['Ooty (Nilgiris)', 'Madurai Meenakshi', 'Kodaikanal', 'Kanyakumari', 'Mahabalipuram', 'Thanjavur Brihadisvara'].map((name, idx) => (
                <li key={idx}>
                  <span className="hover:text-amber-400 cursor-pointer transition-colors">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Experience Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Travel Themes
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Misty Hill Stations',
                'Great Living Chola Temples',
                'Coastal Confluence & Beaches',
                'Western Ghats Wildlife & Waterfalls',
                'Chettinad Heritage & Gastronomy',
                'UNESCO World Heritage Sites'
              ].map((theme, idx) => (
                <li key={idx}>
                  <span className="hover:text-amber-400 cursor-pointer transition-colors">
                    {theme}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Portals & Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Portals & Access
            </h4>
            <div className="space-y-2.5 text-xs">
              <button
                onClick={onOpenCustomerLogin}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 font-bold border border-slate-800 transition-colors block"
              >
                👤 Customer Account Login
              </button>
              <button
                onClick={onOpenAdminLogin}
                className="w-full text-left px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-purple-300 font-bold border border-purple-900/50 transition-colors block"
              >
                🔒 Staff & Admin Gateway
              </button>
              <p className="text-[10px] text-slate-500 pt-1 leading-relaxed">
                Separate authentication systems for travelers and state tourism managers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TN Stories. All rights reserved. Built with pride for Tamil Nadu Tourism.</p>
          <div className="flex items-center gap-4 text-xs">
            <span onClick={onOpenCustomerLogin} className="hover:text-slate-300 cursor-pointer">Customer Login</span>
            <span>•</span>
            <span onClick={onOpenAdminLogin} className="hover:text-purple-300 cursor-pointer">Admin Login</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
