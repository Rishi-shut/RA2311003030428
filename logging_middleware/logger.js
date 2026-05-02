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

    const apiUrl = import.meta.env?.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/logs` : (process.env.LOG_API_URL);
    const rawToken = import.meta.env?.VITE_AUTH_TOKEN || process.env.AUTH_TOKEN;
    // Remove quotes from token if they were included in the .env file
    const token = rawToken.replace(/^["']|["']$/g, '');

    const payload = {
      timestamp: new Date().toISOString(),
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: pkg.toLowerCase(),
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
