import { DateRange, PresetType, CalendarType } from './types';
import { startOfWeek, endOfWeek, subWeeks, subDays, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import moment from 'moment-jalaali';

export const getPresetDateRange = (preset: PresetType): DateRange => {
  const today = new Date();
  const now = new Date();
  
  switch (preset) {
    case 'today':
      return {
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0),
        end: now
      };
    case 'last3Days':
      return {
        start: subDays(today, 3),
        end: now
      };
    case 'last7Days':
      return {
        start: subDays(today, 7),
        end: now
      };
    case 'lastWeek':
      return {
        start: subWeeks(today, 1),
        end: now
      };
    case 'lastMonth':
      return {
        start: addMonths(today, -1),
        end: now
      };
    case 'last24Hours':
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return {
        start: twentyFourHoursAgo,
        end: now
      };
    default:
      return { start: null, end: null };
  }
};

export const getPersianMonthName = (monthIndex: number): string => {
  const persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
  ];
  return persianMonths[monthIndex];
};

const toPersianNumber = (num: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export const formatDateToInput = (date: Date | null, calendarType: CalendarType = 'gregorian'): string => {
  if (!date) return '';
  
  if (calendarType === 'persian') {
    const m = moment(date);
    const formatted = m.format('jYYYY/jMM/jDD');
    return toPersianNumber(formatted);
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const toEnglishNumber = (str: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  let result = str;
  persianDigits.forEach((digit, index) => {
    result = result.replace(new RegExp(digit, 'g'), String(index));
  });
  return result;
};

export const parseDateFromInput = (input: string, calendarType: CalendarType = 'gregorian'): Date | null => {
  const normalizedInput = toEnglishNumber(input);
  const parts = normalizedInput.split('/');
  if (parts.length !== 3) return null;
  
  if (calendarType === 'persian') {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;
    if (year < 1300 || year > 1500) return null;
    
    const m = moment(`${year}/${month}/${day}`, 'jYYYY/jM/jD');
    if (!m.isValid()) return null;
    return m.toDate();
  }
  
  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;
  
  const date = new Date(year, month - 1, day);
  if (date.getMonth() !== month - 1) return null;
  
  return date;
};

export const isDateInRange = (date: Date, start: Date | null, end: Date | null): boolean => {
  if (!start || !end) return false;
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
};

export const isSameDay = (date1: Date, date2: Date | null): boolean => {
  if (!date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};