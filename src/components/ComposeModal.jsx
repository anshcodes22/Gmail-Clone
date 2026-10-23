import React, { useState, useEffect } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Paperclip, 
  Link2, 
  Smile, 
  Image as ImageIcon, 
  Lock, 
  Trash2, 
  ChevronDown 
} from 'lucide-react';

export default function ComposeModal({ 
  isOpen, 
  onClose, 
  onSend,
  initialCategory = 'primary'
}) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
      setErrorMessage('');
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!to.trim()) {
      setErrorMessage('Please specify at least one recipient.');
      return;
    }

    setErrorMessage('');
    onSend({
      sender: 'Me',
      to: to.trim(),
      subject: subject.trim() || '(no subject)',
      snippet: body.trim() ? `- ${body.trim().slice(0, 60)}...` : '- (no content)',
      body: body.trim() || 'No message content.',
      time: 'Just now',
      unread: false,
      starred: false,
      selected: false,
      hasCalendar: false,
      hasUnsubscribe: false,
      category: category || 'primary',
      folder: 'sent'
    });

    setTo('');
    setSubject('');
    setBody('');
    onClose();
  };

  return (
    <div
      className={`fixed z-50 bg-white rounded-t-xl shadow-2xl border border-gray-300 flex flex-col transition-all duration-200 ${
        isMaximized
          ? 'inset-6 sm:inset-12 w-auto h-auto rounded-xl'
          : isMinimized
          ? 'bottom-0 right-4 sm:right-12 w-72 h-10 overflow-hidden'
          : 'bottom-0 right-2 sm:right-12 w-[95vw] sm:w-[540px] h-[480px] max-h-[85vh]'
      }`}
    >
      {/* Header */}
      <div 
        className="h-10 bg-[#f2f6fc] px-4 rounded-t-xl flex items-center justify-between cursor-pointer select-none border-b border-gray-200"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <span className="text-[14px] font-semibold text-[#1f1f1f]">
          New Message
        </span>
        <div className="flex items-center gap-1 text-[#444746]" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-black/10 rounded"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {!isMinimized && (
            <button 
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 hover:bg-black/10 rounded"
              title={isMaximized ? "Exit full screen" : "Full screen"}
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded"
            title="Save & close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      {!isMinimized && (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col">
            {/* Error Message banner */}
            {errorMessage && (
              <div className="bg-red-50 text-red-700 text-xs px-4 py-1.5 border-b border-red-200 flex items-center justify-between">
                <span>{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage('')} className="font-bold">×</button>
              </div>
            )}

            {/* Recipients */}
            <div className="flex items-center border-b border-gray-100 px-4 py-1.5">
              <span className="text-sm text-gray-500 w-12">To</span>
              <input 
                type="text" 
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Recipients"
                className="flex-1 text-sm outline-none text-[#1f1f1f]"
                autoFocus
              />
            </div>

            {/* Subject */}
            <div className="flex items-center border-b border-gray-100 px-4 py-1.5">
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full text-sm outline-none text-[#1f1f1f]"
              />
            </div>

            {/* Category selection pill */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-1 text-xs text-[#5f6368] bg-[#fafbfd]">
              <span>Category:</span>
              {['primary', 'promotions', 'social', 'updates'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2 py-0.5 rounded-full capitalize transition-colors ${
                    category === cat
                      ? 'bg-[#d3e3fd] text-[#041e49] font-semibold'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Message Body */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder=""
              className="p-4 text-sm outline-none resize-none flex-1 min-h-[190px] text-[#1f1f1f]"
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="p-3 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-1">
              {/* Send button group */}
              <div className="inline-flex rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white transition-colors overflow-hidden">
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold tracking-wide"
                >
                  Send
                </button>
                <button 
                  type="button"
                  title="More send options"
                  className="px-2 border-l border-blue-400 hover:bg-blue-800 flex items-center"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Action tools */}
              <div className="flex items-center gap-1 text-[#444746] ml-2">
                <button type="button" title="Attach files" className="p-2 rounded-full hover:bg-gray-100">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button type="button" title="Insert link" className="p-2 rounded-full hover:bg-gray-100">
                  <Link2 className="w-4 h-4" />
                </button>
                <button type="button" title="Insert emoji" className="p-2 rounded-full hover:bg-gray-100">
                  <Smile className="w-4 h-4" />
                </button>
                <button type="button" title="Insert photo" className="p-2 rounded-full hover:bg-gray-100">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button type="button" title="Confidential mode" className="p-2 rounded-full hover:bg-gray-100">
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              type="button" 
              onClick={() => {
                setTo('');
                setSubject('');
                setBody('');
                onClose();
              }}
              title="Discard draft" 
              className="p-2 text-[#444746] hover:bg-gray-100 rounded-full"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
