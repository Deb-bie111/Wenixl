import React from 'react';
import { STATIONERY_PALETTES, StationeryOption, getStationeryOption } from '../data/stationery';
import { Palette, Check } from 'lucide-react';

interface StationeryPickerProps {
  selectedId: string;
  onChange: (id: string) => void;
  compact?: boolean;
  className?: string;
}

export const StationeryPicker: React.FC<StationeryPickerProps> = ({
  selectedId,
  onChange,
  compact = false,
  className = '',
}) => {
  const current = getStationeryOption(selectedId);

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-[#557048]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#557048] font-medium">
            Letter Paper Colour
          </span>
        </div>
        <span className="text-xs font-serif italic text-[#6B8A5B]">
          {current.name}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {STATIONERY_PALETTES.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              id={`stationery-color-btn-${option.id}`}
              onClick={() => onChange(option.id)}
              title={`${option.name} — ${option.description}`}
              className={`relative rounded-xl flex flex-col items-center justify-center p-2.5 transition-all border text-left ${
                isSelected
                  ? 'ring-2 ring-[#32432A] ring-offset-2 border-[#32432A] shadow-xs scale-105'
                  : 'hover:border-[#9DB39A] border-[#D5DFCE] hover:scale-102'
              }`}
              style={{ backgroundColor: option.swatchHex }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center">
                {isSelected ? (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      option.isDark ? 'text-[#F4F6F1]' : 'text-[#273521]'
                    }`}
                  />
                ) : null}
              </div>
              {!compact && (
                <span
                  className={`mt-1 text-[10px] font-sans font-medium truncate w-full text-center ${
                    option.isDark ? 'text-[#E6EEE0]' : 'text-[#273521]'
                  }`}
                >
                  {option.name.split(' ')[0]}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {!compact && (
        <p className="text-[11px] text-[#557048] font-serif italic">
          {current.description}
        </p>
      )}
    </div>
  );
};
