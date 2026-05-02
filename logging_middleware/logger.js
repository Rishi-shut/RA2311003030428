/**
 * Reusable logging utility
 * 
 * @param {string} stack - The stack name, e.g., "frontend"
 * @param {string} level - The log level, e.g., "INFO", "ERROR"
 * @param {string} pkg - The package/component name
 * @param {string} message - The log message
 */
export const Log = async (stack, level, pkg, message) => {
  try {

    const apiUrl = import.meta.env?.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/logs` : (process.env.LOG_API_URL || 'https://api.example.com/logs');
    const token = import.meta.env?.VITE_AUTH_TOKEN || process.env.AUTH_TOKEN || 'YOUR_AUTH_TOKEN';

    const payload = {
      timestamp: new Date().toISOString(),
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`[LOGGER WARNING] Failed to send log: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('[LOGGER ERROR] Network error while sending log:', error);
  }
};

export default Log;
