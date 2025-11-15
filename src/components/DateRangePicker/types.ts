export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type PresetType = 'today' | 'last3Days' | 'last7Days' | 'lastWeek' | 'lastMonth' | 'last24Hours' | null;

export type CalendarType = 'gregorian' | 'persian';