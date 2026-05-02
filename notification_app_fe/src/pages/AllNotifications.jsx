import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Button, CircularProgress, Alert, Stack, Paper } from '@mui/material';
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
        setError(err.message || 'Failed to connect to the notification server.');
        Log('frontend', 'error', 'page', 'AllNotifications failed to load');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, filterType]);

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPage(1); // Reset to first page
    Log('frontend', 'info', 'page', `User filtered by ${e.target.value || 'All'}`);
  };

  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        📥 All Notifications
      </Typography>

      {/* Controls Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eaeaea', borderRadius: 2 }}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter Category</InputLabel>
          <Select value={filterType} label="Filter Category" onChange={handleFilterChange}>
            <MenuItem value=""><em>All Types</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
          </Select>
        </FormControl>
        
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <Typography fontWeight="bold" color="text.secondary">Page {page}</Typography>
          <Button variant="outlined" disabled={notifications.length < ITEMS_PER_PAGE} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </Stack>
      </Paper>

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
        <NotificationList notifications={notifications} />
      )}
    </Box>
  );
}

export default AllNotifications;
