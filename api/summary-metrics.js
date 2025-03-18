import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Create an API response for summary metrics
export default async function handler(req, res) {
  try {
    const { startDate, endDate } = req.query;
    
    // Get environment variables (check both with and without VITE_ prefix)
    const propertyId = process.env.GA_PROPERTY_ID || process.env.VITE_GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL || process.env.VITE_GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY || process.env.VITE_GA_PRIVATE_KEY;
    
    // Debug environment variables
    console.log('Environment check:', {
      hasPropertyId: !!propertyId,
      propertyId: propertyId ? propertyId.substring(0, 3) + '...' : 'undefined',
      hasClientEmail: !!clientEmail,
      clientEmail: clientEmail ? clientEmail.substring(0, 5) + '...' : 'undefined',
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey ? privateKey.length : 0,
      startDate,
      endDate,
      allEnvKeys: Object.keys(process.env).filter(key => !key.includes('NODE_') && !key.includes('npm_')).join(', ')
    });
    
    // Check if Google Analytics credentials are available
    if (propertyId && clientEmail && privateKey) {
      try {
        console.log('Initializing GA4 client...');
        // Initialize the GA4 client
        const analyticsDataClient = new BetaAnalyticsDataClient({
          credentials: {
            client_email: clientEmail,
            private_key: privateKey.replace(/\\n/g, '\n')
          }
        });
        
        console.log('Running GA4 report...');
        // Run the report
        const [response] = await analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'totalUsers' },
            { name: 'newUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' }
          ]
        });
        
        console.log('GA4 response received:', !!response);
        
        if (response && response.rows && response.rows.length > 0) {
          console.log('GA4 data rows:', response.rows.length);
          const metrics = response.rows[0].metricValues;
          const data = {
            users: parseInt(metrics[0].value) || 0,
            newUsers: parseInt(metrics[1].value) || 0,
            sessions: parseInt(metrics[2].value) || 0,
            pageViews: parseInt(metrics[3].value) || 0,
            bounceRate: parseFloat(metrics[4].value) || 0,
            isMockData: false
          };
          
          console.log('Returning real GA4 data');
          return res.status(200).json(data);
        } else {
          console.log('No rows in GA4 response, falling back to mock data');
        }
      } catch (gaError) {
        console.error('GA4 API Error:', gaError);
      }
    } else {
      console.log('Missing GA credentials, falling back to mock data');
    }
    
    // Return mock data as fallback
    console.log('Returning mock data');
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