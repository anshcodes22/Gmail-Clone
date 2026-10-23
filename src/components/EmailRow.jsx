import React, { useState } from 'react';
import { 
  Square, 
  CheckSquare, 
  Star, 
  GripVertical, 
  Calendar, 
  Archive, 
  Trash2, 
  Mail, 
  MailOpen, 
  Clock,
  Paperclip,
  Bookmark
} from 'lucide-react';

export default function EmailRow({
  email,
  isSelected,
  onToggleSelect,
  onToggleStar,
  onToggleRead,
  onDelete,
  onArchive,
  onClick
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`group relative flex items-center h-10 px-2 sm:px-4 border-b border-[#f2f2f2] cursor-pointer text-[14px] transition-colors ${
        isSelected
          ? 'bg-[#c2dbff]'
          : isHovered
          ? 'bg-[#f2f6fc] shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] z-10'
          : email.unread
          ? 'bg-white font-bold text-[#1f1f1f]'
          : 'bg-[#f8fafd] text-[#444746]'
      }`}
    >
      {/* Drag handle (appears on hover) */}
      <div className="w-5 -ml-1 text-gray-400 opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center shrink-0">
        <GripVertical className="w-4 h-4 cursor-grab" />
      </div>

      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(email.id);
        }}
        className="p-1 rounded hover:bg-black/10 text-gray-400 group-hover:text-gray-600 shrink-0"
      >
        {isSelected ? (
          <CheckSquare className="w-4 h-4 text-[#0b57d0]" />
        ) : (
          <Square className="w-4 h-4" />
        )}
      </button>

      {/* Star button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar(email.id);
        }}
        className="p-1 rounded hover:bg-black/10 ml-0.5 shrink-0"
      >
        <Star
          className={`w-4 h-4 ${
            email.starred
              ? 'fill-[#f4b400] text-[#f4b400]'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        />
      </button>

      {/* Important Marker */}
      {email.isImportant && (
        <span className="p-0.5 ml-0.5 shrink-0 text-[#f4b400]" title="Marked as important">
          <Bookmark className="w-3.5 h-3.5 fill-[#f4b400] stroke-none" />
        </span>
      )}

      {/* Sender Name */}
      <div 
        className={`w-32 sm:w-44 md:w-52 shrink-0 truncate ml-2 sm:ml-3 text-[14px] ${
          email.unread ? 'font-bold text-[#1f1f1f]' : 'font-normal text-[#444746]'
        }`}
      >
        {email.sender}
      </div>

      {/* Subject & Snippet Preview */}
      <div className="flex-1 flex items-center min-w-0 mx-2 overflow-hidden">
        <span 
          className={`truncate ${
            email.unread ? 'font-bold text-[#1f1f1f]' : 'font-normal text-[#1f1f1f]'
          }`}
        >
          {email.subject}
        </span>
        
        <span className="text-[#5f6368] font-normal truncate ml-1 shrink min-w-0">
          {email.snippet}
        </span>

        {/* Inline Unsubscribe Button (matching row 12 of screenshot) */}
        {email.hasUnsubscribe && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              alert(`Unsubscribed from ${email.sender}`);
            }}
            className="hidden md:inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full border border-gray-300 text-[12px] font-medium text-gray-700 bg-white hover:bg-gray-100 shadow-xs shrink-0"
          >
            Unsubscribe
          </button>
        )}

        {/* Attachment Pill Chip */}
        {email.attachments && email.attachments.length > 0 && email.attachments[0] && (
          <span 
            className="hidden lg:inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded border border-gray-200 bg-white/80 text-[11px] text-gray-600 font-medium shrink-0 shadow-xs"
            title={`${email.attachments.map(a => a?.name || 'Attachment').join(', ')}`}
          >
            <Paperclip className="w-3 h-3 text-gray-500" />
            <span className="truncate max-w-[130px]">{email.attachments[0]?.name || 'Attachment'}</span>
            {email.attachments.length > 1 && <span className="text-gray-400">+{email.attachments.length - 1}</span>}
          </span>
        )}
      </div>

      {/* Right side: Hover Action Buttons OR Date/Time & Icons */}
      <div className="shrink-0 flex items-center justify-end pl-2 min-w-[90px]">
        {/* Quick action buttons on hover */}
        {isHovered ? (
          <div className="flex items-center gap-0.5 text-[#5f6368] bg-transparent">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(email.id);
              }}
              title="Archive"
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(email.id);
              }}
              title="Delete"
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleRead(email.id);
              }}
              title={email.unread ? "Mark as read" : "Mark as unread"}
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            >
              {email.unread ? (
                <MailOpen className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              title="Snooze"
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Normal State: Date/Time + Optional Calendar & Attachment icons */
          <div className="flex items-center gap-1.5 sm:gap-2">
            {email.attachments && email.attachments.length > 0 && (
              <Paperclip className="w-3.5 h-3.5 text-[#5f6368] stroke-[2]" title={`${email.attachments.length} attachment(s)`} />
            )}
            {email.hasCalendar && (
              <Calendar className="w-3.5 h-3.5 text-[#5f6368] stroke-[1.8]" />
            )}
            <span
              className={`text-[12px] whitespace-nowrap ${
                email.unread ? 'font-bold text-[#1f1f1f]' : 'font-normal text-[#5f6368]'
              }`}
            >
              {email.time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
