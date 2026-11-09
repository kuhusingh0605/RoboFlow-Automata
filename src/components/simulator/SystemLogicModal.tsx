/**
 * RoboFlow — System Logic (Automata Formal Specification)
 * Visual representation of the 5-Tuple M = (Q, Sigma, delta, q0, F)
 * with an interactive DFA execution tester.
 */

import React, { useState } from 'react';
import { RobotState, RobotEvent, ROBOT_TRANSITIONS } from '../../types/automata';

interface SystemLogicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STATES_SET: RobotState[] = [
  'IDLE',
  'TASK_ASSIGNED',
  'MOVING_TO_PICKUP',
  'PICKING_ITEM',
  'MOVING_TO_DROPOFF',
  'DELIVERING',
  'RETURNING',
  'BLOCKED',
  'REROUTING',
  'LOW_BATTERY',
  'CHARGING',
  'MAINTENANCE',
];

const ALPHABET_SYMBOLS: { symbol: RobotEvent; label: string; token: string }[] = [
  { symbol: 'TASK_ASSIGNED', label: 'Task Assigned', token: 'a₁' },
  { symbol: 'DESTINATION_REACHED', label: 'Destination Reached', token: 'a₂' },
  { symbol: 'ITEM_COLLECTED', label: 'Item Collected', token: 'a₃' },
  { symbol: 'PATH_BLOCKED', label: 'Path Blocked', token: 'a₄' },
  { symbol: 'ROUTE_FOUND', label: 'Route Found', token: 'a₅' },
  { symbol: 'ROUTE_CONFIRMED', label: 'Route Confirmed', token: 'a₆' },
  { symbol: 'DELIVERY_COMPLETE', label: 'Delivery Complete', token: 'a₇' },
  { symbol: 'BASE_REACHED', label: 'Base Reached', token: 'a₈' },
  { symbol: 'LOW_BATTERY', label: 'Low Battery', token: 'a₉' },
  { symbol: 'BATTERY_FULL', label: 'Battery Full', token: 'a₁₀' },
  { symbol: 'SERVICE_COMPLETED', label: 'Service Completed', token: 'a₁₁' },
];

