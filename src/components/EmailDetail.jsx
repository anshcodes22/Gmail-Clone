import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Archive, 
  OctagonAlert,
  Trash2, 
  Mail, 
  Clock, 
  FolderInput,
  Tag,
  Star, 
  Reply, 
  ReplyAll,
  Forward,
  MoreVertical, 
  Printer, 
  ExternalLink,
  Paperclip,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
  Smile,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  User
} from 'lucide-react';
import { downloadAttachment, downloadAllAttachments } from '../utils/attachmentUtils';

export default function EmailDetail({ 
  email, 
  onBack, 
  onToggleStar, 
  onDelete, 
  onArchive,
  currentIndex = 1,
  totalEmails = 200,
  onNext,
  onPrev,
  onReply,
  onForward
}) {
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  if (!email) return null;

  // Determine sender email (prioritizing user input)
  const senderEmail = email.senderEmail || (
    email.sender === 'Me' 
      ? 'user@example.com' 
      : `${email.sender.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`
  );

  const isGtbit = email.sender && email.sender.toUpperCase().includes('GTBIT');
  const isVercel = email.sender && email.sender.toLowerCase().includes('vercel');
  const hasAttachments = Array.isArray(email.attachments) && email.attachments.length > 0;

  // Relative time format
  const displayTime = email.time || '12:05 PM';
  const displayDateWithRelative = displayTime.includes('ago') 
    ? displayTime 
    : `${displayTime} (15 hours ago)`;

  const fullFormattedDate = `Wed, Oct 28, 2026, ${displayTime}`;

  // Avatar background
  const getAvatarColor = (name) => {
    const colors = [
      'bg-[#00796b]', 'bg-[#c2185b]', 'bg-[#7b1fa2]', 
      'bg-[#512da8]', 'bg-[#1976d2]', 'bg-[#0097a7]', 
      'bg-[#388e3c]', 'bg-[#f57c00]', 'bg-[#d93025]'
    ];
    if (!name) return colors[0];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const handleDownloadAll = () => {
    if (hasAttachments) {
      downloadAllAttachments(email.attachments);
      setToastMessage(`Downloading ${email.attachments.length} files...`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Helper to render body with clickable links
  const renderFormattedBody = (content) => {
    if (!content) return null;

    // Check if body is Vercel Access Request
    if (isVercel || content.includes('Access request') || content.includes('wants access to a URL')) {
      return (
        <div className="space-y-4 max-w-2xl py-2">
          {/* Black Vercel Triangle */}
          <div className="pt-2 pb-1">
            <span className="text-[28px] leading-none inline-block font-bold">▲</span>
          </div>

          <h2 className="text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Access request
          </h2>

          <p className="text-[14px] text-[#1f1f1f]">
            Hello, mrmorpho1.
          </p>

          <p className="text-[14px] text-[#1f1f1f] leading-relaxed">
            <a href="mailto:gourav05bhardwaj@gmail.com" className="text-[#0b57d0] hover:underline font-medium">
              gourav05bhardwaj@gmail.com
            </a>{' '}
            wants access to a URL in{' '}
            <a href="#project" className="text-[#0b57d0] hover:underline">
              gmail-clone
            </a>:
          </p>

          <p className="text-[14px]">
            <a 
              href="https://gmail-clone-66b6bnnnf-mrmorpho1s-projects.vercel.app" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#0b57d0] hover:underline break-all"
            >
              gmail-clone-66b6bnnnf-mrmorpho1s-projects.vercel.app
            </a>
          </p>

          <p className="text-[14px] text-[#444746] pt-1">
            If approved, they'll see deployments served at this URL until access is revoked.
          </p>

          {/* Manage Request Button */}
          <div className="pt-3 pb-2">
            <button 
              onClick={() => alert('Access request approval link opened')}
              className="bg-black hover:bg-neutral-800 text-white font-medium text-[13.5px] px-5 py-2.5 rounded-md shadow-xs transition-colors"
            >
              Manage request
            </button>
          </div>
        </div>
      );
    }

    // Check if body is GTBIT Placement email
    if (isGtbit || content.includes('PFA, the excel sheet') || content.includes('Consultadd')) {
      return (
        <div className="space-y-4 max-w-3xl text-[14px] leading-relaxed text-[#1f1f1f] font-sans">
          <p>Dear Students,</p>
          <p>PFA, the excel sheet with test link &amp; slot details.</p>

          {/* GTBIT Placement Signature */}
          <div className="pt-8 border-t border-gray-100 text-[#444746] space-y-1 text-[13px]">
            <p className="text-gray-400">--</p>
            <div className="flex items-center gap-3 py-1">
              <div className="w-12 h-12 rounded-full border border-[#f9ab00] bg-white flex flex-col items-center justify-center text-[7.5px] font-bold text-[#b06000] text-center leading-none shadow-xs shrink-0">
                <span className="text-[11px]">🏛️</span>
                <span>GTBIT</span>
              </div>
              <div>
                <p className="font-serif font-bold text-[#1f1f1f] text-[15px] uppercase tracking-wide">
                  Guru Tegh Bahadur Institute of Technology
                </p>
                <p className="text-[11px] text-gray-500 font-sans tracking-tight">
                  Affiliated to GGSIPU &amp; Approved by AICTE
                </p>
              </div>
            </div>

            <p className="font-serif font-bold text-[#1f1f1f] text-[15px] pt-1">
              Training &amp; Placement Cell
            </p>

            <p className="text-[13px] pt-0.5">
              <strong className="text-gray-700 font-semibold">Follow us:</strong>{' '}
              <a href="https://gtbit.ac.in" target="_blank" rel="noreferrer" className="text-[#0b57d0] hover:underline">Website</a> |{' '}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-[#0b57d0] hover:underline">LinkedIn</a> |{' '}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-[#0b57d0] hover:underline">Instagram</a> |{' '}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-[#0b57d0] hover:underline">YouTube</a>
            </p>

            <p className="text-[13px]">
              <strong className="text-gray-700 font-semibold">Contact us:</strong> +011 455-999-00 |{' '}
              <a href="mailto:placement@gtbit.ac.in" className="text-[#0b57d0] hover:underline">Email</a> |{' '}
              <a href="mailto:placement.gtbit@gmail.com" className="text-[#0b57d0] hover:underline">Gmail</a>
            </p>

            <p className="text-[13px]">
              <strong className="text-gray-700 font-semibold">Location:</strong>{' '}
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-[#0b57d0] hover:underline">Google Maps</a>
            </p>
          </div>
        </div>
      );
    }

    // Default general email body with autolinked text
    return (
      <div className="mt-4 text-[14px] leading-relaxed text-[#1f1f1f] whitespace-pre-line font-sans max-w-3xl">
        {content}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto select-text">
      {/* 1. Top action toolbar */}
      <div className="h-12 px-4 border-b border-[#f1f3f4] flex items-center justify-between shrink-0 bg-white select-none">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-[#444746]">
          <button
            onClick={onBack}
            title="Back to Inbox"
            className="p-2 rounded-full hover:bg-black/5 active:bg-black/10 text-[#444746] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

          <button
            onClick={() => onArchive && onArchive(email.id)}
            title="Archive"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
          >
            <Archive className="w-5 h-5" />
          </button>

          <button
            title="Report spam"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
          >
            <OctagonAlert className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete && onDelete(email.id)}
            title="Delete"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="h-5 w-[1px] bg-gray-200 mx-1 hidden sm:block" />

          <button
            title="Mark as unread"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
          >
            <Mail className="w-5 h-5" />
          </button>

          <button
            title="Snooze"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors hidden sm:block"
          >
            <Clock className="w-5 h-5" />
          </button>

          <button
            title="Move to"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors hidden sm:block"
          >
            <FolderInput className="w-5 h-5" />
          </button>

          <button
            title="Labels"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors hidden sm:block"
          >
            <Tag className="w-5 h-5" />
          </button>

          <button
            title="More"
            className="p-2 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Right Pagination Group */}
        <div className="flex items-center gap-2 sm:gap-3 text-[12px] text-[#444746]">
          <span>{currentIndex} of {totalEmails}</span>
          <div className="flex items-center">
            <button 
              onClick={onPrev}
              disabled={currentIndex <= 1}
              title="Newer" 
              className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={onNext}
              disabled={currentIndex >= totalEmails}
              title="Older" 
              className="p-1.5 rounded-full hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-default"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Email Subject Header Bar */}
      <div className="px-6 pt-5 pb-3 flex items-start justify-between gap-4 border-b border-transparent">
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          <h1 className="text-[20px] font-normal text-[#1f1f1f] leading-snug tracking-tight">
            {email.subject}
          </h1>

          {/* Inbox Tag Badge with close 'x' */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-[#dddedf] hover:bg-[#d0d1d2] text-[#3c4043] rounded cursor-pointer transition-colors select-none">
            Inbox
            <X className="w-3 h-3 hover:text-black" />
          </span>
        </div>

        {/* Action icons right */}
        <div className="flex items-center gap-1 text-[#444746] shrink-0">
          <button 
            onClick={() => window.print()} 
            title="Print all" 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button 
            title="In new window" 
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Sender Metadata Row */}
      <div className="px-6 py-2">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar + Sender Name + Email + to dropdown */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Sender Avatar */}
            {isGtbit ? (
              <div className="w-10 h-10 rounded-full bg-[#fef7e0] border border-[#f9ab00]/40 flex items-center justify-center shrink-0 shadow-xs overflow-hidden mt-0.5">
                <div className="w-8 h-8 rounded-full border border-[#f9ab00] bg-white flex flex-col items-center justify-center text-[7px] font-bold text-[#b06000] text-center leading-none">
                  <span className="text-[10px]">🏛️</span>
                  <span>GTBIT</span>
                </div>
              </div>
            ) : isVercel ? (
              <div className="w-10 h-10 rounded-full bg-[#f1f3f4] text-gray-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base text-white shrink-0 mt-0.5 ${getAvatarColor(email.sender)}`}>
                {email.sender ? email.sender.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            {/* Sender text & dropdown */}
            <div className="min-w-0">
              <div className="flex items-baseline flex-wrap">
                <span className="font-semibold text-[14px] text-[#1f1f1f]">
                  {email.sender}
                </span>

                {/* SENDER EMAIL: prominently displayed where mail came from */}
                <span className="text-[12px] font-normal text-[#5f6368] ml-1.5 select-all">
                  &lt;{senderEmail}&gt;
                </span>
              </div>

              {/* Recipient line with 'to me ▾' dropdown */}
              <div className="relative mt-0.5">
                <button
                  onClick={() => setShowDetailsDropdown(!showDetailsDropdown)}
                  className="inline-flex items-center gap-1 text-[12px] text-[#5f6368] hover:bg-black/5 rounded px-1 -ml-1 py-0.5 transition-colors cursor-pointer select-none"
                  title="Show details"
                >
                  <span className="truncate max-w-[280px] sm:max-w-[480px]">
                    to {email.to ? email.to : 'me'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 text-[#5f6368]" />
                </button>

                {/* Gmail details popover dropdown */}
                {showDetailsDropdown && (
                  <div 
                    className="absolute left-0 top-full mt-1.5 w-84 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-40 text-[12px] text-[#1f1f1f] space-y-2 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setShowDetailsDropdown(false)}
                  >
                    <div className="grid grid-cols-[65px_1fr] gap-x-2.5 gap-y-1.5 leading-snug">
                      <span className="text-[#5f6368] text-right">from:</span>
                      <span className="font-medium text-[#1f1f1f] break-all">
                        <strong>{email.sender}</strong> &lt;{senderEmail}&gt;
                      </span>

                      <span className="text-[#5f6368] text-right">to:</span>
                      <span className="text-[#1f1f1f] break-all">{email.to || 'me'}</span>

                      {email.cc && (
                        <>
                          <span className="text-[#5f6368] text-right">cc:</span>
                          <span className="text-[#1f1f1f] break-all">{email.cc}</span>
                        </>
                      )}

                      {email.bcc && (
                        <>
                          <span className="text-[#5f6368] text-right">bcc:</span>
                          <span className="text-[#1f1f1f] break-all">{email.bcc}</span>
                        </>
                      )}

                      <span className="text-[#5f6368] text-right">date:</span>
                      <span className="text-[#1f1f1f]">{fullFormattedDate}</span>

                      <span className="text-[#5f6368] text-right">subject:</span>
                      <span className="text-[#1f1f1f] font-medium">{email.subject}</span>

                      <span className="text-[#5f6368] text-right">security:</span>
                      <span className="text-[#1f1f1f] flex items-center gap-1 text-[11px] text-emerald-700">
                        <span>🔒</span> Standard encryption (TLS)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Date, Paperclip, Star, Smile, Reply, More */}
          <div className="flex items-center gap-1 text-[#5f6368] shrink-0 pt-0.5 select-none">
            {hasAttachments && (
              <span title="Has attachments">
                <Paperclip className="w-4 h-4 text-[#5f6368] -rotate-45 mr-1 hidden sm:inline-block" />
              </span>
            )}

            <span className="text-[12px] text-[#5f6368] mr-2 hidden md:inline-block">
              {displayDateWithRelative}
            </span>

            <button 
              onClick={() => onToggleStar && onToggleStar(email.id)}
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
              title={email.starred ? "Starred" : "Not starred"}
            >
              <Star className={`w-4 h-4 ${email.starred ? 'fill-[#f4b400] text-[#f4b400]' : 'text-gray-400 hover:text-gray-600'}`} />
            </button>

            <button 
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors" 
              title="Add reaction"
            >
              <Smile className="w-4 h-4 text-[#5f6368]" />
            </button>

            <button 
              onClick={onReply} 
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors" 
              title="Reply"
            >
              <Reply className="w-4 h-4 text-[#5f6368]" />
            </button>

            <button 
              className="p-1.5 rounded-full hover:bg-black/5 transition-colors" 
              title="More options"
            >
              <MoreVertical className="w-4 h-4 text-[#5f6368]" />
            </button>
          </div>
        </div>

        {/* 4. Email Body Content */}
        <div className="mt-6 mb-8 pl-1">
          {renderFormattedBody(email.body || email.snippet)}
        </div>

        {/* 5. Authentic Gmail Attachments Section */}
        {hasAttachments && (
          <div className="mt-8 pt-4">
            {/* Attachment Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[#444746] select-none">
                <span>{email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-[#5f6368]">
                  Scanned by Gmail
                  <Info className="w-3.5 h-3.5 text-[#5f6368]" />
                </span>
              </div>

              <div className="flex items-center gap-2 select-none">
                <button
                  onClick={handleDownloadAll}
                  title="Download all attachments"
                  className="p-1.5 rounded-full hover:bg-black/5 text-[#444746] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setToastMessage('Attachments saved to Google Drive');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  title="Add all to Drive"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-black/5 text-[12.5px] text-[#444746] font-medium transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 87.3 78" fill="none">
                    <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
                    <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z" fill="#00AC47"/>
                    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l6.1 10.55 7.65 13.25z" fill="#EA4335"/>
                    <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.4-4.5 1.2l13.75 23.8z" fill="#00832D"/>
                    <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L59.8 53z" fill="#2684FC"/>
                    <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" fill="#FFBA00"/>
                  </svg>
                  <span>Add all to Drive</span>
                </button>
              </div>
            </div>

            {/* Attachment Cards Grid */}
            <div className="flex flex-wrap gap-3.5 mt-4">
              {email.attachments.map((file, idx) => {
                const name = file.name || 'document';
                const lower = name.toLowerCase();
                const isSpreadsheet = lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv') || file.type?.includes('sheet') || file.type?.includes('excel');
                const isPdf = lower.endsWith('.pdf') || file.type?.includes('pdf');
                const isImage = file.type?.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(lower);

                return (
                  <div
                    key={file.id || idx}
                    onClick={() => downloadAttachment(file)}
                    className="w-[200px] h-[178px] rounded-lg border border-[#e0e2e6] bg-white overflow-hidden shadow-xs hover:shadow-md transition-all group/card relative flex flex-col cursor-pointer select-none"
                    title={`Click to download ${name}`}
                  >
                    {/* Top Preview Area (120px) */}
                    <div className="h-[120px] bg-[#f8fafd] border-b border-[#f1f3f4] relative overflow-hidden flex items-center justify-center">
                      {isSpreadsheet ? (
                        /* Miniature Excel / Spreadsheet Grid Preview matching screenshot */
                        <div className="w-full h-full bg-white p-2 flex flex-col justify-start select-none overflow-hidden font-mono">
                          <div className="flex border-b border-[#dadce0] text-[7.5px] text-gray-500 pb-0.5 bg-[#f8fafd]">
                            <span className="w-3.5 border-r border-[#dadce0] text-center">#</span>
                            <span className="w-16 px-1 border-r border-[#dadce0] truncate">Test Link</span>
                            <span className="w-16 px-1 border-r border-[#dadce0] truncate">Applicant</span>
                            <span className="w-10 px-1 truncate">Status</span>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((r) => (
                            <div key={r} className="flex border-b border-[#f1f3f4] text-[7px] text-gray-600 py-0.5">
                              <span className="w-3.5 border-r border-[#f1f3f4] text-center text-gray-400">{r}</span>
                              <span className="w-16 px-1 border-r border-[#f1f3f4] truncate text-blue-600">https://consultadd...</span>
                              <span className="w-16 px-1 border-r border-[#f1f3f4] truncate text-gray-800 font-medium">Candidate_{r}</span>
                              <span className="w-10 px-1 truncate text-emerald-600 font-semibold">Slot {r}</span>
                            </div>
                          ))}
                        </div>
                      ) : isPdf ? (
                        /* Miniature PDF Document Preview */
                        <div className="w-full h-full bg-white p-3 flex flex-col justify-start select-none shadow-xs overflow-hidden">
                          <div className="h-2 w-3/4 bg-red-400/80 rounded-xs mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-gray-200 rounded-xs"></div>
                            <div className="h-1.5 w-5/6 bg-gray-200 rounded-xs"></div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-xs"></div>
                            <div className="h-1.5 w-4/5 bg-gray-200 rounded-xs"></div>
                          </div>
                          <div className="mt-2.5 space-y-1">
                            <div className="h-1.5 w-full bg-gray-200 rounded-xs"></div>
                            <div className="h-1.5 w-2/3 bg-gray-200 rounded-xs"></div>
                          </div>
                        </div>
                      ) : isImage && (file.dataUrl || file.url) ? (
                        <img src={file.dataUrl || file.url} alt={name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white p-3 flex flex-col justify-start select-none shadow-xs overflow-hidden">
                          <div className="h-2 w-1/2 bg-blue-400/80 rounded-xs mb-2"></div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full bg-gray-200 rounded-xs"></div>
                            <div className="h-1.5 w-5/6 bg-gray-200 rounded-xs"></div>
                          </div>
                        </div>
                      )}

                      {/* Hover Overlay with Action Buttons */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAttachment(file);
                          }}
                          title="Download"
                          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <Download className="w-4 h-4 text-gray-700" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setToastMessage(`Saved ${name} to Google Drive`);
                            setTimeout(() => setToastMessage(null), 3000);
                          }}
                          title="Add to Drive"
                          className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 87.3 78" fill="none">
                            <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066DA"/>
                            <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z" fill="#00AC47"/>
                            <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l6.1 10.55 7.65 13.25z" fill="#EA4335"/>
                            <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.4-4.5 1.2l13.75 23.8z" fill="#00832D"/>
                            <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L59.8 53z" fill="#2684FC"/>
                            <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.5c0-1.55-.4-3.1-1.2-4.5l-12.7-22z" fill="#FFBA00"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Caption Bar (58px) matching screenshot */}
                    <div className="h-[58px] px-3 py-2 bg-white flex items-center justify-between border-t border-[#f1f3f4]">
                      <div className="flex items-center gap-2.5 min-w-0 pr-1">
                        {/* Authentic Colored Badge matching Gmail */}
                        {isSpreadsheet ? (
                          <div className="w-6 h-7 rounded-[3px] bg-[#107c41] flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#0e6335] rounded-bl-[2px]" />
                            <FileSpreadsheet className="w-4 h-4 text-white" />
                          </div>
                        ) : isPdf ? (
                          <div className="w-6 h-7 rounded-[3px] bg-[#ea4335] flex items-center justify-center shrink-0 shadow-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#c5221f] rounded-bl-[2px]" />
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                        ) : isImage ? (
                          <div className="w-6 h-7 rounded-[3px] bg-[#e37400] flex items-center justify-center shrink-0 shadow-xs">
                            <ImageIcon className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <div className="w-6 h-7 rounded-[3px] bg-[#1a73e8] flex items-center justify-center shrink-0 shadow-xs">
                            <File className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Truncated Name & Size */}
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-medium text-[#1f1f1f] truncate leading-tight" title={name}>
                            {name}
                          </p>
                          <p className="text-[11px] text-[#5f6368] mt-0.5 leading-none">
                            {file.size || '142 KB'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAttachment(file);
                        }}
                        className="p-1 rounded-full hover:bg-black/5 text-[#5f6368] hover:text-[#0b57d0] transition-colors shrink-0"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Bottom Action Pills matching screenshot */}
        <div className="mt-8 pt-4 pb-12 flex items-center gap-2.5 flex-wrap select-none">
          <button 
            onClick={onReply}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#747775]/50 hover:bg-[#f2f6fc] text-[#444746] font-medium text-[14px] transition-colors"
          >
            <Reply className="w-4 h-4 text-[#444746]" />
            <span>Reply</span>
          </button>

          <button 
            onClick={onReply}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#747775]/50 hover:bg-[#f2f6fc] text-[#444746] font-medium text-[14px] transition-colors"
          >
            <ReplyAll className="w-4 h-4 text-[#444746]" />
            <span>Reply all</span>
          </button>

          <button 
            onClick={onForward}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#747775]/50 hover:bg-[#f2f6fc] text-[#444746] font-medium text-[14px] transition-colors"
          >
            <Forward className="w-4 h-4 text-[#444746]" />
            <span>Forward</span>
          </button>

          <button 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#747775]/50 hover:bg-[#f2f6fc] text-[#444746] transition-colors"
            title="Add reaction"
          >
            <Smile className="w-4 h-4 text-[#444746]" />
          </button>
        </div>
      </div>

      {/* Floating mini toast if user performs an action */}
      {toastMessage && (
        <div className="fixed bottom-6 left-8 z-50 bg-[#202124] text-white text-[13px] px-4 py-2.5 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
