/**
 * RoboFlow — Navigation Bar
 * Follows the 3-zone Top Bar Contract:
 * [Brand title, one line] — [4-6 nav links, 1-2 word labels] — [1-2 primary actions]
 */

import React, { useState } from 'react';

interface NavigationProps {
  onOpenSystemLogic: () => void;
  onScrollToSimulator: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenSystemLogic,
  onScrollToSimulator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D5D8DA] bg-[#F2F2F0]/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-2xl tracking-tight text-[#111111] hover:text-[#65B9E8] transition-colors"
        >
          RoboFlow
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-wide text-[#6E7277]">
          <a
            href="#system"
            className="hover:text-[#111111] transition-colors"
          >
            System
          </a>
          <a
            href="#fleet"
            className="hover:text-[#111111] transition-colors"
          >
            Fleet
          </a>
          <a
            href="#simulator"
            onClick={(e) => {
              e.preventDefault();
              onScrollToSimulator();
            }}
            className="hover:text-[#111111] transition-colors"
          >
            Simulation
          </a>
          <a
            href="#architecture"
            className="hover:text-[#111111] transition-colors"
          >
            Architecture
          </a>
          <button
            onClick={onOpenSystemLogic}
            className="hover:text-[#111111] transition-colors text-left"
          >
            System Logic
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToSimulator}
            className="group relative inline-flex items-center gap-2 border border-[#111111] bg-[#111111] px-4 py-2 text-xs font-medium tracking-wide text-[#F2F2EF] transition-all hover:bg-transparent hover:text-[#111111] whitespace-nowrap cursor-pointer"
          >
            <span>Enter Simulator</span>
            <span className="text-[#65B9E8] group-hover:translate-x-0.5 transition-transform">→</span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#111111] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#D5D8DA] bg-[#F2F2F0] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-[#111111]">
            <a
              href="#system"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              System
            </a>
            <a
              href="#fleet"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Fleet
            </a>
            <a
              href="#simulator"
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToSimulator();
              }}
              className="py-1"
            >
              Simulation
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1"
            >
              Architecture
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSystemLogic();
              }}
              className="py-1 text-left"
            >
              System Logic (Automata)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
