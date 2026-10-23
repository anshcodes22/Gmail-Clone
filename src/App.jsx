import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmailToolbar from './components/EmailToolbar';
import CategoryTabs from './components/CategoryTabs';
import EmailRow from './components/EmailRow';
import EmailDetail from './components/EmailDetail';
import ComposeModal from './components/ComposeModal';
import AddMailModal from './components/AddMailModal';
import { INITIAL_EMAILS } from './data/emails';
import { sortEmailsByDate, parseEmailDate } from './utils/dateUtils';
import { Pencil, X } from 'lucide-react';

export default function App() {
  // Emails State with LocalStorage Persistence so added emails never disappear on refresh
  const [emails, setEmails] = useState(() => {
    // Purge old storage versions containing manually added test emails
    try {
      localStorage.removeItem('gmail_emails');
      localStorage.removeItem('gmail_emails_v1');
      localStorage.removeItem('gmail_emails_v2');
      localStorage.removeItem('gmail_emails_v3');
      localStorage.removeItem('gmail_emails_v4');
      localStorage.removeItem('gmail_emails_v5');
    } catch (e) {}

    try {
      const saved = localStorage.getItem('gmail_emails_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortEmailsByDate(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading saved emails:', e);
    }
    return sortEmailsByDate(INITIAL_EMAILS);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState('inbox');
  const [activeCategoryTab, setActiveCategoryTab] = useState('primary');
  const [selectedEmailIds, setSelectedEmailIds] = useState(new Set());
  const [activeEmail, setActiveEmail] = useState(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const emailListRef = useRef(null);

  // Sync emails to localStorage (v6)
  useEffect(() => {
    try {
      localStorage.setItem('gmail_emails_v6', JSON.stringify(emails));
    } catch (e) {
      console.error('Error saving emails to localStorage:', e);
    }
  }, [emails]);

  // Profile / Current User State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gmail_user');
      return saved ? JSON.parse(saved) : { email: 'ansh.puri@gmail.com' };
    } catch {
      return { email: 'ansh.puri@gmail.com' };
    }
  });

  const handleLogin = (email, password) => {
    const user = { email: email.trim(), password };
    setCurrentUser(user);
    try {
      localStorage.setItem('gmail_user', JSON.stringify({ email: email.trim() }));
    } catch {}
    setToast({
      message: `Signed in as ${email.trim()}. Avatar updated with "${email.trim()[0].toUpperCase()}".`,
      actionLabel: null,
      onAction: null
    });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSignOut = () => {
    setCurrentUser({ email: '' });
    try {
      localStorage.removeItem('gmail_user');
    } catch {}
    setToast({
      message: 'Signed out of account.',
      actionLabel: null,
      onAction: null
    });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle Star
  const handleToggleStar = (id) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, starred: !email.starred } : email
      )
    );
    if (activeEmail && activeEmail.id === id) {
      setActiveEmail((prev) => ({ ...prev, starred: !prev.starred }));
    }
  };

  // Toggle Read / Unread
  const handleToggleRead = (id) => {
    setEmails((prev) =>
      prev.map((email) =>
        email.id === id ? { ...email, unread: !email.unread } : email
      )
    );
  };

  // Toggle Selection
  const handleToggleSelect = (id) => {
    setSelectedEmailIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Delete Email
  const handleDeleteEmail = (id) => {
    setEmails((prev) => prev.filter((email) => email.id !== id));
    setSelectedEmailIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (activeEmail && activeEmail.id === id) {
      setActiveEmail(null);
    }
    setToast({
      message: 'Conversation moved to Trash.',
      actionLabel: null,
      onAction: null
    });
    setTimeout(() => setToast(null), 4000);
  };

  // Archive Email
  const handleArchiveEmail = (id) => {
    handleDeleteEmail(id);
  };

  // Filter Emails
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          email.sender?.toLowerCase().includes(q) ||
          email.subject?.toLowerCase().includes(q) ||
          email.snippet?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Folder filter
      if (currentFolder === 'starred') {
        return email.starred;
      }
      if (currentFolder === 'sent') {
        return email.sender === 'Me' || email.folder === 'sent';
      }
      if (currentFolder === 'snoozed') {
        return email.snoozed;
      }
      if (currentFolder === 'drafts') {
        return email.folder === 'drafts';
      }
      if (currentFolder === 'purchases') {
        return email.category === 'purchases' || email.isPurchase;
      }
      if (currentFolder === 'inbox') {
        // Tab filter within inbox - case insensitive comparison
        if (searchQuery.trim()) return true;
        const emailCat = (email.category || 'primary').toLowerCase();
        const activeCat = (activeCategoryTab || 'primary').toLowerCase();
        return emailCat === activeCat;
      }

      return true;
    });
  }, [emails, searchQuery, currentFolder, activeCategoryTab]);

  // Bulk Actions
  const handleSelectAll = () => {
    const allIds = new Set(filteredEmails.map((e) => e.id));
    setSelectedEmailIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedEmailIds(new Set());
  };

  const handleDeleteSelected = () => {
    setEmails((prev) => prev.filter((e) => !selectedEmailIds.has(e.id)));
    setSelectedEmailIds(new Set());
    setToast({
      message: `${selectedEmailIds.size} conversations moved to Trash.`,
      actionLabel: null,
      onAction: null
    });
    setTimeout(() => setToast(null), 4000);
  };

  const handleMarkAsReadSelected = () => {
    setEmails((prev) =>
      prev.map((e) =>
        selectedEmailIds.has(e.id) ? { ...e, unread: false } : e
      )
    );
    setSelectedEmailIds(new Set());
  };

  const handleArchiveSelected = () => {
    handleDeleteSelected();
  };

  // Handle Add Mail (Incoming Received Email)
  const handleAddReceivedEmail = (newEmail) => {
    const targetCategory = (newEmail.category || 'primary').toLowerCase();
    const timestamp = newEmail.timestamp || parseEmailDate(newEmail.time);

    const created = {
      ...newEmail,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: targetCategory,
      timestamp: timestamp,
      selected: false
    };

    // Insert in chronological date order (newest first)
    setEmails((prev) => sortEmailsByDate([created, ...prev]));

    // Clear search so it doesn't filter out the new email
    setSearchQuery('');

    // Switch to Inbox and active tab where email was added
    setCurrentFolder('inbox');
    setActiveCategoryTab(targetCategory);
    setActiveEmail(null);

    // Scroll to top of list
    setTimeout(() => {
      if (emailListRef.current) {
        emailListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);

    // Show toast with "View message"
    const attachCount = created.attachments && created.attachments.length;
    const attachMsg = attachCount > 0 ? ` with ${attachCount} attachment${attachCount > 1 ? 's' : ''}` : '';
    setToast({
      message: `Email received from ${created.sender}${attachMsg} (${created.time}).`,
      actionLabel: 'View message',
      onAction: () => {
        setActiveEmail(created);
        setToast(null);
      }
    });

    setTimeout(() => {
      setToast((current) => (current && current.message.startsWith('Email received') ? null : current));
    }, 6000);
  };

  // Reset emails back to original 200 mock emails
  const handleResetToDefaultEmails = () => {
    try {
      localStorage.removeItem('gmail_emails_v6');
      localStorage.removeItem('gmail_emails_v5');
      localStorage.removeItem('gmail_emails');
    } catch {}
    setEmails(sortEmailsByDate(INITIAL_EMAILS));
    setSelectedEmailIds(new Set());
    setActiveEmail(null);
    setToast({
      message: 'Reset to original 200 mock emails (October to July 3).',
      actionLabel: null,
      onAction: null
    });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Outgoing Compose Email
  const handleSendEmail = (newEmail) => {
    const targetCategory = (newEmail.category || 'primary').toLowerCase();
    const created = {
      ...newEmail,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: targetCategory,
      selected: false
    };
    
    setEmails((prev) => [created, ...prev]);

    // Clear search and ensure visibility
    setSearchQuery('');
    setCurrentFolder('inbox');
    setActiveCategoryTab(targetCategory);
    setActiveEmail(null);

    setTimeout(() => {
      if (emailListRef.current) {
        emailListRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);

    // Show toast with "View message"
    setToast({
      message: 'Message sent.',
      actionLabel: 'View message',
      onAction: () => {
        setActiveEmail(created);
        setToast(null);
      }
    });

    setTimeout(() => {
      setToast((current) => (current && current.message === 'Message sent.' ? null : current));
    }, 6000);
  };

  const handleEmailClick = (email) => {
    setActiveEmail(email);
    // Mark as read when clicked
    if (email.unread) {
      handleToggleRead(email.id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f6f8fc]">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleSidebar={() => {
          if (window.innerWidth < 768) {
            setIsMobileSidebarOpen(true);
          } else {
            setIsSidebarCollapsed(!isSidebarCollapsed);
          }
        }}
        sidebarExpanded={!isSidebarCollapsed}
        currentUser={currentUser}
        onLogin={handleLogin}
        onSignOut={handleSignOut}
      />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          currentFolder={currentFolder}
          setCurrentFolder={(folder) => {
            setCurrentFolder(folder);
            setActiveEmail(null);
          }}
          unreadCount={2368}
          draftsCount={3}
          purchasesCount={6}
          onOpenCompose={() => setIsComposeOpen(true)}
          onOpenAddMail={() => setIsAddMailOpen(true)}
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          setIsMobileOpen={setIsMobileSidebarOpen}
        />

        {/* Main Content Area (Rounded surface card) */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white sm:rounded-2xl sm:mr-3 sm:mb-3 shadow-[0_1px_3px_0_rgba(60,64,67,0.1),0_1px_2px_0_rgba(60,64,67,0.06)] border border-[#e0e3e7]/50">
          {activeEmail ? (
            /* Email Detail View */
            <EmailDetail
              email={activeEmail}
              onBack={() => setActiveEmail(null)}
              onToggleStar={handleToggleStar}
              onDelete={handleDeleteEmail}
              onArchive={handleArchiveEmail}
            />
          ) : (
            /* Email List View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <EmailToolbar
                selectedCount={selectedEmailIds.size}
                totalCount={filteredEmails.length}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onRefresh={() => {
                  setSelectedEmailIds(new Set());
                  setToast({
                    message: `Inbox refreshed. ${filteredEmails.length} emails shown.`,
                    actionLabel: null,
                    onAction: null
                  });
                  setTimeout(() => setToast(null), 3000);
                }}
                onDeleteSelected={handleDeleteSelected}
                onMarkAsReadSelected={handleMarkAsReadSelected}
                onArchiveSelected={handleArchiveSelected}
                onOpenAddMail={() => setIsAddMailOpen(true)}
                onResetEmails={handleResetToDefaultEmails}
              />

              {/* Category Tabs (Primary, Promotions, Social, Updates) */}
              {currentFolder === 'inbox' && !searchQuery.trim() && (
                <CategoryTabs
                  activeTab={activeCategoryTab}
                  setActiveTab={setActiveCategoryTab}
                />
              )}

              {/* Email List Rows */}
              <div 
                ref={emailListRef}
                className="flex-1 overflow-y-auto divide-y divide-gray-100 scroll-smooth"
              >
                {filteredEmails.length > 0 ? (
                  filteredEmails.map((email) => (
                    <EmailRow
                      key={email.id}
                      email={email}
                      isSelected={selectedEmailIds.has(email.id)}
                      onToggleSelect={handleToggleSelect}
                      onToggleStar={handleToggleStar}
                      onToggleRead={handleToggleRead}
                      onDelete={handleDeleteEmail}
                      onArchive={handleArchiveEmail}
                      onClick={() => handleEmailClick(email)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-[#5f6368]">
                    <p className="text-base font-medium">No messages found</p>
                    <p className="text-xs mt-1">There are no emails matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) on Mobile */}
      <button
        onClick={() => setIsAddMailOpen(true)}
        className="fixed bottom-6 right-6 md:hidden z-30 flex items-center gap-2 bg-[#c2e7ff] text-[#041e49] p-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
        title="Add Mail"
      >
        <Pencil className="w-6 h-6 text-[#041e49]" />
        <span className="font-semibold text-sm">Add Mail</span>
      </button>

      {/* Add Mail (Receive Email) Modal */}
      <AddMailModal
        isOpen={isAddMailOpen}
        onClose={() => setIsAddMailOpen(false)}
        onAddEmail={handleAddReceivedEmail}
        activeCategory={activeCategoryTab}
        defaultReceiver={currentUser?.email || 'ansh.puri@gmail.com'}
      />

      {/* Compose Outgoing Email Modal */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendEmail}
        initialCategory={activeCategoryTab}
      />

      {/* Gmail Toast Snackbar */}
      {toast && (
        <div className="fixed bottom-5 left-8 z-50 flex items-center gap-4 bg-[#202124] text-white text-[14px] px-4 py-3 rounded-lg shadow-xl select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toast.message}</span>
          {toast.actionLabel && (
            <button
              onClick={toast.onAction}
              className="text-[#8ab4f8] hover:text-[#aecbfa] font-semibold text-[13px] tracking-wide uppercase transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-white p-1 rounded-full ml-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
