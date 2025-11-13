
import React from 'react';
import type { AdvancedToneProfile } from '../types';
import { TONE_PROFILES } from '../constants';

interface AdvancedToneMixerProps {
  value: AdvancedToneProfile;
  onChange: (value: AdvancedToneProfile) => void;
}

export const AdvancedToneMixer: React.FC<AdvancedToneMixerProps> = ({ value, onChange }) => {

  const handleSliderChange = (id: keyof AdvancedToneProfile, sliderValue: string) => {
    onChange({
      ...value,
      [id]: Number(sliderValue),
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Advanced Tone Mixer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-muted p-4 rounded-lg border border-border">
        {TONE_PROFILES.map(profile => (
          <div key={profile.id}>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor={profile.id} className="text-sm font-semibold text-muted-foreground">{profile.label}</label>
              <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{value[profile.id]} / 100</span>
            </div>
            <input
              type="range"
              id={profile.id}
              min="0"
              max="100"
              value={value[profile.id]}
              onChange={(e) => handleSliderChange(profile.id, e.target.value)}
              className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer accent-primary"
            />
             <div className="flex justify-between items-center text-xs text-muted-foreground/70 mt-1">
                <span>{profile.minLabel}</span>
                <span>{profile.maxLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
