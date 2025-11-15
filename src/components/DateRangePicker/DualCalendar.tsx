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
  const getNextMonth = () => {
    if (calendarType === 'persian') {
      const m = moment(currentMonth);
      return m.add(1, 'jMonth').toDate();
    }
    return addMonths(currentMonth, 1);
  };

  const nextMonth = getNextMonth();

  const handlePrevMonth = () => {
    if (calendarType === 'persian') {
      const m = moment(currentMonth);
      onMonthChange(m.subtract(1, 'jMonth').toDate());
    } else {
      onMonthChange(subMonths(currentMonth, 1));
    }
  };

  const handleNextMonth = () => {
    if (calendarType === 'persian') {
      const m = moment(currentMonth);
      onMonthChange(m.add(1, 'jMonth').toDate());
    } else {
      onMonthChange(addMonths(currentMonth, 1));
    }
  };

  const paddingClass = calendarType === 'persian' ? 'pr-6' : 'pl-6';
  
  return (
    <div className={`flex-1 ${paddingClass}`}>
      <div className="flex gap-8">
        {calendarType === 'persian' ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}
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
  const getDaysInMonth = () => {
    if (calendarType === 'persian') {
      const m = moment(month);
      const jYear = m.jYear();
      const jMonth = m.jMonth();
      const daysInJalaliMonth = moment.jDaysInMonth(jYear, jMonth);
      
      const days: Date[] = [];
      for (let i = 1; i <= daysInJalaliMonth; i++) {
        const day = moment().jYear(jYear).jMonth(jMonth).jDate(i).toDate();
        days.push(day);
      }
      return days;
    }
    
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const daysInMonth = getDaysInMonth();
  
  const getStartDayOfWeek = () => {
    if (calendarType === 'persian') {
      // In Persian calendar, week starts on Saturday (6 in JS, which is Saturday)
      // We need to adjust: Saturday=0, Sunday=1, Monday=2, etc.
      const firstDay = daysInMonth[0];
      const dayOfWeek = firstDay.getDay();
      // Convert: Saturday(6)→0, Sunday(0)→1, Monday(1)→2, ..., Friday(5)→6
      return dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    }
    return startOfMonth(month).getDay();
  };

  const startDayOfWeek = getStartDayOfWeek();
  const paddingDays = Array(startDayOfWeek).fill(null);
  
  const weekDays = calendarType === 'persian' 
    ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const toPersianNumber = (num: number): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const getMonthTitle = () => {
    if (calendarType === 'persian') {
      const m = moment(month);
      const persianMonth = getPersianMonthName(m.jMonth());
      const persianYear = toPersianNumber(m.jYear());
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
            {calendarType === 'persian' ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
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
            {calendarType === 'persian' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
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
            ? toPersianNumber(parseInt(moment(date).format('jD')))
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