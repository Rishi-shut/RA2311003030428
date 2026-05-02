import React from 'react';
import NotificationCard from './NotificationCard';
import '../styles/Notification.css';

const NotificationList = ({ notifications = [] }) => {
  // Handle empty states gracefully
  if (!notifications || notifications.length === 0) {
    return (
      <div className="notification-list-empty">
        <p>No notifications available right now.</p>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map((notif, index) => (
        // It's best practice to use a unique ID for the key, but we fall back to index if missing
        <NotificationCard key={notif.id || index} notification={notif} />
      ))}
    </div>
  );
};

export default NotificationList;
