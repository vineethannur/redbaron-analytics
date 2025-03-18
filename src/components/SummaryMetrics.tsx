import React, { useState, useEffect } from 'react';
import '../styles/SummaryMetrics.css';

interface SummaryMetricsProps {
  startDate: string;
  endDate: string;
  onRefresh?: () => void;
}

interface MetricsData {
  users: number;
  newUsers: number;
  sessions: number;
  pageViews: number;
  bounceRate?: number;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({ 
  startDate, 
  endDate,
  onRefresh 
}) => {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockData, setIsMockData] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    console.log(`SummaryMetrics: Fetching data for date range ${startDate} to ${endDate}`);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summary-metrics?startDate=${startDate}&endDate=${endDate}`, {
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('SummaryMetrics: Received data:', data);
      
      if (data.isMockData) {
        setIsMockData(true);
      } else {
        setIsMockData(false);
      }
      
      // Add bounce rate if not provided by the API
      if (!data.bounceRate) {
        data.bounceRate = 42.8; // Sample bounce rate as percentage
      }
      
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setError('Failed to load metrics data');
      
      // Use mock data if fetch fails
      setMetrics({
        users: 545,
        newUsers: 324,
        sessions: 678,
        pageViews: 1245,
        bounceRate: 42.8
      });
      setIsMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleRetry = () => {
    fetchData();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <>
        <div className="metric-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="metric-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="metric-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
        <div className="metric-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-value"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="metrics-error">
        <div className="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="error-message">{error}</div>
        <button className="retry-button" onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  if (!metrics) {
    return <div className="no-data">No metrics data available</div>;
  }

  return (
    <>
      {isMockData && (
        <div className="mock-data-notice">
          <svg className="notice-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="currentColor"/>
          </svg>
          <span>Showing sample data</span>
        </div>
      )}
      
      {/* 1. Page Views */}
      <div className="metric-card summary-metric-card">
        <div className="metric-title">Page Views</div>
        <div className="metric-value">{metrics.pageViews.toLocaleString()}</div>
        <div className="metric-change negative">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L6 10L7.4 8.6L11 12.2V4H13V12.2L16.6 8.6L18 10L12 16Z" fill="currentColor"/>
          </svg>
          <span>2.1%</span>
        </div>
      </div>
      
      {/* 2. Users */}
      <div className="metric-card summary-metric-card">
        <div className="metric-title">Users</div>
        <div className="metric-value">{metrics.users.toLocaleString()}</div>
        <div className="metric-change positive">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L18 14L16.6 15.4L13 11.8V20H11V11.8L7.4 15.4L6 14L12 8Z" fill="currentColor"/>
          </svg>
          <span>8.5%</span>
        </div>
      </div>
      
      {/* 3. New Users */}
      <div className="metric-card summary-metric-card">
        <div className="metric-title">New Users</div>
        <div className="metric-value">{metrics.newUsers.toLocaleString()}</div>
        <div className="metric-change positive">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8L18 14L16.6 15.4L13 11.8V20H11V11.8L7.4 15.4L6 14L12 8Z" fill="currentColor"/>
          </svg>
          <span>12.3%</span>
        </div>
      </div>
      
      {/* 4. Bounce Rate */}
      <div className="metric-card summary-metric-card">
        <div className="metric-title">Bounce Rate</div>
        <div className="metric-value">{metrics.bounceRate?.toFixed(1)}%</div>
        <div className="metric-change negative">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L6 10L7.4 8.6L11 12.2V4H13V12.2L16.6 8.6L18 10L12 16Z" fill="currentColor"/>
          </svg>
          <span>1.8%</span>
        </div>
      </div>
    </>
  );
}; 