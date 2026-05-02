/**
 * Defines the priority weight for each notification type.
 * Lower number = Higher priority.
 */
const PRIORITY_MAP = {
  'Placement': 1,
  'Event': 2,
  'Result': 3,
};

/**
 * Sorts notifications by priority (Placement > Event > Result)
 * and then by the newest timestamp. Returns the top 10.
 * 
 * @param {Array} notifications - The array of notification objects
 * @returns {Array} - The top 10 sorted notifications
 */
export const getTopNotifications = (notifications = []) => {
  if (!Array.isArray(notifications)) {
    return [];
  }

  // Create a copy so we don't mutate the original array
  const sorted = [...notifications].sort((a, b) => {
    // 1. Compare Priority
    // We assume the type is stored in either a.type, a.notification_type, or a.Type
    const typeA = a.type || a.notification_type || a.Type;
    const typeB = b.type || b.notification_type || b.Type;

    // Default to 99 (lowest priority) if it's an unknown type
    const priorityA = PRIORITY_MAP[typeA] || 99;
    const priorityB = PRIORITY_MAP[typeB] || 99;

    if (priorityA !== priorityB) {
      return priorityA - priorityB; // Ascending: 1 comes before 2
    }

    // 2. If priority is the same, compare timestamps (Newest First)
    // Fallback to 0 if no timestamp exists
    const timeA = new Date(a.timestamp || a.Timestamp || 0).getTime();
    const timeB = new Date(b.timestamp || b.Timestamp || 0).getTime();

    return timeB - timeA; // Descending: newer date comes first
  });

  // 3. Return only the top 10
  return sorted.slice(0, 10);
};
