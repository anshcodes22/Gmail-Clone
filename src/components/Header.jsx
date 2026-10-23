import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  SlidersHorizontal, 
  HelpCircle, 
  Settings, 
  Grid
} from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import gmailLogo from '../assets/gmail-logo.png';

export const getAvatarColor = (char) => {
  const colors = [
    'bg-[#00796b]', // Teal
    'bg-[#c2185b]', // Pink
    'bg-[#7b1fa2]', // Purple
    'bg-[#512da8]', // Deep Purple
    'bg-[#1976d2]', // Blue
    'bg-[#0097a7]', // Cyan
    'bg-[#388e3c]', // Green
    'bg-[#f57c00]', // Orange
    'bg-[#e64a19]', // Deep Orange
    'bg-[#d93025]'  // Red
  ];
  if (!char) return colors[0];
  const code = char.charCodeAt(0) % colors.length;
  return colors[code];
};

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  toggleSidebar, 
  sidebarExpanded,
  currentUser = { email: 'user@example.com' },
  onLogin,
  onSignOut
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const firstLetter = (currentUser?.email?.[0] || 'A').toUpperCase();
  const avatarBg = getAvatarColor(firstLetter);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="h-16 px-3 flex items-center justify-between gap-3 bg-[#f6f8fc] select-none shrink-0 z-20 relative">
      {/* Left side: Hamburger + Logo */}
      <div className="flex items-center gap-3 min-w-[230px]">
        <button 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          className="p-2.5 rounded-full hover:bg-black/5 active:bg-black/10 text-[#444746] transition-colors"
        >
          <Menu className="w-5 h-5 stroke-[2]" />
        </button>

        <div className="flex items-center cursor-pointer select-none">
          <img 
            src={gmailLogo} 
            alt="Gmail" 
            className="h-10 sm:h-[42px] w-auto object-contain pl-1 hover:opacity-95 transition-opacity" 
          />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-[720px] mx-2">
        <div className="relative flex items-center bg-[#eaf1fb] hover:bg-[#e1e9f5] focus-within:bg-white focus-within:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] rounded-full h-12 px-4 transition-all duration-150">
          <button className="p-1 rounded-full text-[#444746] hover:bg-black/5 mr-2">
            <Search className="w-5 h-5 text-[#444746]" />
          </button>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask Gmail"
            className="w-full bg-transparent text-[16px] text-[#1f1f1f] placeholder-[#444746] focus:outline-none"
          />

          <button 
            title="Show search options"
            className="p-1.5 rounded-full text-[#444746] hover:bg-black/5 transition-colors ml-1"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right side: Action icons and Profile */}
      <div className="flex items-center gap-1 sm:gap-2" ref={profileRef}>
        <button 
          title="Support"
          className="p-2.5 rounded-full hover:bg-black/5 text-[#444746] transition-colors hidden sm:flex"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.8]" />
        </button>

        <button 
          title="Settings"
          className="p-2.5 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Gemini AI Sparkle Icon */}
        <button 
          title="Gemini"
          className="p-2.5 rounded-full hover:bg-black/5 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path 
              fill="url(#gemini-sparkle-gradient)" 
              d="M12 2C12 7.52 7.52 12 2 12c5.48 0 10 4.48 10 10 0-5.52 4.48-10 10-10-5.52 0-10-4.48-10-10z" 
            />
            <defs>
              <linearGradient id="gemini-sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1A73E8"/>
                <stop offset="35%" stopColor="#8E24AA"/>
                <stop offset="70%" stopColor="#EA4335"/>
                <stop offset="100%" stopColor="#FBBC04"/>
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Google Apps 9-dots */}
        <button 
          title="Google apps"
          className="p-2.5 rounded-full hover:bg-black/5 text-[#444746] transition-colors hidden sm:flex"
        >
          <Grid className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Account Avatar with user's First Letter */}
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          title={`Google Account: ${currentUser?.email || 'Sign In'}`}
          className="ml-1 p-0.5 rounded-full hover:ring-4 hover:ring-black/5 transition-all relative focus:outline-none"
        >
          <div className={`w-8 h-8 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-inner transition-colors`}>
            {firstLetter}
          </div>
        </button>

        {/* Profile Dropdown Modal */}
        {isProfileOpen && (
          <ProfileDropdown
            currentUser={currentUser}
            onLogin={onLogin}
            onSignOut={onSignOut}
            onClose={() => setIsProfileOpen(false)}
            getAvatarColor={getAvatarColor}
          />
        )}
      </div>
    </header>
  );
}
