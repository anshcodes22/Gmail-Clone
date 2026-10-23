import React from 'react';
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  Clock, 
  Star, 
  Reply, 
  MoreVertical, 
  Printer, 
  ExternalLink,
  Paperclip,
  Download,
  FileText,
  File,
  Image as ImageIcon
} from 'lucide-react';
import { downloadAttachment } from '../utils/attachmentUtils';

export default function EmailDetail({ 
  email, 
  onBack, 
  onToggleStar, 
  onDelete, 
  onArchive 
}) {
  if (!email) return null;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {/* Top action bar */}
      <div className="h-12 px-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            title="Back to Inbox"
            className="p-2 rounded-full hover:bg-gray-100 text-[#444746]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => onArchive(email.id)}
            title="Archive"
            className="p-2 rounded-full hover:bg-gray-100 text-[#444746]"
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(email.id)}
            title="Delete"
            className="p-2 rounded-full hover:bg-gray-100 text-[#444746]"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            title="Mark as unread"
            className="p-2 rounded-full hover:bg-gray-100 text-[#444746]"
          >
            <Mail className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1 text-[#444746]">
          <button title="Print" className="p-2 rounded-full hover:bg-gray-100">
            <Printer className="w-4 h-4" />
          </button>
          <button title="In new window" className="p-2 rounded-full hover:bg-gray-100">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Subject Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-medium text-[#1f1f1f]">
          {email.subject}
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onToggleStar(email.id)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Star 
              className={`w-5 h-5 ${
                email.starred ? 'fill-[#f4b400] text-[#f4b400]' : 'text-gray-400'
              }`} 
            />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-[#444746]">
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email Sender & Metadata */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg ${
              email.sender === 'Me' ? 'bg-[#00796b] text-white' : 'bg-blue-600 text-white'
            }`}>
              {email.sender.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[15px] text-[#1f1f1f]">
                  {email.sender}
                </span>
                <span className="text-xs text-[#5f6368]">
                  {email.sender === 'Me' 
                    ? '<user@example.com>' 
                    : `<notifications@${email.sender.toLowerCase().replace(/[^a-z]/g, '')}.com>`
                  }
                </span>
              </div>
              <div className="text-xs text-[#5f6368] space-y-0.5">
                <div>to {email.to ? email.to : 'me'}</div>
                {email.cc && <div className="text-gray-500">cc: <span className="text-gray-700">{email.cc}</span></div>}
                {email.bcc && <div className="text-gray-500">bcc: <span className="text-gray-700">{email.bcc}</span></div>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5f6368]">
            <span>{email.time}</span>
            <button className="p-1.5 rounded-full hover:bg-gray-100 text-[#444746]">
              <Reply className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full hover:bg-gray-100 text-[#444746]">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Body */}
        <div className="mt-6 text-[14px] leading-relaxed text-[#1f1f1f] whitespace-pre-line font-sans max-w-3xl">
          {email.body || email.snippet}
        </div>

        {/* Attachments Section */}
        {email.attachments && email.attachments.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Paperclip className="w-4 h-4 text-[#0b57d0]" />
              <span>{email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {email.attachments.map((file, idx) => {
                const isPdf = file.name?.toLowerCase().endsWith('.pdf') || file.type?.includes('pdf');
                const isImg = file.type?.includes('image') || /\.(png|jpe?g|gif|webp|svg)$/i.test(file.name || '');

                return (
                  <div
                    key={file.id || idx}
                    className="group/att border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-white flex flex-col"
                  >
                    {/* Preview Header / Thumbnail */}
                    <div 
                      onClick={() => downloadAttachment(file)}
                      className="h-28 bg-[#f8fafd] flex items-center justify-center border-b border-gray-100 relative overflow-hidden cursor-pointer group-hover/att:bg-[#f0f4f9] transition-colors"
                      title={`Click to download ${file.name}`}
                    >
                      {file.dataUrl || file.url ? (
                        isImg ? (
                          <img src={file.dataUrl || file.url} alt={file.name} className="w-full h-full object-cover" />
                        ) : isPdf ? (
                          <div className="flex flex-col items-center gap-1 text-red-500">
                            <FileText className="w-10 h-10" />
                            <span className="text-[11px] font-bold text-gray-500 uppercase">PDF</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-blue-500">
                            <File className="w-10 h-10" />
                            <span className="text-[11px] font-bold text-gray-500 uppercase">FILE</span>
                          </div>
                        )
                      ) : isPdf ? (
                        <div className="flex flex-col items-center gap-1 text-red-500">
                          <FileText className="w-10 h-10" />
                          <span className="text-[11px] font-bold text-gray-500 uppercase">PDF</span>
                        </div>
                      ) : isImg ? (
                        <div className="flex flex-col items-center gap-1 text-emerald-500">
                          <ImageIcon className="w-10 h-10" />
                          <span className="text-[11px] font-bold text-gray-500 uppercase">IMAGE</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-blue-500">
                          <File className="w-10 h-10" />
                          <span className="text-[11px] font-bold text-gray-500 uppercase">DOC</span>
                        </div>
                      )}

                      {/* Download Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/att:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="bg-white/90 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                          <Download className="w-3.5 h-3.5 text-[#0b57d0]" />
                          Download
                        </span>
                      </div>
                    </div>

                    {/* Attachment Info & Actions */}
                    <div className="p-3 flex items-center justify-between bg-white">
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-gray-800 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {file.size}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadAttachment(file);
                          }}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-[#0b57d0] transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reply / Forward action buttons */}
        <div className="mt-8 flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 text-[14px] font-medium text-[#444746]">
            <Reply className="w-4 h-4" />
            Reply
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-50 text-[14px] font-medium text-[#444746]">
            Forward
          </button>
        </div>
      </div>
    </div>
  );
}
