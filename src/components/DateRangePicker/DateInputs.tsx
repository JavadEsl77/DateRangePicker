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
  const [startHour, setStartHour] = useState('');
  const [startMinute, setStartMinute] = useState('');
  
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');

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
      const hours = startDate.getHours().toString().padStart(2, '0');
      const minutes = startDate.getMinutes().toString().padStart(2, '0');
      setStartHour(calendarType === 'persian' ? toPersianNumber(hours) : hours);
      setStartMinute(calendarType === 'persian' ? toPersianNumber(minutes) : minutes);
    } else {
      setStartYear('');
      setStartMonth('');
      setStartDay('');
      setStartHour('');
      setStartMinute('');
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
      const hours = endDate.getHours().toString().padStart(2, '0');
      const minutes = endDate.getMinutes().toString().padStart(2, '0');
      setEndHour(calendarType === 'persian' ? toPersianNumber(hours) : hours);
      setEndMinute(calendarType === 'persian' ? toPersianNumber(minutes) : minutes);
    } else {
      setEndYear('');
      setEndMonth('');
      setEndDay('');
      setEndHour('');
      setEndMinute('');
    }
  }, [endDate, calendarType]);

  const updateStartDate = (year: string, month: string, day: string, hour?: string, minute?: string) => {
    if (!year && !month && !day) {
      onStartDateChange(null);
      return;
    }
    
    const dateString = calendarType === 'persian' 
      ? `${year}/${month}/${day}`
      : `${month}/${day}/${year}`;
    
    const date = parseDateFromInput(dateString, calendarType);
    if (date) {
      const h = hour ? parseInt(hour) : 0;
      const m = minute ? parseInt(minute) : 0;
      date.setHours(h, m, 0, 0);
      onStartDateChange(date);
    }
  };

  const updateEndDate = (year: string, month: string, day: string, hour?: string, minute?: string) => {
    if (!year && !month && !day) {
      onEndDateChange(null);
      return;
    }
    
    const dateString = calendarType === 'persian' 
      ? `${year}/${month}/${day}`
      : `${month}/${day}/${year}`;
    
    const date = parseDateFromInput(dateString, calendarType);
    if (date) {
      const h = hour ? parseInt(hour) : 0;
      const m = minute ? parseInt(minute) : 0;
      date.setHours(h, m, 0, 0);
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
      updateStartDate(value, toEnglishNumber(startMonth), toEnglishNumber(startDay), toEnglishNumber(startHour), toEnglishNumber(startMinute));
    }
  };

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartMonth(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), value, toEnglishNumber(startDay), toEnglishNumber(startHour), toEnglishNumber(startMinute));
    }
  };

  const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartDay(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), value, toEnglishNumber(startHour), toEnglishNumber(startMinute));
    }
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 4);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndYear(displayValue);
    if (value.length === 4 || value === '') {
      updateEndDate(value, toEnglishNumber(endMonth), toEnglishNumber(endDay), toEnglishNumber(endHour), toEnglishNumber(endMinute));
    }
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndMonth(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), value, toEnglishNumber(endDay), toEnglishNumber(endHour), toEnglishNumber(endMinute));
    }
  };

  const handleEndDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    const value = inputValue.replace(/\D/g, '').slice(0, 2);
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndDay(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), value, toEnglishNumber(endHour), toEnglishNumber(endMinute));
    }
  };

  const handleStartHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    let value = inputValue.replace(/\D/g, '').slice(0, 2);
    if (value && parseInt(value) > 23) value = '23';
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartHour(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), toEnglishNumber(startDay), value, toEnglishNumber(startMinute));
    }
  };

  const handleStartMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    let value = inputValue.replace(/\D/g, '').slice(0, 2);
    if (value && parseInt(value) > 59) value = '59';
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setStartMinute(displayValue);
    if (value.length === 2 || value === '') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), toEnglishNumber(startDay), toEnglishNumber(startHour), value);
    }
  };

  const handleEndHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    let value = inputValue.replace(/\D/g, '').slice(0, 2);
    if (value && parseInt(value) > 23) value = '23';
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndHour(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), toEnglishNumber(endDay), value, toEnglishNumber(endMinute));
    }
  };

  const handleEndMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = toEnglishNumber(e.target.value);
    let value = inputValue.replace(/\D/g, '').slice(0, 2);
    if (value && parseInt(value) > 59) value = '59';
    const displayValue = calendarType === 'persian' ? toPersianNumber(value) : value;
    setEndMinute(displayValue);
    if (value.length === 2 || value === '') {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), toEnglishNumber(endDay), toEnglishNumber(endHour), value);
    }
  };

  const handleBlur = (type: 'start' | 'end') => {
    if (type === 'start') {
      updateStartDate(toEnglishNumber(startYear), toEnglishNumber(startMonth), toEnglishNumber(startDay), toEnglishNumber(startHour), toEnglishNumber(startMinute));
    } else {
      updateEndDate(toEnglishNumber(endYear), toEnglishNumber(endMonth), toEnglishNumber(endDay), toEnglishNumber(endHour), toEnglishNumber(endMinute));
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: string, max?: number) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const input = e.currentTarget;
      const currentValue = toEnglishNumber(input.value);
      let numValue = parseInt(currentValue) || 0;
      
      if (e.key === 'ArrowUp') {
        numValue++;
      } else {
        numValue--;
      }
      
      // Apply constraints
      if (max !== undefined && numValue > max) {
        numValue = 0;
      } else if (numValue < 0) {
        numValue = max !== undefined ? max : 0;
      }
      
      const paddedValue = field === 'year' ? String(numValue).padStart(4, '0') : String(numValue).padStart(2, '0');
      const displayValue = calendarType === 'persian' ? toPersianNumber(paddedValue) : paddedValue;
      
      // Update the appropriate state
      if (field === 'startYear') setStartYear(displayValue);
      else if (field === 'startMonth') setStartMonth(displayValue);
      else if (field === 'startDay') setStartDay(displayValue);
      else if (field === 'startHour') setStartHour(displayValue);
      else if (field === 'startMinute') setStartMinute(displayValue);
      else if (field === 'endYear') setEndYear(displayValue);
      else if (field === 'endMonth') setEndMonth(displayValue);
      else if (field === 'endDay') setEndDay(displayValue);
      else if (field === 'endHour') setEndHour(displayValue);
      else if (field === 'endMinute') setEndMinute(displayValue);
      
      // Trigger update
      setTimeout(() => {
        if (field.startsWith('start')) {
          updateStartDate(
            toEnglishNumber(field === 'startYear' ? displayValue : startYear),
            toEnglishNumber(field === 'startMonth' ? displayValue : startMonth),
            toEnglishNumber(field === 'startDay' ? displayValue : startDay),
            toEnglishNumber(field === 'startHour' ? displayValue : startHour),
            toEnglishNumber(field === 'startMinute' ? displayValue : startMinute)
          );
        } else {
          updateEndDate(
            toEnglishNumber(field === 'endYear' ? displayValue : endYear),
            toEnglishNumber(field === 'endMonth' ? displayValue : endMonth),
            toEnglishNumber(field === 'endDay' ? displayValue : endDay),
            toEnglishNumber(field === 'endHour' ? displayValue : endHour),
            toEnglishNumber(field === 'endMinute' ? displayValue : endMinute)
          );
        }
      }, 0);
    }
  };

  return (
    <div className="flex items-start gap-4 mb-6">
      {calendarType === 'persian' ? (
        <>
          {/* Start Date - Persian (Right side) */}
          <div className="flex items-end gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
                ساعت شروع
              </label>
              <div className="flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background border-input" dir="rtl">
                <input
                  type="text"
                  placeholder="دقیقه"
                  value={startMinute}
                  onChange={handleStartMinuteChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startMinute', 59)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
                <span className="text-muted-foreground text-sm px-0.5">:</span>
                <input
                  type="text"
                  placeholder="ساعت"
                  value={startHour}
                  onChange={handleStartHourChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startHour', 23)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
                شروع
              </label>
              <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`} dir="rtl">
                <input
                  type="text"
                  placeholder="روز"
                  value={startDay}
                  onChange={handleStartDayChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startDay', 31)}
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
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startMonth', 12)}
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
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startYear', 9999)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
          {/* End Date - Persian (Left side) */}
          <div className="flex items-end gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
                ساعت پایان
              </label>
              <div className="flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background border-input" dir="rtl">
                <input
                  type="text"
                  placeholder="دقیقه"
                  value={endMinute}
                  onChange={handleEndMinuteChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endMinute', 59)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
                <span className="text-muted-foreground text-sm px-0.5">:</span>
                <input
                  type="text"
                  placeholder="ساعت"
                  value={endHour}
                  onChange={handleEndHourChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endHour', 23)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block font-medium text-right">
                پایان
              </label>
              <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`} dir="rtl">
                <input
                  type="text"
                  placeholder="روز"
                  value={endDay}
                  onChange={handleEndDayChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endDay', 31)}
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
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endMonth', 12)}
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
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endYear', 9999)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Start Date - Gregorian (Left side) */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                Start
              </label>
              <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`}>
                <input
                  type="text"
                  placeholder="DD"
                  value={startDay}
                  onChange={handleStartDayChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startDay', 31)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">/</span>
                <input
                  type="text"
                  placeholder="MM"
                  value={startMonth}
                  onChange={handleStartMonthChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startMonth', 12)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">/</span>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={startYear}
                  onChange={handleStartYearChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startYear', 9999)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                Start Time
              </label>
              <div className="flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background border-input">
                <input
                  type="text"
                  placeholder="HH"
                  value={startHour}
                  onChange={handleStartHourChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startHour', 23)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">:</span>
                <input
                  type="text"
                  placeholder="MM"
                  value={startMinute}
                  onChange={handleStartMinuteChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'startMinute', 59)}
                  onBlur={() => handleBlur('start')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
              </div>
            </div>
          </div>
          {/* End Date - Gregorian (Right side) */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                End
              </label>
              <div className={`flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background ${error ? 'border-destructive' : 'border-input'}`}>
                <input
                  type="text"
                  placeholder="DD"
                  value={endDay}
                  onChange={handleEndDayChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endDay', 31)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">/</span>
                <input
                  type="text"
                  placeholder="MM"
                  value={endMonth}
                  onChange={handleEndMonthChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endMonth', 12)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-6 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">/</span>
                <input
                  type="text"
                  placeholder="YYYY"
                  value={endYear}
                  onChange={handleEndYearChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endYear', 9999)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-12 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-2 block font-medium">
                End Time
              </label>
              <div className="flex items-center gap-0.5 px-3 py-2 rounded-md border bg-background border-input">
                <input
                  type="text"
                  placeholder="HH"
                  value={endHour}
                  onChange={handleEndHourChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endHour', 23)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
                <span className="text-muted-foreground text-sm px-0.5">:</span>
                <input
                  type="text"
                  placeholder="MM"
                  value={endMinute}
                  onChange={handleEndMinuteChange}
                  onFocus={handleFocus}
                  onKeyDown={(e) => handleKeyDown(e, 'endMinute', 59)}
                  onBlur={() => handleBlur('end')}
                  className="h-7 w-8 text-center text-sm p-0 border-0 bg-transparent outline-none focus:outline-none"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};