import React, { useState, useEffect } from 'react';
import { 
  X, 
  Paperclip, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  File, 
  Upload, 
  Check, 
  Star,
  Clock,
  Inbox,
  Bookmark,
  Users
} from 'lucide-react';
import { parseEmailDate } from '../utils/dateUtils';

export default function AddMailModal({ 
  isOpen, 
  onClose, 
  onAddEmail, 
  activeCategory = 'primary',
  defaultReceiver = 'ansh.puri@gmail.com'
}) {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState(defaultReceiver);
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(activeCategory);
  const [dateType, setDateType] = useState('today'); // 'today', 'yesterday', 'oct18', 'oct17', 'custom'
  const [customDate, setCustomDate] = useState('2026-10-19');
  const [customTime, setCustomTime] = useState('1:08 PM');
  const [formattedDate, setFormattedDate] = useState('1:08 PM');
  const [body, setBody] = useState('');
  const [isUnread, setIsUnread] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [hasCalendar, setHasCalendar] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategory(activeCategory);
      setErrorMessage('');
      if (defaultReceiver) {
        setReceiverEmail(defaultReceiver);
      }
    }
  }, [isOpen, activeCategory, defaultReceiver]);

  if (!isOpen) return null;

  // Handle Preset Dates
  const handleDatePreset = (preset) => {
    setDateType(preset);
    if (preset === 'today') {
      setFormattedDate('1:08 PM');
    } else if (preset === 'yesterday') {
      setFormattedDate('Yesterday');
    } else if (preset === 'oct18') {
      setFormattedDate('Oct 18');
    } else if (preset === 'oct17') {
      setFormattedDate('Oct 17');
    }
  };

  // When calendar date picker changes
  const handleCustomDateChange = (val) => {
    setCustomDate(val);
    setDateType('custom');
    if (!val) return;
    try {
      const parts = val.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        setFormattedDate(`${months[mIdx]} ${day}`);
      } else {
        setFormattedDate(val);
      }
    } catch {
      setFormattedDate(val);
    }
  };

  // Handle real file uploads (PDFs, Images, Documents)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const sizeKB = (file.size / 1024).toFixed(1);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target.result;
        const newAttachment = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: displaySize,
          type: file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream'),
          url: dataUrl,
          dataUrl: dataUrl
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddSampleAttachment = (name, size, type) => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        name,
        size,
        type
      }
    ]);
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!senderName.trim()) {
      setErrorMessage('Please enter the Sender Name (who sent the email).');
      return;
    }
    if (!receiverEmail.trim()) {
      setErrorMessage('Please enter the Receiver Email (To).');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('Please enter an Email Subject.');
      return;
    }

    const emailTime = formattedDate || customTime || 'Oct 18';
    const sName = senderName.trim();
    const sEmail = senderEmail.trim() || `${sName.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`;

    // Compute exact timestamp for chronological ordering
    let timestamp = 0;
    if (dateType === 'custom' && customDate) {
      timestamp = new Date(`${customDate}T12:00:00`).getTime();
    } else {
      timestamp = parseEmailDate(emailTime);
    }

    onAddEmail({
      sender: sName,
      senderEmail: sEmail,
      to: receiverEmail.trim(),
      cc: showCc && ccEmail.trim() ? ccEmail.trim() : null,
      bcc: showBcc && bccEmail.trim() ? bccEmail.trim() : null,
      subject: subject.trim(),
      snippet: body.trim() ? `- ${body.trim().slice(0, 70)}...` : '- (no message content)',
      body: body.trim() || 'No message content provided.',
      time: emailTime,
      timestamp: timestamp,
      unread: isUnread,
      starred: isStarred,
      isImportant: isImportant,
      hasCalendar: hasCalendar,
      hasUnsubscribe: false,
      category: category.toLowerCase(),
      attachments: attachments,
      folder: 'inbox'
    });

    // Reset and close
    setSenderName('');
    setSenderEmail('');
    setReceiverEmail(defaultReceiver);
    setCcEmail('');
    setBccEmail('');
    setShowCc(false);
    setShowBcc(false);
    setSubject('');
    setBody('');
    setAttachments([]);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="bg-[#f2f6fc] px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2 text-[#1f1f1f]">
            <Inbox className="w-5 h-5 text-[#0b57d0]" />
            <h2 className="text-lg font-semibold tracking-tight">
              Add Mail (Receive Incoming Email)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium flex items-center justify-between">
              <span>{errorMessage}</span>
              <button type="button" onClick={() => setErrorMessage('')} className="font-bold ml-2">×</button>
            </div>
          )}

          {/* Quick Sender Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Quick Senders
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Team AccioJob', email: 'placements@acciojob.com' },
                { name: 'Zoom', email: 'no-reply@zoom.us' },
                { name: 'Google Careers', email: 'campus-recruiting@google.com' },
                { name: 'ISP Team from Inter.', email: 'student-partner@internshala.com' },
                { name: 'Prof. R.K. Sharma', email: 'rksharma@gtbit.ac.in' },
                { name: 'GitHub', email: 'notifications@github.com' }
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setSenderName(preset.name);
                    setSenderEmail(preset.email);
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-full border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sender Details (From) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sender Name (From) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Team AccioJob, Zoom, Google"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sender Email
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. notifications@zoom.us"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
              />
            </div>
          </div>

          {/* Receiver Email (To) with Cc / Bcc options */}
          <div className="space-y-2 border border-gray-200 rounded-xl p-3.5 bg-gray-50/60">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#0b57d0]" />
                Receiver Email (To) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setShowCc(!showCc)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    showCc ? 'bg-[#0b57d0] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cc
                </button>
                <button
                  type="button"
                  onClick={() => setShowBcc(!showBcc)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    showBcc ? 'bg-[#0b57d0] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bcc
                </button>
              </div>
            </div>

            <input
              type="text"
              value={receiverEmail}
              onChange={(e) => setReceiverEmail(e.target.value)}
              placeholder="e.g. user@example.com, ansh.puri@gmail.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
              required
            />

            {/* Optional Cc input */}
            {showCc && (
              <div className="pt-1.5 animate-in fade-in duration-100">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Cc (Carbon Copy)
                </label>
                <input
                  type="text"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="e.g. team@gtbit.ac.in, mentor@acciojob.com"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
                />
              </div>
            )}

            {/* Optional Bcc input */}
            {showBcc && (
              <div className="pt-1.5 animate-in fade-in duration-100">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Bcc (Blind Carbon Copy)
                </label>
                <input
                  type="text"
                  value={bccEmail}
                  onChange={(e) => setBccEmail(e.target.value)}
                  placeholder="e.g. backup@example.com, personal-archive@gmail.com"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
                />
              </div>
            )}
          </div>

          {/* Date & Chronological Ordering Options */}
          <div className="bg-[#f8fafd] p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0b57d0]" />
                Email Date (Added in order of date)
              </label>
              <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Display: {formattedDate || customTime}
              </span>
            </div>

            {/* Date Preset Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'today', label: 'Today (1:08 PM)' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'oct18', label: 'Oct 18' },
                { id: 'oct17', label: 'Oct 17' },
                { id: 'custom', label: 'Calendar Picker' }
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleDatePreset(preset.id)}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
                    dateType === preset.id
                      ? 'bg-[#0b57d0] text-white shadow-xs'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Select Calendar Date
                </label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Or Custom Display Text
                </label>
                <input
                  type="text"
                  value={formattedDate}
                  onChange={(e) => setFormattedDate(e.target.value)}
                  placeholder="e.g. Oct 18, 1:08 PM, Sep 24"
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Status Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category / Tab
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0] bg-white capitalize"
              >
                <option value="primary">Primary</option>
                <option value="promotions">Promotions</option>
                <option value="social">Social</option>
                <option value="updates">Updates</option>
              </select>
            </div>

            {/* Checkboxes: Unread, Starred, Calendar, Important */}
            <div className="flex flex-wrap items-center gap-3.5 pt-5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnread}
                  onChange={(e) => setIsUnread(e.target.checked)}
                  className="rounded text-[#0b57d0] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Unread</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStarred}
                  onChange={(e) => setIsStarred(e.target.checked)}
                  className="rounded text-[#0b57d0] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Star</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Important</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCalendar}
                  onChange={(e) => setHasCalendar(e.target.checked)}
                  className="rounded text-[#0b57d0] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span>Calendar</span>
              </label>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. about your Guru Tegh Bahadur Institute of Technology - [GTBIT] placements"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0]"
              required
            />
          </div>

          {/* Attachments Section */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#0b57d0]" />
                Attachments ({attachments.length})
              </label>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf1fb] text-[#0b57d0] hover:bg-[#d3e3fd] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                Upload File(s)
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Sample Attachments */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
              <span className="text-gray-400">Add sample:</span>
              <button
                type="button"
                onClick={() => handleAddSampleAttachment('Placement_Report_GTBIT.pdf', '1.4 MB', 'application/pdf')}
                className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                + Placement_Report.pdf
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleAttachment('Webinar_Schedule.png', '820 KB', 'image/png')}
                className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                + Schedule.png
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleAttachment('Offer_Letter.docx', '340 KB', 'application/docx')}
                className="px-2 py-0.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                + Offer_Letter.docx
              </button>
            </div>

            {/* Attached items list */}
            {attachments.length > 0 ? (
              <div className="space-y-2 mt-2">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#f6f8fc] border border-gray-200 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {file.type.includes('image') ? (
                        <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : file.name.endsWith('.pdf') ? (
                        <FileText className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <File className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                      <span className="font-medium text-gray-800 truncate">{file.name}</span>
                      <span className="text-gray-400 shrink-0">({file.size})</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(file.id)}
                      className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No attachments added yet.</p>
            )}
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Body Content
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter message content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b57d0]/20 focus:border-[#0b57d0] min-h-[110px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0b57d0] hover:bg-[#0842a0] rounded-full shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Add Email in Date Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
