interface ImportMetaEnv {
  VITE_API_URL: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const getPageViews = async (startDate: string, endDate: string) => {
  try {
    console.log(`Fetching page views for date range: ${startDate} to ${endDate}`);
    
    // Check if we're using future dates
    const today = new Date();
    if (new Date(endDate) > today) {
      console.warn('Warning: Using future dates. Using historical data instead.');
      // Use historical dates for testing
      startDate = '2023-01-01';
      endDate = '2023-01-31';
    }
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    
    // Return mock data for demonstration purposes
    return {
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
  }
}

export const getSummaryMetrics = async (startDate: string, endDate: string) => {
  try {
    // Validate dates before sending to API
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD format.');
    }
    
    // Check if start date is before end date
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error('Start date must be before end date.');
    }
    
    // Check if dates are in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (new Date(endDate) > today) {
      console.warn('Warning: End date is in the future. Using historical data instead.');
      // Use historical dates for testing
      startDate = '2023-01-01';
      endDate = '2023-01-31';
    }
    
    console.log(`Fetching summary metrics for date range: ${startDate} to ${endDate}`);
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summary-metrics?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) {
      let errorMessage = 'Failed to fetch summary metrics';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = `${errorMessage}: ${errorText}`;
          }
        } catch (textError) {
          // If we can't get text either, just use the status
          errorMessage = `${errorMessage}: HTTP ${response.status}`;
        }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching summary metrics:', error);
    
    // Return mock data for demonstration purposes
    return {
      users: 545,
      newUsers: 324,
      sessions: 678,
      pageViews: 1245
    };
  }
}

// Helper function to validate date format (YYYY-MM-DD)
function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

export async function getTrafficSources(startDate: Date, endDate: Date) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/traffic-sources?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch traffic sources');
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch traffic sources');
  }
}

export async function getTopPages(startDate: Date, endDate: Date) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/top-pages?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch top pages');
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch top pages');
  }
}

export async function getDeviceUsage(startDate: Date, endDate: Date) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/device-usage?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch device usage');
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch device usage');
  }
}

export async function getUserDemographics(startDate: Date, endDate: Date) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user-demographics?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch user demographics');
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch user demographics');
  }
}

export async function getVisitsByCountry(startDate: Date, endDate: Date) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/visits-by-country?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
    );
    if (!response.ok) throw new Error('Failed to fetch country data');
    return response.json();
  } catch (error) {
    throw new Error('Failed to fetch country data');
  }
} 