import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, Key, AlertCircle, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

interface AdminLoginModalProps {
  onClose: () => void;
  onAdminLoginSuccess: (admin: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  onClose,
  onAdminLoginSuccess
}) => {
  const [email, setEmail] = useState('admin@tnstories.in');
  const [password, setPassword] = useState('admin123');
  const [securityPasscode, setSecurityPasscode] = useState('9844');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await api.adminLogin({
        email,
        password,
        securityPasscode
      });
      onAdminLoginSuccess(res.admin);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Administrative authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofill = () => {
    setEmail('admin@tnstories.in');
    setPassword('admin123');
    setSecurityPasscode('9844');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-500/30 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle purple gradient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Portal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-purple-900/40 border border-purple-400/40">
            <ShieldCheck className="w-8 h-8 text-purple-200" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-300 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full">
            Restricted Staff & Admin Gateway
          </span>

          <h3 className="text-2xl font-black font-serif text-white mt-2.5">
            Admin Portal Login
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Authorized personnel only. Access inventory controls, booking pipelines & pricing engines.
          </p>
        </div>

        {/* Security Warning Notice */}
        <div className="mb-5 p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-start gap-2.5 text-xs text-purple-200">
          <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <span>Customer accounts cannot log in here. Travelers should use the </span>
            <span className="text-amber-400 font-bold underline cursor-pointer" onClick={onClose}>
              Customer Portal
            </span>
            .
          </div>
        </div>

        {/* Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tnstories.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Administrative Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Staff Security Key PIN (Optional)
              </label>
              <span className="text-[10px] text-purple-300 font-medium">Default: 9844</span>
            </div>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={securityPasscode}
                onChange={(e) => setSecurityPasscode(e.target.value)}
                placeholder="4-digit security PIN"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-900/50 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Verifying Administrative Credentials...</span>
            ) : (
              <>
                <span>Authenticate as Administrator</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick 1-Click Autofill Demo Badge */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAutofill}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[11px] text-purple-300 hover:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Quick Autofill Official Demo Admin</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">admin@tnstories.in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
