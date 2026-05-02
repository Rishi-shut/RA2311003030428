import React, { useState } from 'react';
import Log from '../../../logging_middleware/logger';
import '../styles/Notification.css';

const NotificationCard = ({ notification }) => {
  // Local state to track if this specific card has been seen
  const [isSeen, setIsSeen] = useState(false);

  if (!notification) return null;

  // We check both "type", "notification_type" and "Type" to be flexible with the API response
  const type = notification.type || notification.notification_type || notification.Type || 'Unknown';
  const message = notification.message || notification.Message;
  const timestamp = notification.timestamp || notification.Timestamp;
  const id = notification.id || notification.ID || 'unknown';

  // Format the date to be human readable
  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleString() 
    : 'Unknown time';

  // Determine a simple color code based on the notification type
  const getTypeColor = (typeString) => {
    switch (typeString.toLowerCase()) {
      case 'placement': return '#4CAF50'; // Green
      case 'event': return '#2196F3'; // Blue
      case 'result': return '#FF9800'; // Orange
      default: return '#757575'; // Grey
    }
  };

  // Mark as seen on click
  const handleCardClick = () => {
    if (!isSeen) {
      setIsSeen(true);
      // Optional: Log that a user interacted with a notification
      Log('frontend', 'info', 'component', 'User read notification');
    }
  };

  return (
    <div 
      className={`notification-card ${isSeen ? 'seen' : 'unseen'}`}
      onClick={handleCardClick}
    >
      <div className="notification-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Small visual red dot if it hasn't been seen yet */}
          {!isSeen && <span className="unseen-dot"></span>}
          <span 
            className="notification-type" 
            style={{ backgroundColor: getTypeColor(type) }}
          >
            {type}
          </span>
        </div>
        <span className="notification-time">{formattedDate}</span>
      </div>
      <div className="notification-body">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
