import React, { useEffect } from 'react';
import Log from '../../../logging_middleware/logger';

function Home() {
  useEffect(() => {
    // Example usage: Log success (e.g., component mounted or API success)
    Log('frontend', 'INFO', 'page', 'Home component initialized successfully.');

    // Example usage: Log error (e.g., simulating an API failure)
    const simulateAction = async () => {
      try {
        throw new Error("Simulated API data fetch failure");
      } catch (error) {
        Log('frontend', 'ERROR', 'page', `Action failed: ${error.message}`);
      }
    };

    simulateAction();
  }, []);

  return (
    <div>
      <h1>Campus Notification System</h1>
      <p>Logger integration complete. Check network/console for logs.</p>
    </div>
  );
}

export default Home;
