import React, { useState } from 'react';
import { format, addDays, startOfMonth, endOfMonth, isAfter, isBefore, isSameDay, addMonths, subMonths, isWithinInterval, isToday } from 'date-fns';
import '../styles/DateRangePicker.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onDateChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MMM dd, yy');
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset temp dates when opening
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    if (selecting === 'start') {
      setTempStartDate(formattedDate);
      setSelecting('end');
      
      // If clicked date is after current end date, reset end date
      if (tempEndDate && isAfter(date, new Date(tempEndDate))) {
        setTempEndDate(formattedDate);
      }
    } else {
      // If selecting end date
      if (tempStartDate && isBefore(date, new Date(tempStartDate))) {
        // If clicked date is before start date, swap them
        setTempEndDate(tempStartDate);
        setTempStartDate(formattedDate);
      } else {
        setTempEndDate(formattedDate);
      }
      setSelecting('start');
    }
  };

  const applyDateRange = () => {
    if (tempStartDate && tempEndDate) {
      onDateChange(tempStartDate, tempEndDate);
      setIsOpen(false);
    }
  };

  const handlePresetRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days + 1);
    
    const formattedStart = format(start, 'yyyy-MM-dd');
    const formattedEnd = format(end, 'yyyy-MM-dd');
    
    setTempStartDate(formattedStart);
    setTempEndDate(formattedEnd);
  };

  const handleLastMonthsRange = (months: number) => {
    const end = new Date();
    const start = new Date();
    // Subtract exactly X months from current date, preserving the day
    start.setFullYear(end.getFullYear() - Math.floor(months/12));
    start.setMonth(end.getMonth() - (months % 12));
    
    const formattedStart = format(start, 'yyyy-MM-dd');
    const formattedEnd = format(end, 'yyyy-MM-dd');
    
    setTempStartDate(formattedStart);
    setTempEndDate(formattedEnd);
  };

  const isInRange = (date: Date) => {
    if (!tempStartDate || !tempEndDate) return false;
    
    return isWithinInterval(date, { 
      start: new Date(tempStartDate), 
      end: new Date(tempEndDate) 
    });
  };

  const isRangeStart = (date: Date) => {
    return tempStartDate && isSameDay(date, new Date(tempStartDate));
  };

  const isRangeEnd = (date: Date) => {
    return tempEndDate && isSameDay(date, new Date(tempEndDate));
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDay = new Date(monthStart);
    const endDay = new Date(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDay;
    
    // Create header row with day names
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const daysHeader = dayNames.map((dayName, i) => (
      <div key={`header-${i}`} className="calendar-day-header">{dayName}</div>
    ));
    rows.push(<div key="header" className="calendar-row">{daysHeader}</div>);
    
    // Adjust the first day to start on the correct day of the week
    const dayOfWeek = day.getDay();
    for (let i = 0; i < dayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    while (day <= endDay) {
      const cloneDay = new Date(day);
      const formattedDate = format(day, 'd');
      
      const isStart = isRangeStart(day);
      const isEnd = isRangeEnd(day);
      const inRange = isInRange(day);
      const isCurrentDay = isToday(day);
      
      let dayClasses = "calendar-day";
      
      if (isStart && isEnd) {
        dayClasses += " range-start range-end";
      } else if (isStart) {
        dayClasses += " range-start";
      } else if (isEnd) {
        dayClasses += " range-end";
      } else if (inRange) {
        dayClasses += " in-range";
      }
      
      if (isCurrentDay) {
        dayClasses += " current-day";
      }
      
      days.push(
        <div
          key={day.toString()}
          className={dayClasses}
          onClick={() => handleDateClick(cloneDay)}
        >
          {formattedDate}
        </div>
      );
      
      day = addDays(day, 1);
      
      if (days.length === 7) {
        rows.push(<div key={day.toString()} className="calendar-row">{days}</div>);
        days = [];
      }
    }
    
    if (days.length > 0) {
      rows.push(<div key={day.toString()} className="calendar-row">{days}</div>);
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="month-nav" onClick={handlePrevMonth}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="current-month">{format(currentMonth, 'MMMM yyyy')}</div>
          <button className="month-nav" onClick={handleNextMonth}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="calendar-grid">
          {rows}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker">
      <div className="date-display" onClick={toggleCalendar}>
        <div className="date-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="selected-dates">
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </div>
        <div className="dropdown-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {isOpen && (
        <div className="date-picker-dropdown">
          <div className="date-picker-content">
            <div className="presets-container">
              <div className="presets-title">Quick Select</div>
              <button className="preset-button" onClick={() => handlePresetRange(7)}>Last 7 days</button>
              <button className="preset-button" onClick={() => handlePresetRange(30)}>Last 30 days</button>
              <button className="preset-button" onClick={() => handlePresetRange(90)}>Last 90 days</button>
              <button className="preset-button" onClick={() => handleLastMonthsRange(12)}>Last 12 months</button>
            </div>
            
            <div className="calendar-wrapper">
              {renderCalendar()}
              
              <div className="date-range-summary">
                <div className="date-summary">
                  <div className="date-label">Start:</div>
                  <div className="date-value">{formatDisplayDate(tempStartDate)}</div>
                </div>
                <div className="date-summary">
                  <div className="date-label">End:</div>
                  <div className="date-value">{formatDisplayDate(tempEndDate)}</div>
                </div>
              </div>
              
              <div className="date-picker-actions">
                <button className="cancel-button" onClick={() => setIsOpen(false)}>Cancel</button>
                <button 
                  className="apply-button" 
                  onClick={applyDateRange}
                  disabled={!tempStartDate || !tempEndDate}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};