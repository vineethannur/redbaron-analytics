import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DeviceUsageChart = () => {
  const data = {
    labels: ['Desktop', 'Tablet', 'Mobile'],
    datasets: [
      {
        data: [4568, 2695, 20654],
        backgroundColor: [
          '#4F7CFF', // Blue
          '#FF8A65', // Orange
          '#4CD4A9', // Green
        ],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100) + '%';
            return `${label}: ${value.toLocaleString()} (${percentage})`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  const totalDevices = 27917;
  const deviceData = [
    { label: 'Desktop', value: 4568, color: '#4F7CFF', percentage: '16%' },
    { label: 'Tablet', value: 2695, color: '#FF8A65', percentage: '10%' },
    { label: 'Mobile', value: 20654, color: '#4CD4A9', percentage: '74%' },
  ];

  return (
    <div>
      <div className="relative h-64 mb-4">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-gray-500">Total Device</p>
          <p className="text-2xl font-bold">{totalDevices.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {deviceData.map((device, index) => (
          <div key={index} className="text-center">
            <div className="w-4 h-4 rounded-sm mx-auto mb-1" style={{ backgroundColor: device.color }}></div>
            <p className="text-lg font-semibold">{device.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{device.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeviceUsageChart;