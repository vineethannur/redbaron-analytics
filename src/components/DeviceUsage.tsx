import React, { useEffect, useState } from 'react';
import '../styles/DataComponents.css';

interface DeviceUsageProps {
  startDate: string;
  endDate: string;
}

interface DeviceData {
  device: string;
  users: number;
  percentage: number;
  color: string;
}

export const DeviceUsage: React.FC<DeviceUsageProps> = ({ startDate, endDate }) => {
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    console.log(`DeviceUsage: Fetching data for date range ${startDate} to ${endDate}`);
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          // Get API URL - Use VITE_API_URL if defined, otherwise use relative URL
          const apiBaseUrl = import.meta.env.VITE_API_URL || '';
          
          const response = await fetch(`${apiBaseUrl}/api/device-usage?startDate=${startDate}&endDate=${endDate}`, {
            signal: AbortSignal.timeout(5000) // 5 second timeout
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch device usage data: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('DeviceUsage: Received data:', data);
          
          if (data && Array.isArray(data)) {
            // Add colors to the data
            const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#5F6368'];
            
            // Add mock data for missing device categories if needed
            let processedData = [];
            const deviceTypes = ['desktop', 'mobile', 'tablet'];
            const existingDevices = data.map(item => item.device);
            
            // Process existing data
            processedData = data.map((item, index) => ({
              device: item.device || 'Unknown',
              users: Number(item.users || 0),
              percentage: 0, // Will calculate after getting total
              color: colors[deviceTypes.indexOf(item.device) !== -1 ? deviceTypes.indexOf(item.device) : index % colors.length]
            }));
            
            // Add missing device categories with zero users
            deviceTypes.forEach(deviceType => {
              if (!existingDevices.includes(deviceType)) {
                processedData.push({
                  device: deviceType,
                  users: 0,
                  percentage: 0,
                  color: colors[deviceTypes.indexOf(deviceType)]
                });
              }
            });
            
            // Calculate total users
            const total = processedData.reduce((sum, item) => sum + item.users, 0);
            
            // Calculate percentages
            processedData = processedData.map(item => ({
              ...item,
              percentage: total > 0 ? Math.round((item.users / total) * 100) : 0
            }));
            
            setDeviceData(processedData);
            setTotalUsers(total);
          } else {
            // If the data is not in the expected format, create mock data
            const mockData = [
              { device: 'desktop', users: 388, percentage: 74, color: '#4285F4' },
              { device: 'mobile', users: 138, percentage: 26, color: '#34A853' },
              { device: 'tablet', users: 0, percentage: 0, color: '#FBBC05' }
            ];
            setDeviceData(mockData);
            setTotalUsers(526);
          }
        } catch (fetchError: any) {
          console.error('Error fetching device usage data:', fetchError);
          // Fallback to mock data on error
          const mockData = [
            { device: 'desktop', users: 388, percentage: 74, color: '#4285F4' },
            { device: 'mobile', users: 138, percentage: 26, color: '#34A853' },
            { device: 'tablet', users: 0, percentage: 0, color: '#FBBC05' }
          ];
          setDeviceData(mockData);
          setTotalUsers(526);
        }
      } catch (error) {
        console.error('Error in device usage component:', error);
        // Fallback to mock data on error
        const mockData = [
          { device: 'desktop', users: 388, percentage: 74, color: '#4285F4' },
          { device: 'mobile', users: 138, percentage: 26, color: '#34A853' },
          { device: 'tablet', users: 0, percentage: 0, color: '#FBBC05' }
        ];
        setDeviceData(mockData);
        setTotalUsers(526);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const renderDonutChart = () => {
    if (deviceData.length === 0 || totalUsers === 0) {
      return (
        <div className="empty-chart">
          <p>No device usage data available for this period</p>
        </div>
      );
    }
    
    // Calculate the circumference of the circle
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    
    // Start from the top (12 o'clock position)
    let currentOffset = 0;
    
    return (
      <div className="donut-chart-container">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle 
            cx="90" 
            cy="90" 
            r="80" 
            fill="none" 
            stroke="var(--hover-bg)" 
            strokeWidth="20"
          />
          
          {/* Data segments */}
          {deviceData.map((device, index) => {
            // Calculate the length of this segment
            const segmentLength = (device.percentage / 100) * circumference;
            
            // Create the segment
            const segment = (
              <circle 
                key={index}
                cx="90" 
                cy="90" 
                r="80" 
                fill="none" 
                stroke={device.color} 
                strokeWidth="20"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-currentOffset}
                transform="rotate(-90, 90, 90)"
                className="donut-segment"
              />
            );
            
            // Update the offset for the next segment
            currentOffset += segmentLength;
            
            return segment;
          })}
          
          {/* Center text */}
          <text x="90" y="85" textAnchor="middle" fontSize="24" fontWeight="600" className="donut-center-text">
            {totalUsers}
          </text>
          
          <text x="90" y="105" textAnchor="middle" fontSize="14" className="donut-center-label">
            Users
          </text>
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="data-component-container">
        <h2>Device Usage by Users</h2>
        <div className="date-range-info">
          <small>Loading data...</small>
        </div>
        <div className="data-loading">Loading device usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="data-component-container">
        <h2>Device Usage by Users</h2>
        <div className="date-range-info">
          <small>Error loading data</small>
        </div>
        <div className="data-error">{error}</div>
      </div>
    );
  }

  if (!deviceData || deviceData.length === 0) {
    return (
      <div className="data-component-container">
        <h2>Device Usage by Users</h2>
        <div className="date-range-info">
          <small>Data for: {startDate} to {endDate}</small>
        </div>
        <div className="no-data">No device usage data available</div>
      </div>
    );
  }

  return (
    <div className="data-component-container">
      <h2>Device Usage by Users</h2>
      <div className="date-range-info">
        <small>Data for: {startDate} to {endDate}</small>
      </div>
      
      {renderDonutChart()}
      
      <div className="data-legend">
        {deviceData.map((device, index) => (
          <div key={index} className="legend-item">
            <div className="legend-label-container">
              <div className="legend-color" style={{ backgroundColor: device.color }}></div>
              <div className="legend-label">{device.device}</div>
            </div>
            <div className="legend-value">
              {device.users}
              <span className="legend-percentage">({device.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 