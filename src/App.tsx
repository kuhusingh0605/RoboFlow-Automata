/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { PhilosophySection } from './components/PhilosophySection';
import { RobotFeatureSection } from './components/RobotFeatureSection';
import { ConnectedSystemsSection } from './components/ConnectedSystemsSection';
import { RhythmSection } from './components/RhythmSection';
import { RobotStatesSection } from './components/RobotStatesSection';
import { WarehouseSimulator } from './components/simulator/WarehouseSimulator';
import { TaskFlowSection } from './components/TaskFlowSection';
import { PresetsSection } from './components/PresetsSection';
import { FooterSection } from './components/FooterSection';
import { SystemLogicModal } from './components/simulator/SystemLogicModal';

export default function App() {
  const [isSystemLogicOpen, setIsSystemLogicOpen] = useState(false);
  const [presetTrigger, setPresetTrigger] = useState<{ id: string; timestamp: number } | null>(null);

  const scrollToSimulator = useCallback(() => {
    const el = document.getElementById('simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSystem = useCallback(() => {
    const el = document.getElementById('system');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectPreset = useCallback((presetId: string) => {
    setPresetTrigger({ id: presetId, timestamp: Date.now() });
    scrollToSimulator();
  }, [scrollToSimulator]);

  return (
    <div className="min-h-screen bg-[#F2F2F0] text-[#111111] flex flex-col font-sans selection:bg-[#65B9E8]/30">
      {/* 3-Zone Navigation Header */}
      <Navigation
        onOpenSystemLogic={() => setIsSystemLogicOpen(true)}
        onScrollToSimulator={scrollToSimulator}
      />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection
          onEnterSimulation={scrollToSimulator}
          onExploreSystem={scrollToSystem}
        />

        {/* Section 2: System Philosophy */}
        <PhilosophySection />

        {/* Section 3: Robot Feature */}
        <RobotFeatureSection onScrollToSimulator={scrollToSimulator} />

        {/* Section 4: Connected Systems */}
        <ConnectedSystemsSection />

        {/* Section 5: 24-Hour Simulation Rhythm */}
        <RhythmSection />

        {/* Section 6: Robot States */}
        <RobotStatesSection />

        {/* Section 7: Live Simulator Canvas & Controls */}
        <WarehouseSimulator
          onOpenSystemLogic={() => setIsSystemLogicOpen(true)}
          presetTrigger={presetTrigger}
        />

        {/* Section 8: Task Flow Pipeline */}
        <TaskFlowSection />

        {/* Section 9: Presets Index */}
        <PresetsSection onSelectPreset={handleSelectPreset} />

        {/* Section 10: Final CTA & Footer */}
        <FooterSection
          onScrollToSimulator={scrollToSimulator}
          onOpenSystemLogic={() => setIsSystemLogicOpen(true)}
        />
      </main>

      {/* Automata Formal Specification & DFA Tester Modal */}
      <SystemLogicModal
        isOpen={isSystemLogicOpen}
        onClose={() => setIsSystemLogicOpen(false)}
      />
    </div>
  );
}
