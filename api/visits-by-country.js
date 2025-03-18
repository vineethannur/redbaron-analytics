// Create a mock API response for visits by country
export default async function handler(req, res) {
  try {
    // Return mock data for country visits
    res.status(200).json([
      { country: 'India', countryCode: 'in', users: 206, percentage: 77.2 },
      { country: 'United States', countryCode: 'us', users: 31, percentage: 11.6 },
      { country: 'Singapore', countryCode: 'sg', users: 8, percentage: 3 },
      { country: 'China', countryCode: 'cn', users: 7, percentage: 2.6 },
      { country: 'United Kingdom', countryCode: 'gb', users: 5, percentage: 1.9 }
    ]);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 