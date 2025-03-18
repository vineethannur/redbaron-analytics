import { useState, useEffect } from 'react';
import { getSummaryMetrics } from '../services/ga4Service';
import './SummaryMetrics.css';

interface SummaryMetricsProps {
  startDate: string;
  endDate: string;
  onRefresh?: () => void;
}

const SummaryMetrics = ({ startDate, endDate, onRefresh }: SummaryMetricsProps) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use historical dates that are more likely to have data
      // Only use these if you're testing and don't have data for the selected range
      // const testStartDate = '2023-01-01';
      // const testEndDate = '2023-01-31';
      
      const data = await getSummaryMetrics(startDate, endDate);
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching summary metrics:', error);
      setError('Failed to fetch summary metrics');
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

  if (error) {
    return (
      <div className="summary-metrics-error">
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  if (loading) {
    return <div className="summary-metrics-loading">Loading summary metrics...</div>;
  }

  return (
    <div className="summary-metrics-container">
      {metrics ? (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Users</h3>
            <p className="metric-value">{metrics.users || 0}</p>
          </div>
          <div className="metric-card">
            <h3>New Users</h3>
            <p className="metric-value">{metrics.newUsers || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Sessions</h3>
            <p className="metric-value">{metrics.sessions || 0}</p>
          </div>
          <div className="metric-card">
            <h3>Page Views</h3>
            <p className="metric-value">{metrics.pageViews || 0}</p>
          </div>
        </div>
      ) : (
        <div className="no-data-message">No summary metrics available</div>
      )}
    </div>
  );
};

export default SummaryMetrics; 