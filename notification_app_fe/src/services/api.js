import Log from '../../../logging_middleware/logger';

// Retrieve configuration from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Remove any accidental quotes from the token, just like we do in the logger
const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN?.replace(/^["']|["']$/g, '');

/**
 * Fetch notifications from the backend API.
 * 
 * @param {Object} params - The query parameters for the request
 * @param {number} [params.limit=10] - Number of notifications to return
 * @param {number} [params.page=1] - Page number for pagination
 * @param {string} [params.notification_type] - Filter by specific notification type
 * @returns {Promise<Object>} API response containing the notifications
 */
export const fetchNotifications = async ({ limit = 10, page = 1, notification_type } = {}) => {
  try {
    // 1. Build the query parameters dynamically
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
    });
    
    if (notification_type) {
      queryParams.append('notification_type', notification_type);
    }

    // 2. Construct the full URL
    const url = `${API_BASE_URL}/notifications?${queryParams.toString()}`;

    // 3. Make the API request with the Authorization token
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // 4. Log the success using our reusable logging middleware
    Log('frontend', 'info', 'api', `Successfully fetched notifications for page ${page}.`);

    return data;

  } catch (error) {
    // 5. Log the error using our reusable logging middleware
    Log('frontend', 'error', 'api', `Failed to fetch notifications: ${error.message}`);
    
    // Re-throw the error so the UI component can catch it and show a user-friendly error message
    throw error;
  }
};
