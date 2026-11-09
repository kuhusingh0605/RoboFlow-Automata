/**
 * RoboFlow — Section 5: 24-Hour Simulation Rhythm
 * Full-width dark section with circular 24:00 timeline clock and phase inspection
 */

import React, { useState } from 'react';

interface OperationalPhase {
  name: string;
  hours: string;
  startHour: number;
  endHour: number;
  fsmFocus: string;
  description: string;
  activeRobotsPct: number;
}

const PHASES: OperationalPhase[] = [
  {
    name: 'Task Creation & Ingestion',
    hours: '06:00 – 09:00',
    startHour: 6,
    endHour: 9,
    fsmFocus: 'Task FSM (CREATED → ASSIGNED)',
    description: 'Order batches streamed from ERP. Automated dispatch pairs priority items with nearest idle robot units.',
    activeRobotsPct: 65,
  },
  {
    name: 'Pickup & Replenishment',
    hours: '09:00 – 13:00',
    startHour: 9,
    endHour: 13,
    fsmFocus: 'Robot FSM (MOVING_TO_PICKUP → PICKING)',
    description: 'High-volume shelf retrieval across aisle bays A through C. Synchronized corridor clearance.',
    activeRobotsPct: 92,
  },
  {
    name: 'Outbound Delivery Surge',
    hours: '13:00 – 17:00',
    startHour: 13,
    endHour: 17,
    fsmFocus: 'Robot FSM (MOVING_TO_DROPOFF → DELIVERING)',
    description: 'Peak truck staging and conveyor sortation. Maximum throughput with active congestion rerouting.',
    activeRobotsPct: 98,
  },
  {
    name: 'Charging & Staging Rotation',
    hours: '17:00 – 21:00',
    startHour: 17,
    endHour: 21,
    fsmFocus: 'Station FSM (AVAILABLE → CHARGING)',
    description: 'Units with <35% battery scheduled in staggered waves to inductive pads CS-01 through CS-03.',
    activeRobotsPct: 40,
  },
  {
    name: 'Idle & Repositioning',
    hours: '21:00 – 02:00',
    startHour: 21,
    endHour: 26, // 02:00 next day
    fsmFocus: 'Robot FSM (RETURNING → IDLE)',
    description: 'Fleet consolidates toward staging coordinates. Path optimizations compute pre-staging for morning orders.',
    activeRobotsPct: 20,
  },
  {
    name: 'Maintenance & Diagnostics',
    hours: '02:00 – 06:00',
    startHour: 2,
    endHour: 6,
    fsmFocus: 'Robot FSM (MAINTENANCE → IDLE)',
    description: 'Self-test routines: lidar calibration, wheel tread telemetry, firmware handshake, and emergency stop dry-run.',
    activeRobotsPct: 10,
  },
];

