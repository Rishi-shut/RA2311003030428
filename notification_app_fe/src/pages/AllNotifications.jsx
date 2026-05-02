import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, Button, CircularProgress, Alert, Stack, Fade } from '@mui/material';
import Log from '../../../logging_middleware/logger';
import { fetchNotifications } from '../services/api';
import NotificationList from '../components/NotificationList';

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState('');
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const rawData = await fetchNotifications({ limit: ITEMS_PER_PAGE, page, notification_type: filterType || undefined });
        const extractedList = Array.isArray(rawData) ? rawData : (rawData.notifications || rawData.data || []);
        
        setNotifications(extractedList);
        Log('frontend', 'info', 'page', `AllNotifications loaded page ${page}`);
      } catch (err) {
        setError(err.message || 'Failed to connect to the server.');
        Log('frontend', 'error', 'page', 'AllNotifications failed to load');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, filterType]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPage(1);
    Log('frontend', 'info', 'page', `Filtered by ${e.target.value || 'All'}`);
  };

  return (
    <Fade in={true} timeout={500}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={800} gutterBottom sx={{ mb: 4, letterSpacing: '-0.5px' }}>
          Inbox
        </Typography>

        {/* Clean, minimalist controls */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2, mb: 4 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select 
              displayEmpty
              value={filterType} 
              onChange={handleFilterChange}
              sx={{ bgcolor: '#fff', borderRadius: 2 }}
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              <MenuItem value="Placement">Placement</MenuItem>
              <MenuItem value="Event">Event</MenuItem>
              <MenuItem value="Result">Result</MenuItem>
            </Select>
          </FormControl>
          
          <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-end' }}>
            <Button variant="outlined" size="small" disabled={page === 1} onClick={() => setPage(p => p - 1)} sx={{ borderRadius: 2 }}>
              Prev
            </Button>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: '60px', textAlign: 'center' }}>
              Page {page}
            </Typography>
            <Button variant="outlined" size="small" disabled={notifications.length < ITEMS_PER_PAGE} onClick={() => setPage(p => p + 1)} sx={{ borderRadius: 2 }}>
              Next
            </Button>
          </Stack>
        </Box>

        {/* States */}
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
          <NotificationList notifications={notifications} />
        )}
      </Box>
    </Fade>
  );
}

export default AllNotifications;
