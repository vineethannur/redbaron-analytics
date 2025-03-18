# GA4 Analytics Dashboard Backend

This is the backend server for the GA4 Analytics Dashboard. It provides API endpoints to fetch analytics data from Google Analytics 4.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env` (if not already done)
   - Update the following variables in the `.env` file:
     - `GA4_PROPERTY_ID`: Your GA4 property ID
     - `GA4_CLIENT_EMAIL`: Your service account email
     - `GA4_PRIVATE_KEY`: Your service account private key (with newlines as \n)

3. Test the GA4 connection:
   ```
   node test-ga4-connection.js
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

- `/api/summary-metrics`: Get summary metrics (users, new users, sessions, page views)
- `/api/analytics`: Get page views over time
- `/api/traffic-sources`: Get traffic sources
- `/api/device-usage`: Get device usage
- `/api/visits-by-country`: Get visits by country
- `/api/top-pages`: Get top pages

All endpoints require `startDate` and `endDate` query parameters in the format `YYYY-MM-DD`.

Example:
```
GET /api/summary-metrics?startDate=2023-01-01&endDate=2023-01-31
```

## Troubleshooting

If you encounter issues with the GA4 connection:

1. Verify that your service account has the correct permissions on the GA4 property
2. Check that the private key is correctly formatted in the .env file
3. Ensure the GA4 property ID is correct
4. Check the server logs for detailed error messages 

node check-server.js 