import React from 'react';
import { Inbox, Tag, Users, AlertCircle } from 'lucide-react';

export default function CategoryTabs({ activeTab, setActiveTab }) {
  const tabs = [
    {
      id: 'primary',
      name: 'Primary',
      icon: Inbox,
      badge: null,
      preview: null,
      activeColor: 'border-[#0b57d0] text-[#0b57d0]',
      iconColor: 'text-[#0b57d0]'
    },
    {
      id: 'promotions',
      name: 'Promotions',
      icon: Tag,
      badge: '28 new',
      badgeBg: 'bg-[#188038]',
      preview: 'Internshala — Action needed: fi...',
      activeColor: 'border-[#188038] text-[#188038]',
      iconColor: 'text-[#5f6368]'
    },
    {
      id: 'social',
      name: 'Social',
      icon: Users,
      badge: '9 new',
      badgeBg: 'bg-[#1a73e8]',
      preview: 'LinkedIn — You have 1 new invita...',
      activeColor: 'border-[#1a73e8] text-[#1a73e8]',
      iconColor: 'text-[#5f6368]'
    },
    {
      id: 'updates',
      name: 'Updates',
      icon: AlertCircle,
      badge: '50 new',
      badgeBg: 'bg-[#e37400]',
      preview: 'Internshala — Update: You have ...',
      activeColor: 'border-[#e37400] text-[#e37400]',
      iconColor: 'text-[#5f6368]'
    }
  ];

  return (
    <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar shrink-0 bg-white">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[200px] sm:min-w-[220px] px-4 py-3 text-left transition-colors relative flex flex-col justify-center ${
              isActive 
                ? 'bg-transparent' 
                : 'hover:bg-gray-50'
            }`}
          >
            {/* Top row: Icon + Tab Title + Badge */}
            <div className="flex items-center gap-3">
              <Icon 
                className={`w-4 h-4 shrink-0 ${
                  isActive ? tab.iconColor : 'text-[#5f6368]'
                }`} 
              />
              <span className={`text-[14px] font-medium tracking-tight ${
                isActive ? 'text-[#0b57d0] font-semibold' : 'text-[#444746]'
              }`}>
                {tab.name}
              </span>

              {tab.badge && (
                <span className={`${tab.badgeBg} text-white text-[11px] font-bold px-1.5 py-0.5 rounded-[4px] leading-none`}>
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Bottom preview snippet if present */}
            {tab.preview && (
              <div className="text-[12px] text-[#5f6368] truncate mt-0.5 pl-7 hidden lg:block">
                {tab.preview}
              </div>
            )}

            {/* Bottom active line */}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0b57d0] rounded-t-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
}
