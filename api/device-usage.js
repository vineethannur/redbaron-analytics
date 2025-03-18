import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Create a mock API response for device usage
export default async function handler(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Check if Google Analytics credentials are available
    if (process.env.VITE_GA_PROPERTY_ID && 
        process.env.VITE_GA_CLIENT_EMAIL && 
        process.env.VITE_GA_PRIVATE_KEY) {
      
      try {
        // Initialize the GA4 client
        const analyticsDataClient = new BetaAnalyticsDataClient({
          credentials: {
            client_email: process.env.VITE_GA_CLIENT_EMAIL,
            private_key: process.env.VITE_GA_PRIVATE_KEY.replace(/\\n/g, '\n')
          }
        });
        
        // Run the report for device categories
        const [response] = await analyticsDataClient.runReport({
          property: `properties/${process.env.VITE_GA_PROPERTY_ID}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'totalUsers' }]
        });
        
        if (response && response.rows && response.rows.length > 0) {
          const deviceData = response.rows.map(row => ({
            device: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value)
          }));
          
          return res.status(200).json(deviceData);
        }
      } catch (gaError) {
        console.error('GA4 API Error:', gaError);
      }
    }
    
    // Return mock data as fallback
    res.status(200).json([
      { device: 'desktop', users: 388, percentage: 74 },
      { device: 'mobile', users: 138, percentage: 26 },
      { device: 'tablet', users: 0, percentage: 0 }
    ]);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 