/**
 * RoboFlow — Section 6: Robot States
 * Editorial multi-column typography with horizontal technical lines and restrained blue accents
 * No bulky cards — pure typographic restraint and engineering clarity
 */

import React from 'react';

interface StateItem {
  id: string;
  name: string;
  shortDesc: string;
  invariant: string;
  transitionsTo: string[];
}

const STATES_LIST: StateItem[] = [
  {
    id: '01',
    name: 'IDLE',
    shortDesc: 'Robot rests in queue, maintains wireless telemetry, and awaits next task assignment.',
    invariant: 'Velocity = 0.0 m/s; Standby power 12W',
    transitionsTo: ['MOVING_TO_PICKUP', 'CHARGING', 'MAINTENANCE'],
  },
  {
    id: '02',
    name: 'MOVING',
    shortDesc: 'Robot travels toward pickup or dropoff waypoint along an evaluated collision-free vector.',
    invariant: 'Velocity ≤ 1.6 m/s; Lidar 360° active',
    transitionsTo: ['PICKING', 'DELIVERING', 'BLOCKED', 'CHARGING'],
  },
  {
    id: '03',
    name: 'PICKING',
    shortDesc: 'Docked at assigned storage rack bay; payload transfer and weight verification initiated.',
    invariant: 'Brakes locked; Optical alignment check',
    transitionsTo: ['MOVING_TO_DROPOFF'],
  },
  {
    id: '04',
    name: 'DELIVERING',
    shortDesc: 'Payload unloaded to packing conveyor, outbound freight pallet, or sortation station.',
    invariant: 'Brakes locked; RFID handoff confirmed',
    transitionsTo: ['RETURNING'],
  },
  {
    id: '05',
    name: 'BLOCKED',
    shortDesc: 'Proximity sensor detects obstacle, human operator, or traffic jam; emergency decelerate.',
    invariant: 'Safety distance ≥ 0.5m maintained',
    transitionsTo: ['REROUTING'],
  },
  {
    id: '06',
    name: 'REROUTING',
    shortDesc: 'A* graph pathfinder computes an alternative perimeter route to circumvent the obstruction.',
    invariant: 'Recalculation latency ≤ 120ms',
    transitionsTo: ['MOVING_TO_DROPOFF', 'MOVING_TO_PICKUP'],
  },
  {
    id: '07',
    name: 'CHARGING',
    shortDesc: 'Unit docks on inductive charging station to replenish lithium battery cells.',
    invariant: 'Charge current matched to temperature',
    transitionsTo: ['IDLE'],
  },
  {
    id: '08',
    name: 'MAINTENANCE',
    shortDesc: 'Wheel alignment, sensor re-calibration, optical glass cleaning, or firmware update.',
    invariant: 'Motors offline; Diagnostics log saved',
    transitionsTo: ['IDLE'],
  },
];

export const RobotStatesSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-3">
            04 / FORMAL STATE REGISTRY
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#111111] text-balance">
            Every state has a role.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
            The Robot Finite State Machine partitions continuous real-world movement into strictly mutually exclusive behavioral regimes. Each transition is governed by mathematical preconditions.
          </p>
        </div>

        {/* Editorial State Rows / Columns with Horizontal Hairlines */}
        <div className="border-t border-[#D5D8DA]">
          {STATES_LIST.map((item) => (
            <div
              key={item.id}
              className="group py-8 border-b border-[#D5D8DA] grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline transition-colors hover:bg-white/40 px-2 sm:px-4"
            >
              {/* Index & Name */}
              <div className="md:col-span-4 flex items-baseline gap-4">
                <span className="font-mono text-xs text-[#A0A3A7] group-hover:text-[#65B9E8] transition-colors">
                  {item.id}
                </span>
                <div>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#111111] tracking-tight">
                    {item.name}
                  </h3>
                  <div className="mt-1 font-mono text-[11px] text-[#65B9E8]">
                    {item.invariant}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-5 text-sm text-[#6E7277] leading-relaxed">
                {item.shortDesc}
              </div>

              {/* Permitted Transitions */}
              <div className="md:col-span-3 text-right md:text-right font-mono text-xs text-[#A0A3A7]">
                <div className="text-[10px] uppercase tracking-wider text-[#6E7277] mb-1">
                  Valid Transitions:
                </div>
                <div className="text-[#111111] font-mono text-[11px]">
                  {item.transitionsTo.join(' → ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
