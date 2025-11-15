export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type PresetType = 'thisWeek' | 'lastWeek' | 'last7Days' | 'currentMonth' | 'nextMonth' | null;

export type CalendarType = 'gregorian' | 'persian';