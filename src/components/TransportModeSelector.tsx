
import React from 'react';
import { cn } from '@/lib/utils';

interface TransportModeSelectorProps {
  selectedMode: string;
  onChange: (mode: string) => void;
}

const TransportModeSelector: React.FC<TransportModeSelectorProps> = ({
  selectedMode,
  onChange,
}) => {
  const transportModes = [
    { id: 'driving', label: 'Car', icon: '🚗', co2: 'High' },
    { id: 'cycling', label: 'Bike', icon: '🚲', co2: 'Zero' },
    { id: 'walking', label: 'Walk', icon: '🚶', co2: 'Zero' },
    { id: 'transit', label: 'Transit', icon: '🚌', co2: 'Low' },
  ];

  return (
    <div className="flex flex-wrap justify-between gap-2">
      {transportModes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => onChange(mode.id)}
          className={cn(
            "flex flex-col items-center justify-center rounded-lg px-3 py-2 transition-all",
            selectedMode === mode.id
              ? "bg-green-100 text-green-900 border-2 border-green-500"
              : "bg-white hover:bg-green-50 text-gray-700 border border-gray-200"
          )}
        >
          <span className="text-xl mb-1">{mode.icon}</span>
          <span className="text-sm font-medium">{mode.label}</span>
          <span 
            className={cn(
              "text-xs mt-1 px-1.5 py-0.5 rounded-full",
              mode.co2 === 'Zero' ? 'bg-green-100 text-green-800' :
              mode.co2 === 'Low' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            )}
          >
            {mode.co2}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TransportModeSelector;
