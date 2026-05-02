import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Fade } from '@mui/material';
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
        
        const rawData = await fetchNotifications({ limit: 10 });
        const extractedList = Array.isArray(rawData) ? rawData : (rawData.notifications || rawData.data || []);
        
        setTopNotifications(getTopNotifications(extractedList)); 
        Log('frontend', 'info', 'page', 'PriorityNotifications loaded');
      } catch (err) {
        setError(err.message || 'Failed to connect to the server.');
        Log('frontend', 'error', 'page', 'PriorityNotifications failed');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <Fade in={true} timeout={500}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={800} gutterBottom sx={{ mb: 1, letterSpacing: '-0.5px' }}>
          Top Priority
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The most important announcements you shouldn't miss.
        </Typography>

        {isLoading && (
          <Box display="flex" justifyContent="center" my={8}>
            <CircularProgress size={32} thickness={4} />
          </Box>
        )}

        {error && !isLoading && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && (
          <NotificationList notifications={topNotifications} />
        )}
      </Box>
    </Fade>
  );
}

export default PriorityNotifications;
