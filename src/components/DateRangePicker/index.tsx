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
  const [calendarType, setCalendarType] = useState<CalendarType>('persian');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [expectingStart, setExpectingStart] = useState(true);
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
      setExpectingStart(true);
    } else {
      const range = getPresetDateRange(preset);
      setDateRange(range);
      setActivePreset(preset);
      setIsSelectingRange(false);
      setExpectingStart(true);
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
    // Don't change expectingStart - let calendar click logic handle it
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
    // Don't change expectingStart - let calendar click logic handle it
  };

  const handleCalendarDateClick = (date: Date) => {
    setActivePreset(null);
    
    // Expecting START (odd click: 1st, 3rd, 5th, ...)
    if (expectingStart) {
      // Check if we need to reset based on previous range
      if (dateRange.end && date > dateRange.end) {
        // Clicked after previous end → Reset and set as new start
        setDateRange({ start: date, end: null });
        setIsSelectingRange(true);
        setExpectingStart(false);
      } else if (dateRange.start && dateRange.end && date >= dateRange.start && date <= dateRange.end) {
        // Clicked inside previous range → Shrink range, set as new start
        setDateRange({ start: date, end: dateRange.end });
        setIsSelectingRange(false);
        setExpectingStart(false);
      } else {
        // Normal case: set as start
        setDateRange({ start: date, end: null });
        setIsSelectingRange(true);
        setExpectingStart(false);
      }
      return;
    }
    
    // Expecting END (even click: 2nd, 4th, 6th, ...)
    if (!expectingStart) {
      // Check if clicked date is before start → Reset
      if (dateRange.start && date < dateRange.start) {
        setDateRange({ start: date, end: null });
        setIsSelectingRange(true);
        setExpectingStart(false); // Still expecting end after reset
      } else if (dateRange.start && dateRange.end && date >= dateRange.start && date <= dateRange.end) {
        // Clicked inside current range → Shrink range, set as new end
        setDateRange({ start: dateRange.start, end: date });
        setIsSelectingRange(false);
        setExpectingStart(true); // Next click will be start
      } else if (dateRange.start) {
        // Normal case: set as end
        setDateRange({ start: dateRange.start, end: date });
        setIsSelectingRange(false);
        setExpectingStart(true); // Next click will be start
      }
      return;
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
    setExpectingStart(true);
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
    setExpectingStart(true);
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
            isSelectingRange={isSelectingRange}
          />
        </div>
      </Card>
    </div>
  );
};