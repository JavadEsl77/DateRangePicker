import { Button } from '@/components/ui/button';
import { PresetType } from './types';

interface PresetButtonsProps {
  activePreset: PresetType;
  onPresetClick: (preset: PresetType) => void;
}

const presets = [
  { id: 'thisWeek' as PresetType, label: 'This Week', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
  { id: 'lastWeek' as PresetType, label: 'Last Week', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
  { id: 'last7Days' as PresetType, label: 'Last 7 Days', color: 'bg-green-50 hover:bg-green-100 text-green-700' },
  { id: 'currentMonth' as PresetType, label: 'Current Month', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
  { id: 'nextMonth' as PresetType, label: 'Next Month', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
];

export const PresetButtons = ({ activePreset, onPresetClick }: PresetButtonsProps) => {
  return (
    <div className="flex flex-col gap-2 pr-6 border-r border-border min-w-[160px]">
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
        >
          {preset.label}
        </Button>
      ))}
      <Button
        variant="ghost"
        onClick={() => onPresetClick(null)}
        className="justify-start h-9 px-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground mt-2"
      >
        Reset
      </Button>
    </div>
  );
};
