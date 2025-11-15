import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { formatDateToInput, parseDateFromInput } from './utils';
import { CalendarType } from './types';

interface DateInputsProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  error: string | null;
  calendarType: CalendarType;
}

export const DateInputs = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  error,
  calendarType
}: DateInputsProps) => {
  const [startYear, setStartYear] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [startDay, setStartDay] = useState('');
  
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');

  useEffect(() => {
    if (startDate) {
      const formatted = formatDateToInput(startDate, calendarType);
      const parts = formatted.split('/');
      if (calendarType === 'persian') {
        setStartYear(parts[0] || '');
        setStartMonth(parts[1] || '');
        setStartDay(parts[2] || '');
      } else {
        setStartMonth(parts[0] || '');
        setStartDay(parts[1] || '');
        setStartYear(parts[2] || '');
      }
    } else {
      setStartYear('');
      setStartMonth('');
      setStartDay('');
    }
  }, [startDate, calendarType]);

  useEffect(() => {
    if (endDate) {
      const formatted = formatDateToInput(endDate, calendarType);
      const parts = formatted.split('/');
      if (calendarType === 'persian') {
        setEndYear(parts[0] || '');
        setEndMonth(parts[1] || '');
        setEndDay(parts[2] || '');
      } else {
        setEndMonth(parts[0] || '');
        setEndDay(parts[1] || '');
        setEndYear(parts[2] || '');
      }
    } else {
      setEndYear('');
      setEndMonth('');
      setEndDay('');
    }
  }, [endDate, calendarType]);

  const updateStartDate = (year: string, month: string, day: string) => {
    if (!year && !month && !day) {
      onStartDateChange(null);
      return;
    }
    
    const dateString = calendarType === 'persian' 
      ? `${year}/${month}/${day}`
      : `${month}/${day}/${year}`;
    
    const date = parseDateFromInput(dateString, calendarType);
    if (date) {
      onStartDateChange(date);
    }
  };

  const updateEndDate = (year: string, month: string, day: string) => {
    if (!year && !month && !day) {
      onEndDateChange(null);
      return;
    }
    
    const dateString = calendarType === 'persian' 
      ? `${year}/${month}/${day}`
      : `${month}/${day}/${year}`;
    
    const date = parseDateFromInput(dateString, calendarType);
    if (date) {
      onEndDateChange(date);
    }
  };

  const toEnglishNumber = (str: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let result = str;
    persianDigits.forEach((digit, index) => {
      result = result.replace(new RegExp(digit, 'g'), String(index));
    });
    return result;
  };

  const toPersianNumber = (str: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 4);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartYear(displayValue);
    if (value.length === 4 || value === '') {
      updateStartDate(value, toEnglishNumber(startMonth), toEnglishNumber(startDay));
    }
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartMonth(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), value, toEnglishNumber(startDay));
    }
  };

  const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartDay(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), value);
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 4);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndYear(displayValue);
    if (value.length === 4 || value === '') {
      updateEndDate(value, toEnglishNumber(endMonth), toEnglishNumber(endDay));
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndMonth(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), value, toEnglishNumber(endDay));
    }
  };

  const handleEndDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndDay(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), value);
    }
  };

  const handleBlur = (type: 'start' | 'end') => {
    if (type === 'start') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), toEnglishNumber(startDay));
    } else {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), toEnglishNumber(endDay));
    }
  };

  return (
    <div className="flex items-start gap-4 mb-6">
      {calendarType === 'persian' ? (
        <>
          {/* Start Date - Persian (Right side) */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
              شروع
            </label>
            <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`} dir="rtl">
              <input
                type="text"
                placeholder="روز"
                value={startDay}
                onChange={handleStartDayChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="ماه"
                value={startMonth}
                onChange={handleStartMonthChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="سال"
                value={startYear}
                onChange={handleStartYearChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
            </div>
          </div>
          {/* End Date - Persian (Left side) */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
              پایان
            </label>
            <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`} dir="rtl">
              <input
                type="text"
                placeholder="روز"
                value={endDay}
                onChange={handleEndDayChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="ماه"
                value={endMonth}
                onChange={handleEndMonthChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="سال"
                value={endYear}
                onChange={handleEndYearChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                dir="rtl"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Start Date - Gregorian (Left side) */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-medium">
              Start
            </label>
            <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`}>
              <input
                type="text"
                placeholder="DD"
                value={startDay}
                onChange={handleStartDayChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="MM"
                value={startMonth}
                onChange={handleStartMonthChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="YYYY"
                value={startYear}
                onChange={handleStartYearChange}
                onBlur={() => handleBlur('start')}
                className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
            </div>
          </div>
          {/* End Date - Gregorian (Right side) */}
          <div>
            <label className="text-xs text-muted-foreground mb-2 block font-medium">
              End
            </label>
            <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`}>
              <input
                type="text"
                placeholder="DD"
                value={endDay}
                onChange={handleEndDayChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="MM"
                value={endMonth}
                onChange={handleEndMonthChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
              <span className="text-muted-foreground text-sm px-0.5">/</span>
              <input
                type="text"
                placeholder="YYYY"
                value={endYear}
                onChange={handleEndYearChange}
                onBlur={() => handleBlur('end')}
                className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};