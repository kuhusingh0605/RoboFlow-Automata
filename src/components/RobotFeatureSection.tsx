/**
 * RoboFlow — Section 3: Robot Feature Section
 * Split layout with top-down precision hardware visualization and editorial state exploration
 */

import React, { useState } from 'react';
import { RobotState, STATE_DESCRIPTIONS } from '../types/automata';

const FEATURED_STATES: RobotState[] = [
  'IDLE',
  'MOVING_TO_PICKUP',
  'PICKING_ITEM',
  'MOVING_TO_DROPOFF',
  'BLOCKED',
  'REROUTING',
  'CHARGING',
];

export const RobotFeatureSection: React.FC<{ onScrollToSimulator: () => void }> = ({
  onScrollToSimulator,
}) => {
  const [activeState, setActiveState] = useState<RobotState>('MOVING_TO_PICKUP');
  const details = STATE_DESCRIPTIONS[activeState];

  return (
    <section id="fleet" className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Precision Top-Down Hardware Visual Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-square w-full rounded-none border border-[#D5D8DA] bg-[#EFEFEC] overflow-hidden p-8 flex items-center justify-center">
              {/* Engineering Grid Underlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#111111 1px, transparent 1px), radial-gradient(#111111 1px, #EFEFEC 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Hardware Photo / CAD Asset */}
              <div className="relative z-10 w-full h-full max-w-[420px] max-h-[420px] flex items-center justify-center">
                <img
                  src="/src/assets/images/robot_chassis_topdown_1791219590615.jpg"
                  alt="RoboFlow Autonomous Mobile Robot Chassis Top-Down View"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain filter contrast-[1.05]"
                  onError={(e) => {
                    // Fallback container if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Dynamic Sensory Lidar Ring Overlay */}
                <div className="absolute inset-0 rounded-full border border-[#65B9E8]/40 pointer-events-none animate-pulse-subtle" />
                <div className="absolute inset-10 rounded-full border border-dashed border-[#65B9E8]/30 pointer-events-none" />

                {/* Laser scan ray */}
                <div className="absolute inset-0 animate-radar pointer-events-none">
                  <div className="w-1/2 h-[1px] ml-auto bg-gradient-to-r from-transparent to-[#65B9E8]" />
                </div>
              </div>

              {/* Technical Annotations on corners */}
              <div className="absolute top-4 left-4 text-[10px] font-mono text-[#6E7277] tracking-wider">
                CHASSIS: TITANIUM-COMPOSITE / UNIT-04
              </div>
              <div className="absolute top-4 right-4 text-[10px] font-mono text-[#6E7277] tracking-wider">
                PAYLOAD: 120 KG MAX
              </div>
              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-[#111111] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#65B9E8]" />
                <span className="font-semibold tracking-wide">{activeState}</span>
              </div>
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[#6E7277] tracking-wider">
                360° LIDAR ACTIVE
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative & FSM State Switcher */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-3">
              ROBOT / STATE
            </div>

            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.06] text-[#111111] text-balance">
              Not more robots.
              <br />
              More coordination.
            </h2>

            <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
              Each unit operates independently while responding to shared warehouse events, task assignments, congestion, and charging requirements. No central master controller freezes when a node slows down.
            </p>

            {/* Interactive State Filter Selector */}
            <div className="mt-8 border-t border-[#D5D8DA] pt-6">
              <div className="text-xs font-mono uppercase tracking-wider text-[#A0A3A7] mb-3">
                Simulate Robot State Response:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FEATURED_STATES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setActiveState(st)}
                    className={`px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                      activeState === st
                        ? 'bg-[#111111] text-[#F2F2EF] font-medium'
                        : 'bg-white/60 text-[#6E7277] border border-[#D5D8DA] hover:border-[#111111] hover:text-[#111111]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Active State Explain Box */}
              <div className="mt-6 p-5 bg-white border border-[#D5D8DA]">
                <div className="flex items-center justify-between text-xs font-mono text-[#6E7277]">
                  <span>CATEGORY: {details.category}</span>
                  <span className="text-[#65B9E8]">STATE TRANSITION INVARIANT</span>
                </div>
                <div className="font-serif text-2xl text-[#111111] mt-1">
                  {details.title}
                </div>
                <p className="mt-2 text-sm text-[#6E7277] leading-relaxed">
                  {details.desc}
                </p>
              </div>

              <div className="mt-8">
                <button
                  onClick={onScrollToSimulator}
                  className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider text-[#111111] hover:text-[#65B9E8] transition-colors cursor-pointer"
                >
                  <span>Explore in live simulator</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
