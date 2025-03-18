import React from 'react';

const UsersByCountry = () => {
  const countries = [
    { name: 'United States', code: 'US', users: 2345, percentage: '32%' },
    { name: 'India', code: 'IN', users: 1205, percentage: '16%' },
    { name: 'United Kingdom', code: 'UK', users: 932, percentage: '12%' },
    { name: 'Germany', code: 'DE', users: 756, percentage: '10%' },
    { name: 'Canada', code: 'CA', users: 621, percentage: '8%' },
    { name: 'Australia', code: 'AU', users: 498, percentage: '7%' },
    { name: 'France', code: 'FR', users: 412, percentage: '5%' },
    { name: 'Others', code: '', users: 799, percentage: '10%' }
  ];

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Country
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {countries.map((country, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    {country.code && (
                      <span className="mr-2 text-lg">{getCountryFlag(country.code)}</span>
                    )}
                    {country.name}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {country.users.toLocaleString()}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-right">
                  {country.percentage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        Total Users: 7,568
      </div>
    </div>
  );
};

// Helper function to get country flag emoji
function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

export default UsersByCountry;