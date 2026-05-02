import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import Log from '../../../logging_middleware/logger';
import { fetchNotifications } from '../services/api';
import { getTopNotifications } from '../utils/priority';
import NotificationList from '../components/NotificationList';

function PriorityNotifications() {
  const [topNotifications, setTopNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the maximum allowed batch
        const rawData = await fetchNotifications({ limit: 10 });
        const extractedList = Array.isArray(rawData) ? rawData : (rawData.notifications || rawData.data || []);
        
        setTopNotifications(getTopNotifications(extractedList)); 
        Log('frontend', 'info', 'page', 'PriorityNotifications loaded');
      } catch (err) {
        setError(err.message || 'Failed to connect to the notification server.');
        Log('frontend', 'error', 'page', 'PriorityNotifications failed');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
        🔥 Top Priority Notifications
      </Typography>

      {/* States */}
      {isLoading && (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      )}

      {error && !isLoading && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {!isLoading && !error && (
        <NotificationList notifications={topNotifications} />
      )}
    </Box>
  );
}

export default PriorityNotifications;