export const RhythmSection: React.FC = () => {
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState(2); // Outbound Delivery Surge default
  const activePhase = PHASES[selectedPhaseIdx];

  return (
    <section className="relative w-full bg-[#16191D] py-28 lg:py-36 px-6 lg:px-12 text-[#F2F2EF] border-b border-[#2A2F35] overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#65B9E8]/5 blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#65B9E8] mb-3">
            03 / CONTINUOUS CYCLE
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#F2F2EF] text-balance">
            Built around the rhythm
            <br />
            of warehouse operations.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#A0A3A7] font-normal leading-relaxed text-balance">
            Warehouses never pause. The Automata fleet seamlessly rotates through pickup waves, delivery deadlines, inductive pad recharges, and zero-downtime maintenance cycles across every 24-hour shift.
          </p>
        </div>

        {/* 24-Hour Circular Clock Simulation Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: The Circular 24-Hour Clock */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* Outer dial ring */}
              <div className="absolute inset-0 rounded-full border border-[#2A2F35]" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[#2A2F35]" />
              <div className="absolute inset-16 rounded-full border border-[#65B9E8]/20" />

              {/* Central Clock Core */}
              <div className="relative z-20 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#1A1E24] border border-[#2A2F35] flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] font-mono tracking-widest text-[#65B9E8]">
                  TIME HORIZON
                </span>
                <div className="font-serif text-4xl sm:text-5xl text-[#F2F2EF] mt-1 font-normal tracking-wide">
                  24:00
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#A0A3A7] mt-1">
                  Simulation Cycle
                </div>
                <div className="mt-3 text-[11px] font-mono text-[#65B9E8] bg-[#65B9E8]/10 px-2.5 py-0.5 border border-[#65B9E8]/30">
                  {activePhase.hours}
                </div>
              </div>

              {/* Radial Hour Markers */}
              {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => {
                const angle = (hour / 24) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                return (
                  <div
                    key={hour}
                    className="absolute text-[10px] font-mono text-[#6E7277]"
                    style={{
                      top: `calc(50% + ${Math.sin(rad) * 44}%)`,
                      left: `calc(50% + ${Math.cos(rad) * 44}%)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                );
              })}

              {/* Phase Wedges / Dots on the dial */}
              {PHASES.map((phase, idx) => {
                const midHour = (phase.startHour + (phase.endHour > 24 ? phase.endHour - 24 : phase.endHour)) / 2;
                const angle = (midHour / 24) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const isSelected = selectedPhaseIdx === idx;

                return (
                  <button
                    key={phase.name}
                    onClick={() => setSelectedPhaseIdx(idx)}
                    className={`absolute z-30 transition-all cursor-pointer p-1.5 rounded-full ${
                      isSelected
                        ? 'bg-[#65B9E8] scale-125 ring-4 ring-[#65B9E8]/30'
                        : 'bg-[#2A2F35] hover:bg-[#65B9E8]/60'
                    }`}
                    style={{
                      top: `calc(50% + ${Math.sin(rad) * 34}%)`,
                      left: `calc(50% + ${Math.cos(rad) * 34}%)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${phase.name} (${phase.hours})`}
                  >
                    <span className="block w-2.5 h-2.5 rounded-full" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Operational Phase Detail & Duty Cycle */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="border border-[#2A2F35] bg-[#16191D] p-8">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#65B9E8]">
                OPERATIONAL PHASE
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#F2F2EF] mt-1">
                {activePhase.name}
              </h3>

              <div className="mt-4 flex items-center gap-4 text-xs font-mono text-[#A0A3A7] border-y border-[#2A2F35] py-2.5">
                <span>WINDOW: {activePhase.hours}</span>
                <span>·</span>
                <span className="text-[#65B9E8]">{activePhase.fsmFocus}</span>
              </div>

              <p className="mt-5 text-sm text-[#A0A3A7] leading-relaxed">
                {activePhase.description}
              </p>

              <div className="mt-8">
                <div className="flex justify-between text-xs font-mono text-[#A0A3A7] mb-2">
                  <span>Fleet Utilization Ratio</span>
                  <span className="text-[#F2F2EF] font-medium">{activePhase.activeRobotsPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#2A2F35] overflow-hidden">
                  <div
                    className="h-full bg-[#65B9E8] transition-all duration-500"
                    style={{ width: `${activePhase.activeRobotsPct}%` }}
                  />
                </div>
              </div>

              {/* Selector Buttons */}
              <div className="mt-8 pt-6 border-t border-[#2A2F35]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277] mb-3">
                  Inspect All Phases:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PHASES.map((p, idx) => (
                    <button
                      key={p.name}
                      onClick={() => setSelectedPhaseIdx(idx)}
                      className={`px-3 py-2 text-left text-xs font-mono transition-all border cursor-pointer ${
                        selectedPhaseIdx === idx
                          ? 'border-[#65B9E8] text-[#65B9E8] bg-[#65B9E8]/5'
                          : 'border-[#2A2F35] text-[#A0A3A7] hover:border-[#6E7277] hover:text-[#F2F2EF]'
                      }`}
                    >
                      <div className="truncate">{p.name}</div>
                      <div className="text-[10px] opacity-70 mt-0.5">{p.hours}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
