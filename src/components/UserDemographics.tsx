import React, { useEffect, useState } from 'react';
import { getUserDemographics } from '../services/ga4Service';

interface DemographicData {
  country: string;
  users: number;
  sessions: number;
}

export const UserDemographics: React.FC<{ startDate: Date; endDate: Date }> = ({ startDate, endDate }) => {
  const [data, setData] = useState<DemographicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserDemographics(startDate, endDate);
        setData(response.rows);
        setError(null);
      } catch (err) {
        setError('Failed to fetch demographics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-demographics">
      <h2>User Demographics by Location</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>Users</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.country}</td>
                <td>{item.users.toLocaleString()}</td>
                <td>{item.sessions.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 