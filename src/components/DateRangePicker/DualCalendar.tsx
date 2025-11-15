import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { isDateInRange, isSameDay, getPersianMonthName } from './utils';
import { CalendarType } from './types';
import moment from 'moment-jalaali';

interface DualCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (date: Date) => void;
  calendarType: CalendarType;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export const DualCalendar = ({ startDate, endDate, onDateClick, calendarType, currentMonth, onMonthChange }: DualCalendarProps) => {
  const nextMonth = addMonths(currentMonth, 1);

  useEffect(() => {
    // Navigate to start date month when it changes
    if (startDate) {
      const startMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      if (startMonth.getTime() !== currentMonth.getTime()) {
        onMonthChange(startMonth);
      }
    }
  }, [startDate]);

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex-1 pl-6">
      <div className="flex gap-8">
        <CalendarMonth
          month={currentMonth}
          startDate={startDate}
          endDate={endDate}
          onDateClick={onDateClick}
          onPrevMonth={handlePrevMonth}
          showPrevButton
          calendarType={calendarType}
        />
        <CalendarMonth
          month={nextMonth}
          startDate={startDate}
          endDate={endDate}
          onDateClick={onDateClick}
          onNextMonth={handleNextMonth}
          showNextButton
          calendarType={calendarType}
        />
      </div>
    </div>
  );
};

interface CalendarMonthProps {
  month: Date;
  startDate: Date | null;
  endDate: Date | null;
  onDateClick: (date: Date) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  showPrevButton?: boolean;
  showNextButton?: boolean;
  calendarType: CalendarType;
}

const CalendarMonth = ({
  month,
  startDate,
  endDate,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  showPrevButton,
  showNextButton,
  calendarType,
}: CalendarMonthProps) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDayOfWeek = monthStart.getDay();
  const paddingDays = Array(startDayOfWeek).fill(null);
  
  const weekDays = calendarType === 'persian' 
    ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getMonthTitle = () => {
    if (calendarType === 'persian') {
      const m = moment(month);
      const persianMonth = getPersianMonthName(m.jMonth());
      const persianYear = m.jYear();
      return `${persianMonth} ${persianYear}`;
    }
    return format(month, 'MMMM yyyy');
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        {showPrevButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-8" />
        )}
        <h3 className="font-semibold text-sm">
          {getMonthTitle()}
        </h3>
        {showNextButton ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="h-8" />
        ))}
        
        {daysInMonth.map((date) => {
          const isStart = isSameDay(date, startDate);
          const isEnd = isSameDay(date, endDate);
          const inRange = isDateInRange(date, startDate, endDate);
          const isCurrentDay = isToday(date);
          
          const dayNumber = calendarType === 'persian' 
            ? moment(date).format('jD')
            : format(date, 'd');
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateClick(date)}
              className={`
                h-8 flex items-center justify-center text-sm rounded-md transition-all
                ${isStart || isEnd 
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm' 
                  : inRange 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-accent'
                }
                ${isCurrentDay && !isStart && !isEnd ? 'ring-1 ring-primary' : ''}
              `}
            >
              {dayNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};