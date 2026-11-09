/**
 * RoboFlow — Section 9: Find Your Flow (Presets Index)
 * Large editorial text rows styled as a refined index
 */

import React from 'react';
import { SIMULATION_PRESETS } from '../simulation/presets';

interface PresetsSectionProps {
  onSelectPreset: (presetId: string) => void;
}

export const PresetsSection: React.FC<PresetsSectionProps> = ({ onSelectPreset }) => {
  return (
    <section className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-3">
            07 / SCENARIOS
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#111111] text-balance">
            Find your warehouse flow.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
            Select a verified simulation profile to observe how the automata system adapts under stress, battery depletion, or physical corridor obstructions.
          </p>
        </div>

        {/* Editorial Index Rows */}
        <div className="border-t border-[#D5D8DA]">
          {SIMULATION_PRESETS.map((preset, index) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className="group w-full py-8 border-b border-[#D5D8DA] flex flex-col md:flex-row md:items-center justify-between text-left transition-all hover:bg-white/50 px-2 sm:px-6 cursor-pointer"
            >
              <div className="flex items-baseline gap-6 md:gap-12">
                <span className="font-mono text-xs text-[#A0A3A7] group-hover:text-[#65B9E8] transition-colors">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#111111] group-hover:translate-x-1 transition-transform">
                    {preset.title}
                  </h3>
                  <div className="text-xs font-mono text-[#6E7277] mt-1">
                    {preset.subtitle} · {preset.robotCount} Units Active
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-6">
                <p className="hidden lg:block max-w-md text-xs text-[#6E7277] text-right">
                  {preset.description}
                </p>
                <div className="font-mono text-sm text-[#111111] group-hover:text-[#65B9E8] flex items-center gap-2">
                  <span className="hidden sm:inline text-xs tracking-wider">LOAD SCENARIO</span>
                  <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
