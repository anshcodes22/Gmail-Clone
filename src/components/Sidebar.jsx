import React, { useState } from 'react';
import { 
  Inbox, 
  Star, 
  Clock, 
  SendHorizontal, 
  FileText, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  Plus, 
  Pencil,
  Trash2,
  AlertOctagon,
  Tag,
  Folder,
  MailPlus
} from 'lucide-react';
import gmailLogo from '../assets/gmail-logo.png';

export default function Sidebar({ 
  currentFolder, 
  setCurrentFolder, 
  unreadCount = 2368,
  draftsCount = 3,
  purchasesCount = 6,
  onOpenCompose,
  onOpenAddMail,
  isCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) {
  const [showMore, setShowMore] = useState(false);

  const navItems = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount ? unreadCount.toLocaleString() : null },
    { id: 'starred', label: 'Starred', icon: Star, count: null },
    { id: 'snoozed', label: 'Snoozed', icon: Clock, count: null },
    { id: 'sent', label: 'Sent', icon: SendHorizontal, count: null },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: draftsCount },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag, count: purchasesCount },
  ];

  const moreItems = [
    { id: 'add-mail', label: 'Add Mail', icon: MailPlus, isAction: true },
    { id: 'spam', label: 'Spam', icon: AlertOctagon, count: 12 },
    { id: 'trash', label: 'Trash', icon: Trash2, count: null },
    { id: 'categories', label: 'Categories', icon: Tag, count: null },
    { id: 'manage-labels', label: 'Manage labels', icon: Folder, count: null }
  ];

  const handleSelect = (id) => {
    if (id === 'add-mail') {
      if (onOpenAddMail) {
        onOpenAddMail();
      }
      if (setIsMobileOpen) {
        setIsMobileOpen(false);
      }
      return;
    }
    setCurrentFolder(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full py-2 pr-3 select-none">
      {/* Compose Button */}
      <div className="px-3 mb-4">
        <button
          onClick={onOpenCompose}
          className={`group flex items-center justify-center gap-3 bg-[#c2e7ff] hover:bg-[#b3d7ef] hover:shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] text-[#041e49] font-medium transition-all duration-200 ${
            isCollapsed 
              ? 'w-14 h-14 rounded-2xl mx-auto p-0' 
              : 'h-14 px-6 rounded-2xl shadow-sm'
          }`}
        >
          <Pencil className="w-5 h-5 text-[#041e49] group-hover:scale-105 transition-transform" />
          {!isCollapsed && <span className="text-[14px] font-semibold tracking-wide">Compose</span>}
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentFolder === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${
                isCollapsed 
                  ? 'justify-center rounded-full w-12 h-12 mx-auto my-1' 
                  : 'rounded-r-full'
              } ${
                isActive
                  ? 'bg-[#d3e3fd] text-[#041e49] font-bold'
                  : 'text-[#444746] hover:bg-[#eaebef] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#041e49] fill-current stroke-[2.2]' : 'text-[#444746] stroke-[1.8]'}`} />
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.count && (
                    <span className={`text-[12px] font-medium ${isActive ? 'text-[#041e49] font-bold' : 'text-[#444746]'}`}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* More dropdown */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-[#444746] hover:bg-[#eaebef] font-medium transition-colors ${
            isCollapsed 
              ? 'justify-center rounded-full w-12 h-12 mx-auto' 
              : 'rounded-r-full'
          }`}
        >
          {showMore ? (
            <ChevronUp className="w-5 h-5 shrink-0 text-[#444746]" />
          ) : (
            <ChevronDown className="w-5 h-5 shrink-0 text-[#444746]" />
          )}
          {!isCollapsed && (
            <span className="flex-1 text-left">
              {showMore ? 'Less' : 'More'}
            </span>
          )}
        </button>

        {/* Expanded More items */}
        {showMore && (
          <div className="space-y-0.5 pt-0.5">
            {moreItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentFolder === item.id;
              const isAddMailAction = item.id === 'add-mail';
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${
                    isCollapsed 
                      ? 'justify-center rounded-full w-12 h-12 mx-auto my-0.5' 
                      : 'rounded-r-full'
                  } ${
                    isAddMailAction
                      ? isCollapsed
                        ? 'bg-[#c2e7ff] text-[#041e49] hover:bg-[#b3d7ef]'
                        : 'text-[#0b57d0] hover:bg-[#c2e7ff]/40 font-semibold'
                      : isActive
                        ? 'bg-[#d3e3fd] text-[#041e49] font-bold'
                        : 'text-[#444746] hover:bg-[#eaebef] font-medium'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isAddMailAction ? 'text-[#0b57d0] stroke-[2.2]' : isActive ? 'text-[#041e49] fill-current stroke-[2.2]' : 'text-[#444746] stroke-[1.8]'}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {isAddMailAction ? (
                        <span className="text-[11px] font-semibold bg-[#c2e7ff] text-[#041e49] px-2 py-0.5 rounded-full">
                          + Add
                        </span>
                      ) : item.count ? (
                        <span className="text-[12px] font-medium text-[#444746]">
                          {item.count}
                        </span>
                      ) : null}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Labels section */}
        {!isCollapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-4 py-1.5 text-[#444746] font-medium text-[14px]">
              <span>Labels</span>
              <button 
                title="Create new label" 
                className="p-1 rounded-full hover:bg-black/5 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#444746]" />
              </button>
            </div>
            
            <div className="mt-1 space-y-0.5">
              <button className="w-full flex items-center gap-4 px-4 py-1.5 text-[14px] text-[#444746] hover:bg-[#eaebef] rounded-r-full font-medium">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="truncate">Important</span>
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-1.5 text-[14px] text-[#444746] hover:bg-[#eaebef] rounded-r-full font-medium">
                <Tag className="w-4 h-4 text-indigo-600" />
                <span className="truncate">Work</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside 
        className={`hidden md:block shrink-0 transition-all duration-200 bg-[#f6f8fc] ${
          isCollapsed ? 'w-[72px]' : 'w-[256px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[#f6f8fc] z-50 shadow-2xl md:hidden transform transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 select-none">
          <img src={gmailLogo} alt="Gmail" className="h-9 w-auto object-contain" />
        </div>
        <div className="h-[calc(100%-60px)]">
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
