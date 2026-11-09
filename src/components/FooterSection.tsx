/**
 * RoboFlow — Section 10: Final CTA & Minimalist Footer
 */

import React from 'react';

interface FooterSectionProps {
  onScrollToSimulator: () => void;
  onOpenSystemLogic: () => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  onScrollToSimulator,
  onOpenSystemLogic,
}) => {
  return (
    <>
      {/* Section 10: Final CTA */}
      <section className="relative w-full bg-[#16191D] py-28 lg:py-36 px-6 lg:px-12 text-[#F2F2EF] overflow-hidden border-b border-[#2A2F35]">
        {/* Abstract Geometry */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full border border-[#D5D8DA]/10" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[#65B9E8]/20" />
          <div className="absolute w-[220px] h-[220px] rounded-full bg-[#65B9E8]/5 blur-2xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#65B9E8] mb-4">
            08 / MOTION AT SCALE
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#F2F2EF] text-balance">
            Start with one robot.
            <br />
            Scale to a fleet.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#A0A3A7] font-normal leading-relaxed max-w-2xl mx-auto text-balance">
            Explore how autonomous systems behave through interacting state machines. Coordinated dispatch, real-time path recovery, and zero-downtime execution.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onScrollToSimulator}
              className="inline-flex items-center gap-2 bg-[#65B9E8] px-6 py-2.5 text-xs font-semibold tracking-wider text-[#16191D] hover:bg-[#78C6EB] transition-all cursor-pointer shadow-sm"
            >
              <span>Launch Simulator</span>
              <span>→</span>
            </button>
            <button
              onClick={onOpenSystemLogic}
              className="inline-flex items-center gap-2 border border-[#D5D8DA]/30 px-6 py-2.5 text-xs font-medium tracking-wider text-[#F2F2EF] hover:border-[#F2F2EF] hover:bg-white/5 transition-all cursor-pointer"
            >
              <span>Explore Architecture</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-[#16191D] text-[#F2F2EF] py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#2A2F35] pb-12 gap-8">
            <div>
              <div className="font-serif text-4xl sm:text-5xl text-[#F2F2EF] tracking-tight">
                RoboFlow
              </div>
              <div className="mt-2 text-xs font-mono text-[#A0A3A7] tracking-wider">
                AUTOMATA-BASED WAREHOUSE FLEET SIMULATOR
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-8 text-xs font-mono tracking-wider text-[#A0A3A7]">
              <a href="#system" className="hover:text-[#F2F2EF] transition-colors">
                System
              </a>
              <a
                href="#simulator"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSimulator();
                }}
                className="hover:text-[#F2F2EF] transition-colors"
              >
                Simulation
              </a>
              <a href="#architecture" className="hover:text-[#F2F2EF] transition-colors">
                Architecture
              </a>
              <button
                onClick={onOpenSystemLogic}
                className="hover:text-[#F2F2EF] transition-colors cursor-pointer text-left"
              >
                Automata
              </button>
              <a href="#fleet" className="hover:text-[#F2F2EF] transition-colors">
                About
              </a>
            </nav>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] font-mono text-[#6E7277]">
            <div>
              © 2026 RoboFlow Fleet Systems. Formal state verification under M=(Q,Σ,δ,q₀,F).
            </div>
            <div>
              Designed for motion at scale · Deterministic FSM orchestration
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
