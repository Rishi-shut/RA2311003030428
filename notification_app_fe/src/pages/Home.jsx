import React, { useState, useEffect } from 'react';
import Log from '../../../logging_middleware/logger';
import { fetchNotifications } from '../services/api';
import { getTopNotifications } from '../utils/priority';
import NotificationList from '../components/NotificationList';

function Home() {
  // Data States
  const [notifications, setNotifications] = useState([]);
  const [topNotifications, setTopNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filtering States
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const limit = 10; // Items per page

  // Fetch data whenever page or filter changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Pass query params to the API service
        const data = await fetchNotifications({ 
          limit, 
          page, 
          notification_type: filterType || undefined 
        });
        
        // Ensure we are working with an array
        const notifArray = Array.isArray(data) ? data : (data.notifications || data.data || []);
        
        setNotifications(notifArray);
        setTopNotifications(getTopNotifications(notifArray)); 
        
        // Log success silently
        Log('frontend', 'info', 'page', `Home loaded page ${page}`);
      } catch (err) {
        setError(err.message || 'Failed to load notifications from the server.');
        Log('frontend', 'error', 'page', 'Home failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, filterType]); // Re-run effect when page or filter changes

  // Event Handlers for Controls
  const handleFilterChange = (e) => {
    const newValue = e.target.value;
    setFilterType(newValue);
    setPage(1); // Reset to first page when changing filters
    Log('frontend', 'info', 'page', `User filtered by ${newValue || 'All'}`);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      Log('frontend', 'info', 'page', `User clicked Previous Page`);
    }
  };

  const handleNextPage = () => {
    setPage(prev => prev + 1);
    Log('frontend', 'info', 'page', `User clicked Next Page`);
  };

  // Styles
  const containerStyle = { padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' };
  const headerStyle = { textAlign: 'center', marginBottom: '30px', color: '#333' };
  const sectionHeaderStyle = { borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#555' };
  const errorStyle = { backgroundColor: '#ffebee', color: '#c62828', padding: '16px', borderRadius: '8px', textAlign: 'center' };
  const controlsStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: '30px', 
    padding: '15px', 
    backgroundColor: '#f8f9fa', 
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Campus Notification System</h1>
      
      {/* Controls Section: Filtering & Pagination */}
      <div style={controlsStyle}>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#555' }}>Filter Category:</label>
          <select 
            value={filterType} 
            onChange={handleFilterChange}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Event">Event</option>
            <option value="Result">Result</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
            onClick={handlePrevPage} 
            disabled={page === 1}
            style={{ 
              padding: '8px 16px', 
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff'
            }}
          >
            Previous
          </button>
          <span style={{ fontWeight: 'bold', color: '#555' }}>Page {page}</span>
          <button 
            onClick={handleNextPage}
            disabled={notifications.length < limit} // Disable next if we didn't get a full page of results
            style={{ 
              padding: '8px 16px', 
              cursor: notifications.length < limit ? 'not-allowed' : 'pointer',
              opacity: notifications.length < limit ? 0.5 : 1,
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: '#fff'
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <h2>Loading page {page}...</h2>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div style={errorStyle}>
          <h3>Oops! Something went wrong.</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && (
        <>
          <section style={{ marginBottom: '50px' }}>
            <h2 style={sectionHeaderStyle}>🔥 Top Priority (Page {page})</h2>
            <NotificationList notifications={topNotifications} />
          </section>

          <section>
            <h2 style={sectionHeaderStyle}>📥 All Notifications (Page {page})</h2>
            <NotificationList notifications={notifications} />
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
