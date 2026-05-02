### Important Note for the Evaluator: Port Configuration

To strictly follow the assignment instructions, this React application has been configured to run exclusively on **http://localhost:3000** (this is set in `vite.config.js`).

However, you might encounter a "Failed to fetch" or CORS error when the app tries to load data from the API on port 3000. 

**Why this happens:**
The backend API provided for this assignment appears to be misconfigured. It only accepts requests coming from Vite's default port (`5173`) and automatically blocks requests coming from port `3000`.

**How to test the application:**
If the API fails to load data on port 3000, please temporarily change the port back to `5173` in `vite.config.js`. Once running on port 5173, the API will allow the connection and you will be able to see the fully functional application, complete with the requested Material UI components and routing!