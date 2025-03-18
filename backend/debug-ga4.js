require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function debugGA4() {
  console.log('=== GA4 Debug Information ===');
  console.log('Environment Variables:');
  console.log('- GA4_PROPERTY_ID:', process.env.GA4_PROPERTY_ID || 'not set');
  console.log('- GA4_CLIENT_EMAIL:', process.env.GA4_CLIENT_EMAIL ? 'set' : 'not set');
  console.log('- GA4_PRIVATE_KEY exists:', !!process.env.GA4_PRIVATE_KEY);
  
  if (!process.env.GA4_PROPERTY_ID || !process.env.GA4_CLIENT_EMAIL || !process.env.GA4_PRIVATE_KEY) {
    console.error('Error: Missing required environment variables');
    return;
  }
  
  try {
    console.log('\nInitializing GA4 client...');
    const privateKey = process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('Private key format check:', privateKey.includes('-----BEGIN PRIVATE KEY-----') && privateKey.includes('-----END PRIVATE KEY-----') ? 'OK' : 'Invalid');
    
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: privateKey
      }
    });
    
    console.log('Client initialized successfully');
    
    // Test with a simple request
    console.log('\nTesting with a simple request...');
    const startDate = '2023-01-01';
    const endDate = '2023-01-31';
    
    console.log(`Date range: ${startDate} to ${endDate}`);
    console.log(`Property ID: properties/${process.env.GA4_PROPERTY_ID}`);
    
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });
    
    console.log('\nAPI Response:');
    console.log('- Response received:', !!response);
    console.log('- Has rows:', !!response.rows);
    console.log('- Number of rows:', response.rows ? response.rows.length : 0);
    
    if (response.rows && response.rows.length > 0) {
      console.log('- Total users:', response.rows[0].metricValues[0].value);
    }
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('\nError during GA4 debug:');
    console.error('- Error message:', error.message);
    console.error('- Error code:', error.code);
    console.error('- Error details:', error.details || 'No details available');
    
    if (error.message.includes('permission')) {
      console.error('\nPermission issue detected. Make sure:');
      console.error('1. The service account has "Viewer" access to the GA4 property');
      console.error('2. The GA4 property ID is correct');
      console.error('3. The Google Analytics Data API is enabled in your Google Cloud project');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\nAuthentication issue detected. Make sure:');
      console.error('1. The service account email is correct');
      console.error('2. The private key is correctly formatted with proper newlines');
      console.error('3. The service account has not been deleted or disabled');
    }
  }
}

debugGA4().catch(console.error); 