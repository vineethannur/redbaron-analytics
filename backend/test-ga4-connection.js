require('dotenv').config();
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

async function testGA4Connection() {
  try {
    console.log('Testing GA4 connection...');
    console.log('Property ID:', process.env.GA4_PROPERTY_ID);
    console.log('Client Email:', process.env.GA4_CLIENT_EMAIL);
    console.log('Private Key exists:', !!process.env.GA4_PRIVATE_KEY);

    // Initialize the Google Analytics Data API client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, '\n')
      }
    });

    // Run a simple report to test the connection
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'yesterday',
        },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });

    console.log('Connection successful!');
    console.log('Total users in the last 7 days:', response.rows[0].metricValues[0].value);
    return true;
  } catch (error) {
    console.error('Error connecting to GA4:');
    console.error(error);
    return false;
  }
}

// Run the test
testGA4Connection()
  .then(success => {
    if (success) {
      console.log('GA4 connection test passed!');
    } else {
      console.log('GA4 connection test failed. Please check your credentials.');
    }
  })
  .catch(error => {
    console.error('Unexpected error during test:', error);
  }); 