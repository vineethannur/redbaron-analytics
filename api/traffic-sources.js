// Create a mock API response for traffic sources
export default async function handler(req, res) {
  try {
    // Return mock data for traffic sources
    res.status(200).json([
      { source: 'google', sessions: 160, percentage: 55 },
      { source: '(direct)', sessions: 98, percentage: 34 },
      { source: 'bing', sessions: 8, percentage: 3 },
      { source: '(not set)', sessions: 5, percentage: 2 },
      { source: 'in.search.yahoo.com', sessions: 5, percentage: 2 }
    ]);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 