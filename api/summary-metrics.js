import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Create an API response for summary metrics
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
        
        // Run the report
        const [response] = await analyticsDataClient.runReport({
          property: `properties/${process.env.VITE_GA_PROPERTY_ID}`,
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'totalUsers' },
            { name: 'newUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' }
          ]
        });
        
        if (response && response.rows && response.rows.length > 0) {
          const metrics = response.rows[0].metricValues;
          const data = {
            users: parseInt(metrics[0].value) || 0,
            newUsers: parseInt(metrics[1].value) || 0,
            sessions: parseInt(metrics[2].value) || 0,
            pageViews: parseInt(metrics[3].value) || 0,
            bounceRate: parseFloat(metrics[4].value) || 0,
            isMockData: false
          };
          
          return res.status(200).json(data);
        }
      } catch (gaError) {
        console.error('GA4 API Error:', gaError);
      }
    }
    
    // Return mock data as fallback
    res.status(200).json({
      users: 545,
      newUsers: 324,
      sessions: 678,
      pageViews: 1245,
      bounceRate: 42.8,
      isMockData: true
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 