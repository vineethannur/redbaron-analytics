const { BetaAnalyticsDataClient } = require('@google-analytics/data');
require('dotenv').config();

// Initialize the Google Analytics Data API client
let analyticsDataClient;
try {
  analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA4_CLIENT_EMAIL,
      private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }
  });
  console.log('GA4 client initialized successfully');
} catch (error) {
  console.error('Error initializing GA4 client:', error);
  console.log('Will use mock data for all requests');
}

// Get the property ID from environment variables
const propertyId = process.env.GA4_PROPERTY_ID;
console.log('Using GA4 property ID:', propertyId);

// Mock data for fallback
const MOCK_SUMMARY_METRICS = {
  users: 545,
  newUsers: 324,
  sessions: 678,
  pageViews: 1245
};

const MOCK_PAGE_VIEWS = {
  dimensionHeaders: [{ name: 'date' }],
  metricHeaders: [{ name: 'pageViews' }, { name: 'activeUsers' }],
  rows: [
    { dimensionValues: [{ value: '20230101' }], metricValues: [{ value: '120' }, { value: '45' }] },
    { dimensionValues: [{ value: '20230102' }], metricValues: [{ value: '145' }, { value: '52' }] },
    { dimensionValues: [{ value: '20230103' }], metricValues: [{ value: '132' }, { value: '48' }] },
    { dimensionValues: [{ value: '20230104' }], metricValues: [{ value: '168' }, { value: '61' }] },
    { dimensionValues: [{ value: '20230105' }], metricValues: [{ value: '157' }, { value: '57' }] },
    { dimensionValues: [{ value: '20230106' }], metricValues: [{ value: '143' }, { value: '52' }] },
    { dimensionValues: [{ value: '20230107' }], metricValues: [{ value: '128' }, { value: '46' }] }
  ]
};

const MOCK_TRAFFIC_SOURCES = [
  { source: 'google', sessions: 289 },
  { source: '(direct)', sessions: 199 },
  { source: 'bing', sessions: 15 },
  { source: '(not set)', sessions: 13 },
  { source: 'in.search.yahoo.com', sessions: 10 },
];

const MOCK_DEVICE_USAGE = [
  { device: 'desktop', users: 388 },
  { device: 'mobile', users: 138 },
  { device: 'tablet', users: 0 },
];

const MOCK_VISITS_BY_COUNTRY = [
  { country: 'India', users: 300, sessions: 400, pageViews: 663 },
  { country: 'United States', users: 57, sessions: 68, pageViews: 84 },
  { country: 'China', users: 14, sessions: 14, pageViews: 7 },
  { country: 'Singapore', users: 13, sessions: 15, pageViews: 16 },
  { country: 'United Kingdom', users: 9, sessions: 9, pageViews: 14 },
  { country: 'Canada', users: 5, sessions: 5, pageViews: 7 },
  { country: 'France', users: 5, sessions: 7, pageViews: 13 },
  { country: 'Australia', users: 4, sessions: 4, pageViews: 6 },
  { country: 'Malaysia', users: 4, sessions: 8, pageViews: 12 },
  { country: '(not set)', users: 2, sessions: 2, pageViews: 2 },
];

// Simplified getSummaryMetrics function
async function getSummaryMetrics(startDate, endDate) {
  console.log(`Fetching summary metrics for date range: ${startDate} to ${endDate}`);
  
  // If GA4 client is not initialized, return mock data
  if (!analyticsDataClient || !propertyId) {
    console.log('GA4 client not initialized or property ID not set, returning mock data');
    return MOCK_SUMMARY_METRICS;
  }
  
  try {
    // Make the API request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    });
    
    // Process the response
    if (response && response.rows && response.rows.length > 0) {
      const metrics = {
        users: parseInt(response.rows[0].metricValues[0].value) || 0,
        newUsers: parseInt(response.rows[0].metricValues[1].value) || 0,
        sessions: parseInt(response.rows[0].metricValues[2].value) || 0,
        pageViews: parseInt(response.rows[0].metricValues[3].value) || 0,
      };
      
      console.log('Returning real metrics:', metrics);
      return metrics;
    } else {
      console.warn('No data returned from GA4 API, returning mock data');
      return MOCK_SUMMARY_METRICS;
    }
  } catch (error) {
    console.error('Error calling GA4 API:', error);
    return MOCK_SUMMARY_METRICS;
  }
}

