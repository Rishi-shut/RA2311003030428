import Log from '../../../logging_middleware/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN?.replace(/^["']|["']$/g, '');

/**
 * Fetch notifications from the backend API.
 * Safely constructs query parameters if they are provided.
 */
export const fetchNotifications = async ({ limit, page, notification_type } = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Only attach params if they exist
    if (limit) queryParams.append('limit', limit.toString());
    if (page) queryParams.append('page', page.toString());
    if (notification_type) queryParams.append('notification_type', notification_type);

    const queryString = queryParams.toString();
    const targetUrl = queryString 
      ? `${API_BASE_URL}/notifications?${queryString}` 
      : `${API_BASE_URL}/notifications`;

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    Log('frontend', 'info', 'api', 'Notifications fetched successfully');
    
    return data;

  } catch (error) {
    Log('frontend', 'error', 'api', 'API fetch failed');
    throw error;
  }
};
