import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications = [] }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 5, textAlign: 'center', backgroundColor: '#fff', border: '1px dashed #ccc', borderRadius: 2 }}>
        <Typography color="text.secondary" variant="body1">
          No notifications available right now.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {notifications.map((notif, index) => (
        <NotificationCard key={notif.id || notif.ID || index} notification={notif} />
      ))}
    </Box>
  );
};

export default NotificationList;
