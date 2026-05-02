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
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      }) 
    : '';

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
        borderRadius: 3,
        border: '1px solid',
        borderColor: isRead ? 'transparent' : 'grey.200',
        backgroundColor: isRead ? '#f8f9fa' : '#ffffff',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'grey.300',
          backgroundColor: isRead ? '#f0f2f5' : '#fbfcfc',
        }
      }}
    >
      {/* Unread indicator bar */}
      {!isRead && (
        <Box 
          sx={{ 
            position: 'absolute', 
            left: -1, 
            top: 16, 
            bottom: 16, 
            width: 4, 
            bgcolor: 'error.main', 
            borderRadius: '0 4px 4px 0' 
          }} 
        />
      )}

      <CardContent sx={{ pb: '16px !important', pt: 2.5, px: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={type} 
              color={getBadgeColor(type)} 
              size="small" 
              variant={isRead ? "outlined" : "filled"}
              sx={{ fontWeight: 700, height: 24, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} 
            />
          </Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formattedDate}
          </Typography>
        </Box>
        <Typography 
          variant="body1" 
          color={isRead ? "text.secondary" : "text.primary"} 
          sx={{ lineHeight: 1.6, fontSize: '0.95rem' }}
        >
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
