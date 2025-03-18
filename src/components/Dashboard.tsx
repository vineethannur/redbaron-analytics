import React, { useState, useRef, useEffect } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { SummaryMetrics } from './SummaryMetrics';
import { DeviceUsage } from './DeviceUsage';
import { TrafficSources } from './TrafficSources';
import { VisitsByCountry } from './VisitsByCountry';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../styles/Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Get the first day of the current month
  const getFirstDayOfMonth = () => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  };

  // Get today's date
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  const dashboardRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<string>(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState<string>(getToday());
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    console.log(`Date range changed: ${newStartDate} to ${newEndDate}`);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    // Increment refresh key to trigger re-renders
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    console.log('Refreshing dashboard data');
    setRefreshKey(prev => prev + 1);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Export to image function
  const exportToImage = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `analytics-dashboard-${startDate}-to-${endDate}.png`;
      link.click();
    } catch (error) {
      console.error('Error exporting to image:', error);
      alert('Failed to export dashboard as image');
    }
  };

  // Export to PDF function
  const exportToPDF = async () => {
    if (!dashboardRef.current) return;
    
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`analytics-dashboard-${startDate}-to-${endDate}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export dashboard as PDF');
    }
  };

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <div className="dashboard-header">
        <img src={isDarkMode ? "../assets/logo-dark.png" : "../assets/logo.png"} alt="Logo" className="logo" />
        <div className="header-controls">
          <div className="date-picker-container">
            <DateRangePicker 
              startDate={startDate} 
              endDate={endDate} 
              onDateChange={handleDateChange} 
            />
          </div>
          
          <div className="actions-container">
            <button className="refresh-button" onClick={handleRefresh} title="Refresh data">
              <svg className="refresh-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
              </svg>
            </button>
            
            {/* Export buttons */}
            <div className="export-buttons">
              <button className="export-button" onClick={exportToImage} title="Export as Image">
                <svg className="export-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H17.5L13.96 12.29Z" fill="currentColor"/>
                </svg>
              </button>
              <button className="export-button" onClick={exportToPDF} title="Export as PDF">
                <svg className="export-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H8V4H20V16ZM4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6ZM16 12V9C16 8.45 15.55 8 15 8H13V13H15C15.55 13 16 12.55 16 12ZM14 9H15V12H14V9ZM18 11H19V10H18V9H19V8H17V13H18V11ZM10 11H11C11.55 11 12 10.55 12 10V9C12 8.45 11.55 8 11 8H9V13H10V11ZM10 9H11V10H10V9Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            {/* Profile Icon with Dropdown */}
            <div className="profile-dropdown-container" ref={profileDropdownRef}>
              <button className="profile-button" onClick={toggleProfileDropdown} title="Profile">
                <svg className="profile-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 6C13.1 6 14 6.9 14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13ZM18 18H6V17.01C6.2 16.29 9.3 15 12 15C14.7 15 17.8 16.29 18 17V18Z" fill="currentColor"/>
                </svg>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-item" onClick={toggleDarkMode}>
                    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {isDarkMode ? (
                        // Sun icon for light mode
                        <path d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z" fill="currentColor"/>
                      ) : (
                        // Moon icon for dark mode
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="currentColor"/>
                      )}
                    </svg>
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </div>
                  <div className="dropdown-item" onClick={onLogout}>
                    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                    </svg>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Summary metrics row */}
        <div className="metrics-row summary-metrics-row">
          <SummaryMetrics 
            key={`summary-${refreshKey}`}
            startDate={startDate} 
            endDate={endDate} 
            onRefresh={handleRefresh}
          />
        </div>

        {/* Data visualization row */}
        <div className="data-row">
          <div className="data-column">
            <DeviceUsage 
              key={`devices-${refreshKey}`}
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
          <div className="data-column">
            <TrafficSources 
              key={`traffic-${refreshKey}`}
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
          <div className="data-column">
            <VisitsByCountry 
              key={`countries-${refreshKey}`}
              startDate={startDate} 
              endDate={endDate} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 