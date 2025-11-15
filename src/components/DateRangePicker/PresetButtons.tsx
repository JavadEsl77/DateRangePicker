import { Button } from '@/components/ui/button';
import { PresetType, CalendarType } from './types';

interface PresetButtonsProps {
  activePreset: PresetType;
  onPresetClick: (preset: PresetType) => void;
  calendarType: CalendarType;
}

const presetsConfig = {
  gregorian: [
    { id: 'today' as PresetType, label: 'Today', labelPersian: 'امروز', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { id: 'last3Days' as PresetType, label: '3 Days Ago', labelPersian: '۳ روز گذشته', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { id: 'last7Days' as PresetType, label: '7 Days Ago', labelPersian: '۷ روز گذشته', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { id: 'lastWeek' as PresetType, label: '1 Week Ago', labelPersian: '۱ هفته گذشته', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
    { id: 'lastMonth' as PresetType, label: '1 Month Ago', labelPersian: '۱ ماه گذشته', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    { id: 'last24Hours' as PresetType, label: '24 Hours Ago', labelPersian: '۲۴ ساعت گذشته', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
  ],
};

export const PresetButtons = ({ activePreset, onPresetClick, calendarType }: PresetButtonsProps) => {
  const presets = presetsConfig.gregorian;
  const borderClass = calendarType === 'persian' ? 'pl-6 border-l' : 'pr-6 border-r';
  return (
    <div className={`flex flex-col gap-2 ${borderClass} border-border min-w-[180px]`}>
      {presets.map((preset) => (
        <Button
          key={preset.id}
          variant="ghost"
          onClick={() => onPresetClick(preset.id)}
          className={`justify-start h-9 px-3 text-sm font-medium transition-all ${
            activePreset === preset.id 
              ? preset.color + ' shadow-sm' 
              : 'hover:bg-accent text-foreground'
          }`}
          dir={calendarType === 'persian' ? 'rtl' : 'ltr'}
        >
          {calendarType === 'persian' ? preset.labelPersian : preset.label}
        </Button>
      ))}
    </div>
  );
};