export const SystemLogicModal: React.FC<SystemLogicModalProps> = ({ isOpen, onClose }) => {
  // DFA interactive tester state
  const [testState, setTestState] = useState<RobotState>('IDLE');
  const [eventSequence, setEventSequence] = useState<{ event: RobotEvent; from: RobotState; to: RobotState }[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStepSymbol = (event: RobotEvent) => {
    const validNext = ROBOT_TRANSITIONS[testState]?.[event];
    if (validNext) {
      setEventSequence((prev) => [...prev, { event, from: testState, to: validNext }]);
      setTestState(validNext);
      setLastError(null);
    } else {
      setLastError(`Trap: No transition δ(${testState}, ${event}) defined in transition function.`);
    }
  };

  const handleResetDfa = () => {
    setTestState('IDLE');
    setEventSequence([]);
    setLastError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16191D]/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#F2F2F0] border border-[#D5D8DA] shadow-2xl p-6 sm:p-10 text-[#111111] no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D5D8DA] pb-6 mb-8">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277]">
              MATHEMATICAL SPECIFICATION
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#111111] mt-1">
              System Logic & Automata
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 font-mono text-xs text-[#6E7277] hover:text-[#111111] border border-[#D5D8DA] bg-white cursor-pointer"
          >
            ✕ CLOSE ESC
          </button>
        </div>

        {/* 5-Tuple Formulation Card */}
        <div className="border border-[#D5D8DA] bg-white p-6 sm:p-8 mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#65B9E8] mb-2">
            Deterministic Finite Automaton Definition
          </div>
          <div className="font-serif text-3xl sm:text-4xl text-[#111111] mb-6 font-normal">
            M = ( Q, Σ, δ, q₀, F )
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-4 font-mono text-xs">
              <div className="border-l-2 border-[#111111] pl-3">
                <span className="font-bold text-[#111111]">Q (Finite Set of States):</span>
                <div className="mt-1 text-[#6E7277] leading-relaxed">
                  {`{ ${STATES_SET.join(', ')} }`}
                </div>
              </div>

              <div className="border-l-2 border-[#111111] pl-3">
                <span className="font-bold text-[#111111]">Σ (Input Alphabet of Events):</span>
                <div className="mt-1 text-[#6E7277] leading-relaxed">
                  {`{ ${ALPHABET_SYMBOLS.map((s) => s.symbol).join(', ')} }`}
                </div>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="border-l-2 border-[#111111] pl-3">
                <span className="font-bold text-[#111111]">q₀ (Initial State):</span>
                <div className="mt-1 text-[#6E7277]">q₀ = IDLE</div>
              </div>

              <div className="border-l-2 border-[#111111] pl-3">
                <span className="font-bold text-[#111111]">F (Terminal / Accept States):</span>
                <div className="mt-1 text-[#6E7277]">
                  F = &#123; IDLE, COMPLETED &#125; (Quiescent and verified fulfillment states)
                </div>
              </div>

              <div className="border-l-2 border-[#111111] pl-3">
                <span className="font-bold text-[#111111]">δ (Transition Function):</span>
                <div className="mt-1 text-[#6E7277]">
                  δ : Q × Σ → Q (Total deterministic mapping; illegal input drops to Deadlock Evasion handler)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive DFA String / Event Tester */}
        <div className="border border-[#D5D8DA] bg-white p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D5D8DA] pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">
                INTERACTIVE TESTING ENGINE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#111111]">
                DFA Input String Evaluator
              </h3>
            </div>
            <button
              onClick={handleResetDfa}
              className="text-xs font-mono px-3 py-1.5 border border-[#D5D8DA] bg-[#F2F2F0] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              Reset to q₀ (IDLE)
            </button>
          </div>

          {/* Current DFA State Display */}
          <div className="p-4 bg-[#F2F2F0] border border-[#D5D8DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-mono text-[#6E7277] uppercase">Current DFA State:</div>
              <div className="font-serif text-3xl text-[#111111] font-semibold mt-0.5">
                {testState}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-[#6E7277]">Accept State (F)?</span>
              <span
                className={`px-2.5 py-1 text-xs font-bold ${
                  testState === 'IDLE'
                    ? 'bg-[#111111] text-[#F2F2EF]'
                    : 'bg-[#D5D8DA] text-[#6E7277]'
                }`}
              >
                {testState === 'IDLE' ? 'YES (q ∈ F)' : 'NO (q ∉ F)'}
              </span>
            </div>
          </div>

          {/* Error / Trap Notification */}
          {lastError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs font-mono text-red-700">
              {lastError}
            </div>
          )}

          {/* Alphabet Input Keyboard */}
          <div className="mb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-[#A0A3A7] mb-2">
              Dispatch Alphabet Symbol σ ∈ Σ:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ALPHABET_SYMBOLS.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => handleStepSymbol(item.symbol)}
                  className="p-2.5 border border-[#D5D8DA] bg-white text-left font-mono text-xs text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] transition-colors cursor-pointer"
                >
                  <div className="text-[10px] text-[#65B9E8] font-bold">{item.token}</div>
                  <div className="font-semibold truncate">{item.symbol}</div>
                  <div className="text-[10px] text-[#6E7277] truncate">{item.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Trace Execution History */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#A0A3A7] mb-2">
              Execution Path Trace ({eventSequence.length} Steps):
            </div>
            {eventSequence.length === 0 ? (
              <div className="text-xs font-mono text-[#A0A3A7] italic">
                Awaiting input symbols. Click any symbol above to step through transitions.
              </div>
            ) : (
              <div className="p-3 bg-[#F2F2F0] border border-[#D5D8DA] font-mono text-xs space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {eventSequence.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[#111111]">
                    <span className="text-[#A0A3A7]">{idx + 1}.</span>
                    <span className="font-medium">{step.from}</span>
                    <span className="text-[#65B9E8]">--[{step.event}]--&gt;</span>
                    <span className="font-bold">{step.to}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transition Function Matrix Sample */}
        <div className="border border-[#D5D8DA] bg-white p-6 sm:p-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#6E7277] mb-2">
            Formal State Transition Matrix δ(q, σ)
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#111111]">
                  <th className="py-2 pr-4 font-semibold text-[#111111]">Current State (q)</th>
                  <th className="py-2 px-4 font-semibold text-[#111111]">Event Input (σ)</th>
                  <th className="py-2 pl-4 font-semibold text-[#111111]">Next State δ(q, σ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5D8DA] text-[#6E7277]">
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">IDLE</td>
                  <td className="py-2 px-4 text-[#65B9E8]">TASK_ASSIGNED</td>
                  <td className="py-2 pl-4 text-[#111111]">MOVING_TO_PICKUP</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">MOVING_TO_PICKUP</td>
                  <td className="py-2 px-4 text-[#65B9E8]">DESTINATION_REACHED</td>
                  <td className="py-2 pl-4 text-[#111111]">PICKING_ITEM</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">MOVING_TO_PICKUP</td>
                  <td className="py-2 px-4 text-[#65B9E8]">PATH_BLOCKED</td>
                  <td className="py-2 pl-4 text-[#111111]">BLOCKED</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">PICKING_ITEM</td>
                  <td className="py-2 px-4 text-[#65B9E8]">ITEM_COLLECTED</td>
                  <td className="py-2 pl-4 text-[#111111]">MOVING_TO_DROPOFF</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">BLOCKED</td>
                  <td className="py-2 px-4 text-[#65B9E8]">ROUTE_FOUND</td>
                  <td className="py-2 pl-4 text-[#111111]">REROUTING</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">REROUTING</td>
                  <td className="py-2 px-4 text-[#65B9E8]">ROUTE_CONFIRMED</td>
                  <td className="py-2 pl-4 text-[#111111]">MOVING_TO_DROPOFF</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">MOVING_TO_DROPOFF</td>
                  <td className="py-2 px-4 text-[#65B9E8]">DESTINATION_REACHED</td>
                  <td className="py-2 pl-4 text-[#111111]">DELIVERING</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">DELIVERING</td>
                  <td className="py-2 px-4 text-[#65B9E8]">DELIVERY_COMPLETE</td>
                  <td className="py-2 pl-4 text-[#111111]">RETURNING</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">RETURNING</td>
                  <td className="py-2 px-4 text-[#65B9E8]">BASE_REACHED</td>
                  <td className="py-2 pl-4 text-[#111111]">IDLE (Accept State)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">ANY ACTIVE STATE</td>
                  <td className="py-2 px-4 text-[#65B9E8]">LOW_BATTERY</td>
                  <td className="py-2 pl-4 text-[#111111]">CHARGING</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-[#111111] font-medium">CHARGING</td>
                  <td className="py-2 px-4 text-[#65B9E8]">BATTERY_FULL</td>
                  <td className="py-2 pl-4 text-[#111111]">IDLE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
