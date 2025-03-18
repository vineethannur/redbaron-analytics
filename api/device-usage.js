import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Create a mock API response for device usage
export default async function handler(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Get environment variables (check both with and without VITE_ prefix)
    const propertyId = process.env.GA_PROPERTY_ID || process.env.VITE_GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL || process.env.VITE_GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY || process.env.VITE_GA_PRIVATE_KEY;
    
    // Debug environment variables
    console.log('Device Usage Environment check:', {
      hasPropertyId: !!propertyId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey
    });
    
    // Check if Google Analytics credentials are available
    if (propertyId && clientEmail && privateKey) {
      try {
        console.log('Initializing GA4 client for device usage...');
        // Initialize the GA4 client
        const analyticsDataClient = new BetaAnalyticsDataClient({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey.replace(/\\n/g, '\n')
          }
        });
        
        console.log('Running GA4 device report...');
        // Run the report for device categories
        const [response] = await analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'totalUsers' }]
        });
        
        console.log('GA4 device response received:', !!response);
        
        if (response && response.rows && response.rows.length > 0) {
          console.log('GA4 device data rows:', response.rows.length);
          const deviceData = response.rows.map(row => ({
            device: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value)
          }));
          
          console.log('Returning real device data');
          return res.status(200).json(deviceData);
        } else {
          console.log('No rows in GA4 device response, falling back to mock data');
        }
      } catch (gaError) {
        console.error('GA4 API Error for device usage:', gaError);
      }
    } else {
      console.log('Missing GA credentials for device usage, falling back to mock data');
    }
    
    // Return mock data as fallback
    console.log('Returning mock device data');
    res.status(200).json([
      { device: 'desktop', users: 388, percentage: 74 },
      { device: 'mobile', users: 138, percentage: 26 },
      { device: 'tablet', users: 0, percentage: 0 }
    ]);
  } catch (error) {
    console.error('API Error in device usage:', error);
    res.status(500).json({ error: 'Failed to fetch device data' });
  }
} 