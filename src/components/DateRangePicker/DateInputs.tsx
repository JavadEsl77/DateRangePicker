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
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');

  useEffect(() => {
    setStartValue(formatDateToInput(startDate, calendarType));
  }, [startDate, calendarType]);

  useEffect(() => {
    setEndValue(formatDateToInput(endDate, calendarType));
  }, [endDate, calendarType]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartValue(value);
    
    if (value === '') {
      onStartDateChange(null);
      return;
    }
    const date = parseDateFromInput(value, calendarType);
    if (date) {
      onStartDateChange(date);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndValue(value);
    
    if (value === '') {
      onEndDateChange(null);
      return;
    }
    const date = parseDateFromInput(value, calendarType);
    if (date) {
      onEndDateChange(date);
    }
  };

  const placeholder = calendarType === 'persian' ? 'YYYY/MM/DD' : 'MM/DD/YYYY';

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex-1">
        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
          {calendarType === 'persian' ? 'شروع' : 'Start'}
        </label>
        <Input
          type="text"
          placeholder={placeholder}
          value={startValue}
          onChange={handleStartChange}
          className={`h-11 ${error ? 'border-destructive' : ''}`}
          dir={calendarType === 'persian' ? 'rtl' : 'ltr'}
        />
      </div>
      <span className="text-muted-foreground mt-6">–</span>
      <div className="flex-1">
        <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
          {calendarType === 'persian' ? 'پایان' : 'End'}
        </label>
        <Input
          type="text"
          placeholder={placeholder}
          value={endValue}
          onChange={handleEndChange}
          className={`h-11 ${error ? 'border-destructive' : ''}`}
          dir={calendarType === 'persian' ? 'rtl' : 'ltr'}
        />
      </div>
    </div>
  );
};