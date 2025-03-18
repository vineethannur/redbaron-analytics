import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Create a mock API response for summary metrics
export default async function handler(req, res) {
  try {
    // Return mock data since we're running on Vercel and not connected to real API
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