import React, { useEffect, useState } from 'react';
import { getTopPages } from '../services/ga4Service';

interface TopPage {
  pagePath: string;
  pageViews: number;
  avgTimeOnPage: number;
}

export const TopPages: React.FC<{ startDate: Date; endDate: Date }> = ({ startDate, endDate }) => {
  const [data, setData] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTopPages(startDate, endDate);
        setData(response.rows || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch top pages');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="top-pages">
      <h2>Top Pages</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Page Path</th>
              <th>Page Views</th>
              <th>Avg. Time on Page</th>
            </tr>
          </thead>
          <tbody>
            {data.map((page, index) => (
              <tr key={index}>
                <td>{page.pagePath}</td>
                <td>{page.pageViews}</td>
                <td>{Math.round(page.avgTimeOnPage)} seconds</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 