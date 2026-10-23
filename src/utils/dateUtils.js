/**
 * Parses various email date formats into timestamps for chronological ordering.
 * Supported formats:
 * - Time only (e.g. "1:08 PM", "11:30 AM") -> Assumed to be today
 * - "Yesterday" -> 1 day ago
 * - Month Day (e.g. "Oct 18", "Sep 24") -> Oct 18, 2026
 * - ISO / YYYY-MM-DD (e.g. "2026-10-18")
 */
export function parseEmailDate(timeStr, dateObj) {
  if (dateObj instanceof Date && !isNaN(dateObj.getTime())) {
    return dateObj.getTime();
  }
  if (!timeStr) return 0;
  
  // If it's a numeric timestamp or full date string like "2026-10-18"
  if (typeof timeStr === 'number') return timeStr;
  
  if (timeStr.includes('-') && !isNaN(Date.parse(timeStr))) {
    return new Date(timeStr).getTime();
  }

  // Base year 2026 matching system mock timeline
  const currentYear = 2026;
  const currentMonth = 9; // October (0-indexed)
  const todayDate = 19;   // Oct 19 base

  // Format: "1:08 PM", "12:45 PM", "9:05 AM" (Today)
  const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const timeMatch = timeStr.trim().match(timeRegex);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const meridiem = timeMatch[3].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return new Date(currentYear, currentMonth, todayDate, hours, minutes).getTime();
  }

  // Format: "Yesterday"
  if (timeStr.toLowerCase() === 'yesterday') {
    return new Date(currentYear, currentMonth, todayDate - 1, 12, 0).getTime();
  }

  // Format: "Oct 18", "Oct 17", "Sep 28", etc.
  const months = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  const parts = timeStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    const monthKey = parts[0].toLowerCase().slice(0, 3);
    const day = parseInt(parts[1], 10);
    if (months[monthKey] !== undefined && !isNaN(day)) {
      return new Date(currentYear, months[monthKey], day, 12, 0).getTime();
    }
  }

  // Fallback try native parse
  const fallback = Date.parse(timeStr);
  return isNaN(fallback) ? 0 : fallback;
}

/**
 * Sorts emails in descending chronological order (newest first).
 */
export function sortEmailsByDate(emails) {
  return [...emails].sort((a, b) => {
    const timeA = a.timestamp || parseEmailDate(a.time);
    const timeB = b.timestamp || parseEmailDate(b.time);
    return timeB - timeA;
  });
}
