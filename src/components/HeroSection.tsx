/**
 * RoboFlow — Hero Section
 * Immersive dark charcoal backdrop with abstract sensor rings, lidar sweeps, and refined typography
 */

import React from 'react';

interface HeroSectionProps {
  onEnterSimulation: () => void;
  onExploreSystem: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterSimulation,
  onExploreSystem,
}) => {
  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden bg-[#16191D] text-[#F2F2EF] flex flex-col justify-between">
      {/* Background Abstract Lidar / Sensor Geometry */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Soft atmospheric blue ambient glows */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#65B9E8]/10 blur-[130px] -top-24 -left-20" />
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#65B9E8]/8 blur-[160px] top-1/3 -right-24" />
        
        {/* Central Lidar concentric rings */}
        <div className="relative w-[850px] h-[850px] max-w-[95vw] max-h-[95vw] flex items-center justify-center opacity-40">
          {/* Outermost ring */}
          <div className="absolute inset-0 rounded-full border border-[#D5D8DA]/10" />
          
          {/* Second ring with dash */}
          <div className="absolute inset-16 rounded-full border border-dashed border-[#65B9E8]/20" />
          
          {/* Third ring */}
          <div className="absolute inset-36 rounded-full border border-[#D5D8DA]/15" />
          
          {/* Fourth ring with angle markers */}
          <div className="absolute inset-56 rounded-full border border-dashed border-[#65B9E8]/30" />
          
          {/* Inner core ring */}
          <div className="absolute inset-80 rounded-full border border-[#65B9E8]/40 bg-[#65B9E8]/5" />
          
          {/* Slow radar sweep arc */}
          <div className="absolute w-full h-full animate-radar origin-center">
            <div className="w-1/2 h-1/2 ml-auto origin-bottom-left bg-gradient-to-tr from-transparent via-[#65B9E8]/15 to-[#65B9E8]/30 rounded-tr-full" />
          </div>

          {/* Thin coordinate crosshairs */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#D5D8DA]/20 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#D5D8DA]/20 to-transparent" />

          {/* Calibrated perimeter tick marks */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-[#A0A3A7]">
            000° NORTH
          </div>
          <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-[10px] font-mono tracking-widest text-[#A0A3A7] rotate-90">
            090° EAST
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-[#A0A3A7]">
            180° SOUTH
          </div>
          <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-[10px] font-mono tracking-widest text-[#A0A3A7] -rotate-90">
            270° WEST
          </div>
        </div>
      </div>

      {/* Top micro metadata bar */}
      <div className="relative z-10 w-full border-b border-[#2A2F35] px-6 lg:px-12 py-3 text-[11px] font-mono tracking-wider text-[#A0A3A7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#65B9E8]" />
          <span>FSM AUTONOMOUS LOGISTICS DISPATCH</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>CYCLE: DETERMINISTIC</span>
          <span>LATENCY: ZERO-SPEC</span>
          <span>STABILITY: INVARIANT VERIFIED</span>
        </div>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-12 py-20 lg:py-28 text-center flex flex-col items-center justify-center my-auto">
        {/* Technical Label */}
        <div className="mb-6 inline-flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-[0.25em] text-[#65B9E8]">
          <span className="h-px w-6 bg-[#65B9E8]/60" />
          <span>Automata-Based Fleet System</span>
          <span className="h-px w-6 bg-[#65B9E8]/60" />
        </div>

        {/* Large Serif Headline */}
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-[92px] leading-[1.04] tracking-[-0.01em] text-[#F2F2EF] max-w-4xl text-balance">
          Built for motion inside the warehouse.
        </h1>

        {/* Supporting text */}
        <p className="mt-8 text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-[#A0A3A7] max-w-2xl text-balance">
          RoboFlow simulates autonomous warehouse fleets using interacting finite-state machines. Coordinated tasking, dynamic rerouting, and real-time deadlock avoidance.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onEnterSimulation}
            className="group relative inline-flex items-center gap-2.5 bg-[#65B9E8] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#16191D] hover:bg-[#78C6EB] transition-all cursor-pointer shadow-sm"
          >
            <span>Enter Simulation</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          <button
            onClick={onExploreSystem}
            className="inline-flex items-center gap-2 border border-[#D5D8DA]/30 px-6 py-2.5 text-xs font-medium tracking-wider text-[#F2F2EF] hover:border-[#F2F2EF] hover:bg-white/5 transition-all cursor-pointer"
          >
            <span>Explore System</span>
          </button>
        </div>
      </div>

      {/* Bottom Technical Spec strip */}
      <div className="relative z-10 w-full border-t border-[#2A2F35] bg-[#16191D]/80 backdrop-blur-sm px-6 lg:px-12 py-5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Formalism</div>
            <div className="mt-1 font-serif text-lg text-[#F2F2EF]">M = (Q, Σ, δ, q₀, F)</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Fleet Concurrency</div>
            <div className="mt-1 font-serif text-lg text-[#F2F2EF]">Decentralized Units</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Path Resolution</div>
            <div className="mt-1 font-serif text-lg text-[#F2F2EF]">BFS & Route Recovery</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">Power Subsystem</div>
            <div className="mt-1 font-serif text-lg text-[#F2F2EF]">Inductive Recharging</div>
          </div>
        </div>
      </div>
    </section>
  );
};
