import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DateRange, PresetType, CalendarType } from './types';
import { getPresetDateRange, formatDateToInput } from './utils';
import { DateInputs } from './DateInputs';
import { PresetButtons } from './PresetButtons';
import { DualCalendar } from './DualCalendar';
import moment from 'moment-jalaali';

export const DateRangePicker = () => {
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange>({ start: today, end: today });
  const [activePreset, setActivePreset] = useState<PresetType>('today');
  const [calendarType, setCalendarType] = useState<CalendarType>('gregorian');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validate date range
    if (dateRange.start && dateRange.end && dateRange.start > dateRange.end) {
      setError(calendarType === 'persian' ? 'تاریخ پایان نمی‌تواند قبل از تاریخ شروع باشد' : 'End date cannot be before start date');
    } else {
      setError(null);
    }
  }, [dateRange, calendarType]);

  const handlePresetClick = (preset: PresetType) => {
    if (preset === null) {
      setDateRange({ start: null, end: null });
      setActivePreset(null);
      setIsSelectingRange(false);
    } else {
      const range = getPresetDateRange(preset);
      setDateRange(range);
      setActivePreset(preset);
      setIsSelectingRange(false);
      if (range.start) {
        if (calendarType === 'persian') {
          const m = moment(range.start);
          setCurrentMonth(moment().jYear(m.jYear()).jMonth(m.jMonth()).jDate(1).toDate());
        } else {
          setCurrentMonth(new Date(range.start.getFullYear(), range.start.getMonth(), 1));
        }
      }
    }
  };

  const handleStartDateChange = (date: Date | null) => {
    setDateRange({ ...dateRange, start: date });
    setActivePreset(null);
    if (date) {
      if (calendarType === 'persian') {
        const m = moment(date);
        setCurrentMonth(moment().jYear(m.jYear()).jMonth(m.jMonth()).jDate(1).toDate());
      } else {
        setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
      }
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    setDateRange({ ...dateRange, end: date });
    setActivePreset(null);
  };

  const handleCalendarDateClick = (date: Date) => {
    setActivePreset(null);
    
    if (!isSelectingRange || !dateRange.start) {
      // First click - set start date
      setDateRange({ start: date, end: null });
      setIsSelectingRange(true);
    } else {
      // Second click - set end date
      if (date < dateRange.start) {
        // If clicked date is before start, swap them
        setDateRange({ start: date, end: dateRange.start });
      } else {
        setDateRange({ ...dateRange, end: date });
      }
      setIsSelectingRange(false);
    }
  };

  const displayStart = dateRange.start ? formatDateToInput(dateRange.start, calendarType) : (calendarType === 'persian' ? 'تاریخ شروع' : 'Start Date');
  const displayEnd = dateRange.end ? formatDateToInput(dateRange.end, calendarType) : (calendarType === 'persian' ? 'تاریخ پایان' : 'End Date');
  
  const displayRange = calendarType === 'persian' 
    ? `از ${displayStart} تا ${displayEnd}`
    : `From ${displayStart} to ${displayEnd}`;

  const handleGoToToday = () => {
    const today = new Date();
    setDateRange({ start: today, end: today });
    setActivePreset(null);
    if (calendarType === 'persian') {
      const m = moment(today);
      setCurrentMonth(moment().jYear(m.jYear()).jMonth(m.jMonth()).jDate(1).toDate());
    } else {
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  };

  const handleReset = () => {
    setDateRange({ start: null, end: null });
    setActivePreset(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
      <Card className={`w-full max-w-4xl p-6 shadow-xl bg-white min-h-[600px] ${calendarType === 'persian' ? 'font-persian' : ''}`} dir={calendarType === 'persian' ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between mb-6" dir="ltr">
          <div className="flex items-center gap-3">
            <Switch
              id="calendar-type"
              checked={calendarType === 'persian'}
              onCheckedChange={(checked) => setCalendarType(checked ? 'persian' : 'gregorian')}
            />
            <Label htmlFor="calendar-type" className="text-sm font-medium cursor-pointer whitespace-nowrap">
              {calendarType === 'persian' ? '🇮🇷 تقویم شمسی' : '🌍 Gregorian Calendar'}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs"
            >
              {calendarType === 'persian' ? 'ریست' : 'Reset'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoToToday}
              className="text-xs"
            >
              {calendarType === 'persian' ? 'برو به امروز' : 'Go to Today'}
            </Button>
          </div>
        </div>

        <DateInputs
          startDate={dateRange.start}
          endDate={dateRange.end}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          error={error}
          calendarType={calendarType}
        />

        {error && (
          <div className="mb-4 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-xs font-semibold text-primary tracking-wider mb-2">
            {calendarType === 'persian' ? 'بازه زمانی' : 'DATE RANGE'}
          </p>
          <p className="text-lg font-semibold text-foreground">
            {displayRange}
          </p>
        </div>

        <div className="flex gap-6">
          <PresetButtons
            activePreset={activePreset}
            onPresetClick={handlePresetClick}
            calendarType={calendarType}
          />
          <DualCalendar
            startDate={dateRange.start}
            endDate={dateRange.end}
            onDateClick={handleCalendarDateClick}
            calendarType={calendarType}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        </div>
      </Card>
    </div>
  );
};