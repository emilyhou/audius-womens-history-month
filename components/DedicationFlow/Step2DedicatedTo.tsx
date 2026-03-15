'use client';

import { useState } from 'react';
import { DedicatedToOption } from '@/types';

interface Step2DedicatedToProps {
  onSelect: (option: DedicatedToOption, custom?: string) => void;
  selected: DedicatedToOption | null;
  customValue: string;
  onCustomChange?: (value: string) => void;
}

const options: DedicatedToOption[] = [
  'Mom',
  'Sister',
  'Grandmother',
  'Friend',
  'Mentor',
  'Partner',
  'Artist who inspires me',
  'Other',
];

export function Step2DedicatedTo({ onSelect, selected, customValue, onCustomChange }: Step2DedicatedToProps) {
  const [custom, setCustom] = useState(customValue);

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold mb-6 text-gray-900">Who is this for?</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => {
              // When selecting "Other", don't pass custom value yet to prevent auto-advance
              onSelect(option, option === 'Other' ? undefined : undefined);
            }}
            className={`p-4 rounded-lg border transition-all text-left font-medium ${selected === option
              ? 'border-gray-900 bg-gray-50 text-gray-900 font-semibold shadow-sm'
              : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:shadow-sm'
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selected === 'Other' && (
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2 text-gray-900">
            Please specify:
          </label>
          <input
            type="text"
            value={custom}
            onChange={(e) => {
              const newValue = e.target.value;
              setCustom(newValue);
              // Update parent state but don't trigger step advancement
              if (onCustomChange) {
                onCustomChange(newValue);
              }
            }}
            placeholder="e.g., Teacher, Aunt..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none shadow-sm focus:shadow-sm transition-all text-gray-900 bg-white"
          />
        </div>
      )}
    </div>
  );
}
