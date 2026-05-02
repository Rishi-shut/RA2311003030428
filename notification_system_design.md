# Campus Notification System Design Document

## 1. Architecture
The application is structured as a decoupled, modern web architecture with a clear separation of concerns. It is built strictly using **React** (via **Vite**) for the frontend layer and relies on a RESTful API for the backend layer.
- **Routing Engine**: We utilize `react-router-dom` to maintain a multi-page application structure. The application strictly segregates the notification feeds: the main inbox (`/`) and the priority dashboard (`/priority`).
- **Styling**: The application exclusively uses **Material UI (MUI)**. Native CSS was deliberately removed to comply with production requirements, ensuring consistent cross-platform responsiveness and highly accessible components.
- **State Management**: Local component state (`useState`) handles lightweight UI logic (like toggling "seen" flags), while page-level state handles data fetching, pagination, and active filter contexts. 

## 2. API Usage
The `src/services/api.js` module acts as a singleton gateway for all network requests to the `evaluation-service`.
- **Dynamic Queries**: The `fetchNotifications` function accepts an optional configuration object (`limit`, `page`, `notification_type`). It automatically serializes these into valid URL query parameters using `URLSearchParams` to ensure clean requests.
- **Authentication**: A JWT token is strictly loaded from the `.env` configuration file. The service cleanses the token of any accidental quotes and injects it into every outgoing request via the `Authorization: Bearer <token>` header.
- **Resilience**: Every API call is wrapped in a `try...catch` block. If the server responds with a non-200 status code, the service throws an error that is elegantly caught and displayed by the UI using MUI's `<Alert>` component.

## 3. Priority Logic
The application ranks and isolates important alerts using a robust sorting algorithm located in `src/utils/priority.js`.
- **Ranking Map**: We assigned numeric weights to predefined categories: `Placement` (1), `Event` (2), `Result` (3).
- **Sorting Mechanism**: The algorithm sorts the raw data array in a two-pass mechanism:
  1. It first sorts by the numeric weight of the category to bring the most urgent categories to the top.
  2. For notifications within the exact same category, it uses a secondary sort on the `timestamp` field to ensure the most recent alerts appear first.
- **Defensive Extraction**: Because real-world API objects often suffer from inconsistent casing (e.g., `type` vs `Type`), the logic utilizes defensive field mapping to ensure it never crashes when sorting unexpected JSON shapes.

## 4. Logging Flow
A custom logging middleware (`logging_middleware/logger.js`) ensures total observability of the application without ever interfering with the user experience.
- **Silent Asynchrony**: The `Log` function operates asynchronously. It relies on a "fire-and-forget" methodology—if the log fails to reach the server, it silently logs to the browser console instead of breaking the frontend.
- **Data Truncation**: The backend strictly rejects log packets where the `message` exceeds 48 characters. The middleware automatically sanitizes and truncates (`...`) long messages before transmittal to guarantee successful payloads.
- **Tracking**: User interactions (such as changing a filter dropdown, clicking a pagination button, or marking a specific card as "read") are all silently dispatched to the backend, enabling deep user analytics.
