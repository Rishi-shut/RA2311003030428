import React, { useState, useEffect } from 'react';
import Log from '../../../logging_middleware/logger';
import { fetchNotifications } from '../services/api';
import { getTopNotifications } from '../utils/priority';
import NotificationList from '../components/NotificationList';

function Home() {
  // State management
  const [notifications, setNotifications] = useState([]);
  const [topNotifications, setTopNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all notifications (API does not require params according to docs)
        const data = await fetchNotifications();
        
        // Ensure we are working with an array (handling potential API wrapper objects)
        const notifArray = Array.isArray(data) ? data : (data.notifications || data.data || []);
        
        // Set states
        setNotifications(notifArray);
        setTopNotifications(getTopNotifications(notifArray)); // Process top 10 using our utility
        
        // Log success
        Log('frontend', 'info', 'page', 'Home loaded notifications');
      } catch (err) {
        setError(err.message || 'Failed to load notifications from the server.');
        // Log failure
        Log('frontend', 'error', 'page', 'Home failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Simple inline styles to keep the structure clean without extra CSS files
  const containerStyle = { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' };
  const headerStyle = { textAlign: 'center', marginBottom: '40px', color: '#333' };
  const sectionHeaderStyle = { borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#555' };
  const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '8px', textAlign: 'center' };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Campus Notification System</h1>
      
      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <h2>Loading notifications...</h2>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={errorStyle}>
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>Make sure your backend server is running and the token is valid.</p>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && (
        <>
          <section style={{ marginBottom: '50px' }}>
            <h2 style={sectionHeaderStyle}>🔥 Top Priority</h2>
            <NotificationList notifications={topNotifications} />
          </section>

          <section>
            <h2 style={sectionHeaderStyle}>📥 All Notifications</h2>
            <NotificationList notifications={notifications} />
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
