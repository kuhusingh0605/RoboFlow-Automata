/**
 * RoboFlow — Section 8: Task Flow Pipeline
 * Horizontal editorial timeline without bulky cards
 */

import React from 'react';

interface TaskStep {
  step: string;
  name: string;
  desc: string;
  trigger: string;
}

const TASK_STAGES: TaskStep[] = [
  {
    step: '01',
    name: 'CREATED',
    desc: 'ERP or WMS dispatches picking ticket with SKU barcode, coordinates, and weight.',
    trigger: 'Inbound manifest',
  },
  {
    step: '02',
    name: 'ASSIGNED',
    desc: 'Matching engine binds task to nearest available unit with sufficient battery reserve.',
    trigger: 'Proximity pairing',
  },
  {
    step: '03',
    name: 'PICKED',
    desc: 'Robot docks at shelf elevator bay; payload transfer and optical verification complete.',
    trigger: 'Optical barcode match',
  },
  {
    step: '04',
    name: 'IN TRANSIT',
    desc: 'Payload navigated across warehouse corridors toward assigned outbound sortation bay.',
    trigger: 'Path vector execution',
  },
  {
    step: '05',
    name: 'DELIVERED',
    desc: 'Carton placed on packing conveyor or pallet staging dock for truck dispatch.',
    trigger: 'Weight release confirm',
  },
  {
    step: '06',
    name: 'COMPLETED',
    desc: 'Manifest closed; ERP updated with fulfillment timestamp; unit released to IDLE.',
    trigger: 'Task FSM terminal state',
  },
];

export const TaskFlowSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#F2F2F0] py-28 lg:py-36 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16 lg:mb-20">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-3">
            06 / ORDER LIFECYCLE
          </div>
          <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.08] text-[#111111] text-balance">
            Every task moves
            <br />
            through the system.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#6E7277] font-normal leading-relaxed text-balance">
            Tasks in RoboFlow are formalized finite-state machines that mirror inventory progression from order generation to physical sorting dock delivery.
          </p>
        </div>

        {/* Horizontal Editorial Timeline */}
        <div className="border-t border-[#D5D8DA] pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {TASK_STAGES.map((stage, idx) => (
              <div key={stage.step} className="flex flex-col justify-between border-l border-[#D5D8DA] pl-4 py-2">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#A0A3A7] mb-2">
                    <span>PHASE {stage.step}</span>
                    {idx < TASK_STAGES.length - 1 && (
                      <span className="hidden lg:inline text-[#65B9E8]">→</span>
                    )}
                  </div>
                  <h3 className="font-serif text-2xl text-[#111111] font-medium tracking-tight">
                    {stage.name}
                  </h3>
                  <p className="mt-3 text-xs text-[#6E7277] leading-relaxed">
                    {stage.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#D5D8DA] text-[11px] font-mono text-[#65B9E8]">
                  {stage.trigger}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
