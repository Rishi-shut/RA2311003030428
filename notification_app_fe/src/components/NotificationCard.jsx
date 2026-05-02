import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Badge } from '@mui/material';
import Log from '../../../logging_middleware/logger';

const NotificationCard = ({ notification }) => {
  const [isRead, setIsRead] = useState(false);

  if (!notification) return null;

  // Map API fields safely
  const type = notification.type || notification.notification_type || notification.Type || 'Unknown';
  const message = notification.message || notification.Message;
  const timestamp = notification.timestamp || notification.Timestamp;

  const formattedDate = timestamp 
    ? new Date(timestamp).toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }) 
    : 'Unknown time';

  const getBadgeColor = (category) => {
    switch (category.toLowerCase()) {
      case 'placement': return 'success'; 
      case 'event': return 'primary'; 
      case 'result': return 'warning'; 
      default: return 'default'; 
    }
  };

  const handleCardClick = () => {
    if (!isRead) {
      setIsRead(true);
      Log('frontend', 'info', 'component', 'User read notification');
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      elevation={0}
      sx={{ 
        cursor: 'pointer',
        mb: 2,
        transition: 'all 0.2s',
        opacity: isRead ? 0.65 : 1,
        border: '1px solid #eaeaea',
        borderLeft: isRead ? '1px solid #eaeaea' : '5px solid #f44336',
        backgroundColor: isRead ? '#fafafa' : '#ffffff',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            {!isRead && <Badge color="error" variant="dot" invisible={false} />}
            <Chip 
              label={type} 
              color={getBadgeColor(type)} 
              size="small" 
              sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 }} 
            />
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            {formattedDate}
          </Typography>
        </Box>
        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
