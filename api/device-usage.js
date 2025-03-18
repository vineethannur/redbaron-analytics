// Create a mock API response for device usage
export default async function handler(req, res) {
  try {
    // Return mock data for device usage
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