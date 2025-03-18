import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface KeyMetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
}

export const KeyMetricCard: React.FC<KeyMetricCardProps> = ({
  title,
  value,
  change,
  icon,
  description
}) => {
  const isPositiveChange = change && change > 0;
  
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-icon">{icon}</div>
        <div className="metric-title">{title}</div>
      </div>
      <div className="metric-value">{value}</div>
      {change !== undefined && (
        <div className={`metric-change ${isPositiveChange ? 'positive' : 'negative'}`}>
          {isPositiveChange ? <ArrowUpIcon /> : <ArrowDownIcon />}
          <span>{Math.abs(change)}%</span>
          <span className="period">vs last period</span>
        </div>
      )}
      {description && <div className="metric-description">{description}</div>}
    </div>
  );
}; 