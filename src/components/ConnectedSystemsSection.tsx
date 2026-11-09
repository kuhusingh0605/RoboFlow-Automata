/**
 * RoboFlow — Section 4: Connected Systems
 * Minimalist circular multi-FSM system diagram with thin vector lines
 */

import React, { useState } from 'react';

interface SystemNode {
  id: string;
  name: string;
  fsmName: string;
  states: string[];
  desc: string;
  positionAngle: number; // degrees
}

const NODES: SystemNode[] = [
  {
    id: 'fleet',
    name: 'Robot Fleet',
    fsmName: 'Robot FSM',
    states: ['IDLE', 'MOVING', 'PICKING', 'DELIVERING', 'BLOCKED', 'REROUTING', 'CHARGING'],
    desc: 'Controls physical mobile units, velocity limits, obstacle evasion, and battery conservation.',
    positionAngle: 270, // Top
  },
  {
    id: 'task',
    name: 'Task Engine',
    fsmName: 'Task FSM',
    states: ['CREATED', 'ASSIGNED', 'IN_PROGRESS', 'PICKED', 'DELIVERED', 'COMPLETED'],
    desc: 'Manages incoming inventory requests, payload manifests, and pickup-dropoff pairing.',
    positionAngle: 342, // Top-right
  },
  {
    id: 'charging',
    name: 'Charging Network',
    fsmName: 'Station FSM',
    states: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'CHARGING'],
    desc: 'Arbitrates inductive charging pad allocation and prioritizes critical battery units.',
    positionAngle: 54, // Bottom-right
  },
  {
    id: 'zones',
    name: 'Warehouse Zones',
    fsmName: 'Zone FSM',
    states: ['CLEAR', 'BUSY', 'CONGESTED', 'BLOCKED'],
    desc: 'Tracks sectional density, corridor bottleneck thresholds, and aisle traffic safety.',
    positionAngle: 126, // Bottom-left
  },
  {
    id: 'planner',
    name: 'Path Planner',
    fsmName: 'Graph Mesh FSM',
    states: ['OPTIMAL', 'CORRIDOR_CHOKE', 'DETOUR_COMPUTED', 'SYNCHRONIZED'],
    desc: 'A* graph search calculating non-intersecting coordinate paths and dynamic perimeter detours.',
    positionAngle: 198, // Top-left
  },
];

export const ConnectedSystemsSection: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('fleet');
  const activeNode = NODES.find((n) => n.id === activeNodeId) || NODES[0];

  return (
    <section id="architecture" className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-3">
            02 / SYSTEM ARCHITECTURE
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#111111] text-balance">
            One warehouse.
            <br />
            Connected systems.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
            RoboFlow orchestrates multiple distinct finite-state machines in continuous synchronization. When a corridor zone changes state to CONGESTED, the Robot FSM triggers an immediate REROUTING event.
          </p>
        </div>

        {/* Circular System Diagram */}
        <div className="relative mx-auto w-full max-w-[760px] aspect-square flex items-center justify-center my-6">
          {/* Outer Boundary Ring */}
          <div className="absolute inset-4 sm:inset-10 rounded-full border border-[#D5D8DA]" />
          <div className="absolute inset-16 sm:inset-24 rounded-full border border-dashed border-[#D5D8DA]/70" />

          {/* Center Hub: ROBOFLOW CORE */}
          <div className="relative z-20 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-[#16191D] text-[#F2F2EF] border border-[#2A2F35] shadow-md flex flex-col items-center justify-center p-6 text-center">
            <span className="w-2 h-2 rounded-full bg-[#65B9E8] mb-2 animate-ping" />
            <div className="text-[10px] font-mono tracking-widest text-[#65B9E8]">
              SYNCHRONIZER
            </div>
            <div className="font-serif text-xl sm:text-2xl mt-1 tracking-wide">
              ROBOFLOW CORE
            </div>
            <div className="text-[11px] text-[#A0A3A7] font-mono mt-1">
              5 FSMs Coupled
            </div>
          </div>

          {/* Surrounding Orbiting FSM Nodes */}
          {NODES.map((node) => {
            const rad = ((node.positionAngle - 90) * Math.PI) / 180;
            // Radius distance from center
            const radius = 260; // scaled via transform on responsive container
            const isSelected = activeNode.id === node.id;

            return (
              <div
                key={node.id}
                className="absolute z-30 transition-transform duration-300"
                style={{
                  top: `calc(50% + ${Math.sin(rad) * 44}%)`,
                  left: `calc(50% + ${Math.cos(rad) * 44}%)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Thin SVG interconnect line to center */}
                <svg
                  className="absolute pointer-events-none"
                  style={{
                    width: '300px',
                    height: '300px',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    overflow: 'visible',
                  }}
                >
                  <line
                    x1="150"
                    y1="150"
                    x2={150 - Math.cos(rad) * 140}
                    y2={150 - Math.sin(rad) * 140}
                    stroke={isSelected ? '#65B9E8' : '#D5D8DA'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                  />
                </svg>

                {/* Node Button */}
                <button
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full border transition-all flex flex-col items-center justify-center p-3 text-center cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#111111] shadow-lg scale-105'
                      : 'bg-[#F2F2F0] border-[#D5D8DA] hover:border-[#111111] hover:bg-white'
                  }`}
                >
                  <div className="text-[9px] font-mono uppercase tracking-wider text-[#6E7277]">
                    {node.fsmName}
                  </div>
                  <div className="font-serif text-sm sm:text-base text-[#111111] font-medium mt-0.5">
                    {node.name}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-[#65B9E8]">
                    {node.states.length} States
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Node Detailed Specification Panel */}
        <div className="mt-16 mx-auto max-w-3xl border border-[#D5D8DA] bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D5D8DA] pb-4 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">
                ACTIVE FSM INSPECTOR
              </span>
              <h3 className="font-serif text-3xl text-[#111111] mt-0.5">
                {activeNode.name} — {activeNode.fsmName}
              </h3>
            </div>
            <div className="text-xs font-mono text-[#65B9E8]">
              INTERACTION: DETERMINISTIC
            </div>
          </div>

          <p className="mt-4 text-sm text-[#6E7277] leading-relaxed">
            {activeNode.desc}
          </p>

          <div className="mt-6">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A0A3A7] mb-2.5">
              Declared States in Q:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeNode.states.map((st) => (
                <div
                  key={st}
                  className="px-3 py-1 bg-[#F2F2F0] border border-[#D5D8DA] font-mono text-xs text-[#111111]"
                >
                  {st}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
