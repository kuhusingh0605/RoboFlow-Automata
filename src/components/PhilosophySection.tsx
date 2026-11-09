/**
 * RoboFlow — Section 2: System Philosophy
 * Massive centered serif typography with huge circular telemetry visualization
 * Annotations connected with delicate technical leader lines
 */

import React, { useState } from 'react';

const TELEMETRY_NODES = [
  {
    id: 'R04',
    name: 'ROBOT 04',
    state: 'MOVING_TO_PICKUP',
    battery: '82%',
    task: 'T-104',
    destination: 'Aisle A-12',
    route: 'Path Vector 04',
    speed: '1.4 m/s',
    clearance: '1.8m aisle margin',
    subsystem: 'Lidar & Ultrasonic Sync',
  },
  {
    id: 'R01',
    name: 'ROBOT 01',
    state: 'MOVING_TO_DROPOFF',
    battery: '91%',
    task: 'T-101',
    destination: 'Pack Station 01',
    route: 'Express Corridor East',
    speed: '1.6 m/s',
    clearance: '2.1m clear zone',
    subsystem: 'Payload Active Lock',
  },
  {
    id: 'R03',
    name: 'ROBOT 03',
    state: 'REROUTING',
    battery: '68%',
    task: 'T-103',
    destination: 'Sorting Conveyor 03',
    route: 'Alternative Perimeter 02',
    speed: '0.9 m/s',
    clearance: '0.8m detour margin',
    subsystem: 'Collision Evasion Active',
  },
];

export const PhilosophySection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const current = TELEMETRY_NODES[selectedIdx];

  return (
    <section id="system" className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA] overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-4">
            01 / SYSTEM PHILOSOPHY
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#111111] text-balance">
            Every movement begins with a state.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
            Robots in a distributed warehouse do not simply drive — they evaluate mathematical invariants. Deterministic state transitions ensure collision-free movement without central single-point bottlenecks.
          </p>

          {/* Unit Switcher */}
          <div className="mt-8 inline-flex items-center gap-1 border border-[#D5D8DA] bg-white/70 p-1">
            {TELEMETRY_NODES.map((node, i) => (
              <button
                key={node.id}
                onClick={() => setSelectedIdx(i)}
                className={`px-4 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                  selectedIdx === i
                    ? 'bg-[#111111] text-[#F2F2EF]'
                    : 'text-[#6E7277] hover:text-[#111111]'
                }`}
              >
                {node.name}
              </button>
            ))}
          </div>
        </div>

        {/* Huge Circular System Visualization */}
        <div className="relative mx-auto w-full max-w-[820px] aspect-square flex items-center justify-center">
          {/* Outer framing circle with thin technical lines */}
          <div className="absolute inset-0 rounded-full border border-[#D5D8DA]" />
          <div className="absolute inset-8 rounded-full border border-dashed border-[#D5D8DA]" />
          <div className="absolute inset-20 rounded-full border border-[#D5D8DA]/60" />

          {/* Core Central Circle */}
          <div className="relative z-10 w-72 h-72 sm:w-84 sm:h-84 rounded-full bg-white border border-[#D5D8DA] shadow-sm flex flex-col items-center justify-center text-center p-6 transition-all duration-500">
            {/* Soft inner telemetry ring */}
            <div className="absolute inset-3 rounded-full border border-[#65B9E8]/30 animate-pulse-subtle" />
            
            <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#6E7277]">
              UNIT IDENTIFIER
            </div>
            <div className="font-serif text-3xl sm:text-4xl text-[#111111] mt-1 font-normal tracking-wide">
              {current.name}
            </div>

            <div className="mt-4 inline-flex items-center gap-2 border-y border-[#D5D8DA] py-1.5 px-3">
              <span className="w-2 h-2 rounded-full bg-[#65B9E8] animate-ping" />
              <span className="font-mono text-xs sm:text-sm font-medium tracking-wider text-[#111111]">
                {current.state}
              </span>
            </div>

            <div className="mt-3 text-[11px] font-mono text-[#6E7277]">
              FSM NODE: ACTIVE & VERIFIED
            </div>
          </div>

          {/* SVG Leader Lines & Annotated Labels */}
          {/* Top-Left: Battery */}
          <div className="absolute top-8 left-0 sm:left-4 max-w-[180px] text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Power Reserve</div>
            <div className="font-serif text-2xl sm:text-3xl text-[#111111]">{current.battery}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">Inductive cell nominal</div>
            <div className="hidden sm:block w-24 h-px bg-[#D5D8DA] mt-2 relative">
              <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>

          {/* Top-Right: Task */}
          <div className="absolute top-8 right-0 sm:right-4 max-w-[180px] text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Current Task</div>
            <div className="font-serif text-2xl sm:text-3xl text-[#111111]">{current.task}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">Manifest linked</div>
            <div className="hidden sm:block w-24 h-px bg-[#D5D8DA] mt-2 ml-auto relative">
              <span className="absolute -left-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>

          {/* Mid-Left: Destination */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-6 max-w-[200px] text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Target Coordinate</div>
            <div className="font-serif text-xl sm:text-2xl text-[#111111]">{current.destination}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">{current.clearance}</div>
            <div className="hidden sm:block w-28 h-px bg-[#D5D8DA] mt-2 relative">
              <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>

          {/* Mid-Right: Speed */}
          <div className="absolute top-1/2 -translate-y-1/2 right-0 sm:-right-6 max-w-[200px] text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Dynamic Velocity</div>
            <div className="font-serif text-xl sm:text-2xl text-[#111111]">{current.speed}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">Torque matched</div>
            <div className="hidden sm:block w-28 h-px bg-[#D5D8DA] mt-2 ml-auto relative">
              <span className="absolute -left-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>

          {/* Bottom-Left: Route */}
          <div className="absolute bottom-8 left-0 sm:left-4 max-w-[200px] text-left">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Route Allocation</div>
            <div className="font-serif text-lg sm:text-xl text-[#111111]">{current.route}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">A* graph verified</div>
            <div className="hidden sm:block w-24 h-px bg-[#D5D8DA] mt-2 relative">
              <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>

          {/* Bottom-Right: Subsystem */}
          <div className="absolute bottom-8 right-0 sm:right-4 max-w-[200px] text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Subsystem</div>
            <div className="font-serif text-lg sm:text-xl text-[#111111]">{current.subsystem}</div>
            <div className="text-[11px] text-[#6E7277] mt-0.5">Zero dead-lock invariant</div>
            <div className="hidden sm:block w-24 h-px bg-[#D5D8DA] mt-2 ml-auto relative">
              <span className="absolute -left-1 -top-1 w-2 h-2 rounded-full border border-[#65B9E8] bg-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
