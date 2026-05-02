import React from 'react';
import '../styles/Notification.css';

const NotificationCard = ({ notification }) => {
  if (!notification) return null;

  // We check both "type", "notification_type" and "Type" to be flexible with the API response
  const type = notification.type || notification.notification_type || notification.Type || 'Unknown';
  const message = notification.message || notification.Message;
  const timestamp = notification.timestamp || notification.Timestamp;

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

  return (
    <div className="notification-card">
      <div className="notification-header">
        <span 
          className="notification-type" 
          style={{ backgroundColor: getTypeColor(type) }}
        >
          {type}
        </span>
        <span className="notification-time">{formattedDate}</span>
      </div>
      <div className="notification-body">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
