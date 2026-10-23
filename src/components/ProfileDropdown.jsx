import React, { useState } from 'react';
import { X, LogIn, LogOut, User, Shield, KeyRound, Check } from 'lucide-react';

export default function ProfileDropdown({ 
  currentUser, 
  onLogin, 
  onSignOut, 
  onClose,
  getAvatarColor
}) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSwitching, setIsSwitching] = useState(!currentUser?.email);
  const [error, setError] = useState('');

  const firstLetter = (currentUser?.email?.[0] || 'A').toUpperCase();
  const avatarBg = getAvatarColor(firstLetter);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setError('Please enter your email address.');
      return;
    }
    // No real authentication required, as requested
    onLogin(emailInput.trim(), passwordInput);
    setEmailInput('');
    setPasswordInput('');
    setIsSwitching(false);
    setError('');
    onClose();
  };

  return (
    <div 
      className="absolute right-2 top-16 z-50 w-80 sm:w-96 bg-[#e9eef6] rounded-3xl shadow-2xl border border-gray-200/80 p-4 animate-in fade-in zoom-in-95 duration-150 select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Top Header Row with Close */}
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="text-xs font-semibold text-gray-600 truncate max-w-[240px]">
          {currentUser?.email || 'Sign in to Google'}
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-black/10 text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col items-center text-center">
        {/* Large Avatar Circle with First Letter */}
        <div className={`w-20 h-20 rounded-full ${avatarBg} text-white flex items-center justify-center text-3xl font-medium shadow-md mb-3`}>
          {firstLetter}
        </div>

        {/* User Greeting & Email */}
        <h3 className="text-base font-semibold text-gray-900 leading-tight">
          Hi, {currentUser?.email ? currentUser.email.split('@')[0] : 'Guest'}!
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 mb-4">
          {currentUser?.email || 'Not signed in'}
        </p>

        {/* Manage Account Pill */}
        <button 
          onClick={() => alert("Google Account settings are simulated in this clone.")}
          className="px-4 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4"
        >
          Manage your Google Account
        </button>

        {/* Login Form or Switch Option */}
        {isSwitching ? (
          <form onSubmit={handleSubmit} className="w-full border-t border-gray-100 pt-4 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                Enter your details to log in
              </span>
              {currentUser?.email && (
                <button
                  type="button"
                  onClick={() => setIsSwitching(false)}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Cancel
                </button>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-600 mb-2 font-medium">{error}</p>
            )}

            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Fake Password (no auth)
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter any fake password"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  Password is not verified — just for simulation.
                </span>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Sign in & Update Avatar
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full border-t border-gray-100 pt-3 flex flex-col gap-2">
            <button
              onClick={() => setIsSwitching(true)}
              className="w-full py-2 px-3 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center gap-2 transition-colors border border-gray-200"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              Sign in with another email
            </button>

            <button
              onClick={() => {
                onSignOut();
                setIsSwitching(true);
              }}
              className="w-full py-2 px-3 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out of this account
            </button>
          </div>
        )}
      </div>

      {/* Footer policy links */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 pt-3">
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span>•</span>
        <span className="hover:underline cursor-pointer">Terms of Service</span>
      </div>
    </div>
  );
}