// Simplified getPageViews function
async function getPageViews(startDate, endDate) {
  console.log(`Fetching page views for date range: ${startDate} to ${endDate}`);
  
  // If GA4 client is not initialized, return mock data
  if (!analyticsDataClient || !propertyId) {
    return MOCK_PAGE_VIEWS;
  }
  
  try {
    // Make the API request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [
        { name: 'date' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
      ],
    });
    
    // Format the response to match the expected structure
    const result = {
      dimensionHeaders: [{ name: 'date' }],
      metricHeaders: [{ name: 'pageViews' }, { name: 'activeUsers' }],
      rows: response.rows?.map(row => ({
        dimensionValues: [{ value: row.dimensionValues[0].value }],
        metricValues: [
          { value: row.metricValues[0].value },
          { value: row.metricValues[1].value }
        ]
      })) || []
    };
    
    return result;
  } catch (error) {
    console.error('Error calling GA4 API:', error);
    return MOCK_PAGE_VIEWS;
  }
}

// Simplified getTrafficSources function
async function getTrafficSources(startDate, endDate) {
  console.log(`Fetching traffic sources for date range: ${startDate} to ${endDate}`);
  
  // If GA4 client is not initialized, return mock data
  if (!analyticsDataClient || !propertyId) {
    return MOCK_TRAFFIC_SOURCES;
  }
  
  try {
    // Make the API request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [
        { name: 'sessionSource' },
      ],
      metrics: [
        { name: 'sessions' },
      ],
      orderBys: [
        {
          metric: { metricName: 'sessions' },
          desc: true,
        },
      ],
      limit: 10,
    });
    
    // Process the response
    const sources = response.rows?.map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value),
    })) || [];
    
    return sources;
  } catch (error) {
    console.error('Error calling GA4 API:', error);
    return MOCK_TRAFFIC_SOURCES;
  }
}

// Simplified getDeviceUsage function
async function getDeviceUsage(startDate, endDate) {
  console.log(`Fetching device usage for date range: ${startDate} to ${endDate}`);
  
  // If GA4 client is not initialized, return mock data
  if (!analyticsDataClient || !propertyId) {
    return MOCK_DEVICE_USAGE;
  }
  
  try {
    // Make the API request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [
        { name: 'deviceCategory' },
      ],
      metrics: [
        { name: 'totalUsers' },
      ],
    });
    
    // Process the response
    const devices = response.rows?.map(row => ({
      device: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
    })) || [];
    
    return devices;
  } catch (error) {
    console.error('Error calling GA4 API:', error);
    return MOCK_DEVICE_USAGE;
  }
}

// Simplified getVisitsByCountry function
async function getVisitsByCountry(startDate, endDate) {
  console.log(`Fetching visits by country for date range: ${startDate} to ${endDate}`);
  
  // If GA4 client is not initialized, return mock data
  if (!analyticsDataClient || !propertyId) {
    return MOCK_VISITS_BY_COUNTRY;
  }
  
  try {
    // Make the API request
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDate,
          endDate: endDate,
        },
      ],
      dimensions: [
        { name: 'country' },
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
      orderBys: [
        {
          metric: { metricName: 'totalUsers' },
          desc: true,
        },
      ],
      limit: 10,
    });
    
    // Process the response
    const countries = response.rows?.map(row => ({
      country: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value),
      sessions: parseInt(row.metricValues[1].value),
      pageViews: parseInt(row.metricValues[2].value),
    })) || [];
    
    return countries;
  } catch (error) {
    console.error('Error calling GA4 API:', error);
    return MOCK_VISITS_BY_COUNTRY;
  }
}

module.exports = {
  getSummaryMetrics,
  getPageViews,
  getTrafficSources,
  getDeviceUsage,
  getVisitsByCountry,
}; 