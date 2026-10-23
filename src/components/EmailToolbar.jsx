import React, { useState } from 'react';
import { 
  Square, 
  CheckSquare, 
  MinusSquare, 
  ChevronDown, 
  RotateCw, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Archive,
  Trash2,
  Mail,
  Clock,
  Tag,
  Plus
} from 'lucide-react';

export default function EmailToolbar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onRefresh,
  onDeleteSelected,
  onMarkAsReadSelected,
  onArchiveSelected,
  onOpenAddMail,
  onResetEmails
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isAllSelected = selectedCount > 0 && selectedCount === totalCount;
  const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <div className="h-12 px-4 flex items-center justify-between border-b border-gray-200 select-none bg-white rounded-t-2xl shrink-0">
      {/* Left side actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Selection checkbox + mini chevron */}
        <div className="flex items-center rounded hover:bg-black/5 p-1 transition-colors relative">
          <button
            onClick={() => {
              if (selectedCount > 0) {
                onDeselectAll();
              } else {
                onSelectAll();
              }
            }}
            aria-label="Select"
            className="p-1 rounded text-[#444746]"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-[#0b57d0]" />
            ) : isPartiallySelected ? (
              <MinusSquare className="w-4 h-4 text-[#0b57d0]" />
            ) : (
              <Square className="w-4 h-4 text-[#444746]" />
            )}
          </button>

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-0.5 text-[#444746] hover:bg-black/10 rounded"
          >
            <ChevronDown className="w-3 h-3" />
          </button>

          {/* Select dropdown options */}
          {showDropdown && (
            <div 
              className="absolute left-0 top-full mt-1 w-32 bg-white rounded shadow-lg border border-gray-200 py-1 z-30 text-[13px] text-[#1f1f1f]"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button 
                onClick={() => { onSelectAll(); setShowDropdown(false); }}
                className="w-full text-left px-4 py-1.5 hover:bg-gray-100"
              >
                All
              </button>
              <button 
                onClick={() => { onDeselectAll(); setShowDropdown(false); }}
                className="w-full text-left px-4 py-1.5 hover:bg-gray-100"
              >
                None
              </button>
            </div>
          )}
        </div>

        {/* Dynamic actions when items are selected */}
        {selectedCount > 0 ? (
          <div className="flex items-center gap-1 sm:gap-2 ml-1 text-[#444746]">
            <button 
              onClick={onArchiveSelected} 
              title="Archive" 
              className="p-2 rounded-full hover:bg-black/5"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button 
              onClick={onDeleteSelected} 
              title="Delete" 
              className="p-2 rounded-full hover:bg-black/5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onMarkAsReadSelected} 
              title="Mark as read" 
              className="p-2 rounded-full hover:bg-black/5"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button 
              title="Snooze" 
              className="p-2 rounded-full hover:bg-black/5 hidden sm:flex"
            >
              <Clock className="w-4 h-4" />
            </button>
            <button 
              title="Add label" 
              className="p-2 rounded-full hover:bg-black/5 hidden sm:flex"
            >
              <Tag className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={onRefresh}
              title="Refresh"
              className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* More Options Dropdown */}
            <div className="relative">
              <button 
                title="More"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className={`p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors ${showMoreMenu ? 'bg-black/10' : ''}`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div 
                  className="absolute left-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 z-40 text-[13px] text-[#1f1f1f]"
                  onMouseLeave={() => setShowMoreMenu(false)}
                >
                  {onOpenAddMail && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        onOpenAddMail();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex items-center gap-2.5 text-[#0b57d0] font-medium"
                    >
                      <Plus className="w-4 h-4 text-[#0b57d0]" />
                      <span>Add Mail</span>
                    </button>
                  )}
                  {onResetEmails && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        onResetEmails();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex items-center gap-2.5 text-[#444746]"
                    >
                      <RotateCw className="w-4 h-4 text-[#444746]" />
                      <span>Reset to 200 mock emails</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      onRefresh && onRefresh();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#f1f3f4] flex items-center gap-2.5 text-[#444746]"
                  >
                    <RotateCw className="w-4 h-4 text-[#444746]" />
                    <span>Refresh</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right side pagination */}
      <div className="flex items-center gap-1 sm:gap-3 text-[12px] text-[#444746]">
        <span>{totalCount > 0 ? `1–${Math.min(50, totalCount)} of ${totalCount}` : '1–50 of 100'}</span>
        
        <div className="flex items-center">
          <button 
            disabled 
            title="Newer"
            className="p-2 rounded-full text-gray-300 cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button 
            title="Older"
            className="p-2 rounded-full text-[#444746] hover:bg-black/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
