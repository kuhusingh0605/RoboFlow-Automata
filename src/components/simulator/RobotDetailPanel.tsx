/**
 * RoboFlow — Robot Detail Panel & FSM State Flow
 * Displays active state, battery gauge, path waypoints,
 * live FSM graph highlight, transition history, and manual demonstration triggers.
 */

import React, { useState } from 'react';
import { RobotUnit, RobotEvent, RobotState } from '../../types/automata';

interface RobotDetailPanelProps {
  robot: RobotUnit | null;
  onTriggerEvent: (robotId: string, event: RobotEvent) => void;
  onClose: () => void;
}

export const RobotDetailPanel: React.FC<RobotDetailPanelProps> = ({
  robot,
  onTriggerEvent,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'fsm' | 'history' | 'demo'>('fsm');

  if (!robot) {
    return (
      <div className="border border-[#D5D8DA] bg-white p-6 text-center text-xs font-mono text-[#6E7277]">
        SELECT A ROBOT ON THE CANVAS TO INSPECT FSM STATE
      </div>
    );
  }

  // FSM nominal pipeline sequence
  const pipelineStates: { id: RobotState; label: string }[] = [
    { id: 'IDLE', label: 'IDLE' },
    { id: 'MOVING_TO_PICKUP', label: 'MOVING' },
    { id: 'PICKING_ITEM', label: 'PICKING' },
    { id: 'MOVING_TO_DROPOFF', label: 'DELIVERING' },
    { id: 'DELIVERING', label: 'UNLOAD' },
    { id: 'RETURNING', label: 'RETURN' },
  ];

  return (
    <div className="border border-[#D5D8DA] bg-white p-6 flex flex-col justify-between">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between border-b border-[#D5D8DA] pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6E7277]">
              UNIT TELEMETRY
            </div>
            <h3 className="font-serif text-3xl text-[#111111] mt-0.5">
              ROBOT / {robot.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono text-[#6E7277] hover:text-[#111111] p-1 cursor-pointer"
            aria-label="Close inspector"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Essential Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#D5D8DA]">
          <div>
            <div className="text-[10px] font-mono uppercase text-[#A0A3A7]">Current State</div>
            <div className="font-mono text-xs font-semibold text-[#111111] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#65B9E8]" />
              <span className="truncate">{robot.state}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#A0A3A7]">Battery</div>
            <div className="font-mono text-xs font-medium text-[#111111] mt-1">
              {Math.round(robot.battery)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#A0A3A7]">Active Task</div>
            <div className="font-mono text-xs font-medium text-[#111111] mt-1">
              {robot.currentTaskId || 'UNASSIGNED'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#A0A3A7]">Destination</div>
            <div className="font-mono text-xs font-medium text-[#111111] mt-1 truncate">
              {robot.destinationName}
            </div>
          </div>
        </div>

        {/* Current Path Waypoints */}
        <div className="py-3 border-b border-[#D5D8DA] text-xs font-mono text-[#6E7277] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[#A0A3A7] shrink-0">PATH VECTOR:</span>
          {robot.path.length > 0 ? (
            <div className="flex items-center gap-1.5 shrink-0 text-[#111111]">
              {robot.path.slice(0, 7).map((pt, i) => (
                <React.Fragment key={i}>
                  <span>({pt.x},{pt.y})</span>
                  {i < Math.min(robot.path.length - 1, 6) && <span className="text-[#65B9E8]">→</span>}
                </React.Fragment>
              ))}
              {robot.path.length > 7 && <span className="text-[#A0A3A7]">+{robot.path.length - 7} more</span>}
            </div>
          ) : (
            <span className="text-[#A0A3A7]">STATIONARY (NO ACTIVE VECTOR)</span>
          )}
        </div>

        {/* Sub-view switcher tabs */}
        <div className="flex items-center gap-4 border-b border-[#D5D8DA] pt-4 pb-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab('fsm')}
            className={`pb-1 transition-colors cursor-pointer ${
              activeTab === 'fsm'
                ? 'border-b-2 border-[#111111] text-[#111111] font-semibold'
                : 'text-[#6E7277] hover:text-[#111111]'
            }`}
          >
            FSM STATE FLOW
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-1 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-b-2 border-[#111111] text-[#111111] font-semibold'
                : 'text-[#6E7277] hover:text-[#111111]'
            }`}
          >
            TRANSITION HISTORY ({robot.transitionHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`pb-1 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-b-2 border-[#65B9E8] text-[#111111] font-semibold'
                : 'text-[#6E7277] hover:text-[#111111]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#65B9E8]" />
            <span>DEMO VIVA OVERRIDE</span>
          </button>
        </div>

        {/* TAB 1: Live FSM Flow Diagram */}
        {activeTab === 'fsm' && (
          <div className="py-6">
            <div className="text-[11px] font-mono uppercase text-[#A0A3A7] mb-3">
              Nominal Execution Loop:
            </div>
            <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-2">
              {pipelineStates.map((st, i) => {
                const isActive =
                  robot.state === st.id ||
                  (st.id === 'MOVING_TO_PICKUP' && robot.state === 'TASK_ASSIGNED') ||
                  (st.id === 'MOVING_TO_DROPOFF' && robot.state === 'MOVING_TO_DROPOFF');

                return (
                  <React.Fragment key={st.id}>
                    <div
                      className={`px-3 py-2 border text-center font-mono text-[11px] transition-all shrink-0 ${
                        isActive
                          ? 'border-[#111111] bg-[#111111] text-[#F2F2EF] font-bold shadow-sm'
                          : 'border-[#D5D8DA] bg-[#F2F2F0] text-[#6E7277]'
                      }`}
                    >
                      {st.label}
                    </div>
                    {i < pipelineStates.length - 1 && (
                      <span className="text-[#A0A3A7] shrink-0 font-mono text-xs">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Exception Branch Flow */}
            <div className="mt-6 border-t border-[#D5D8DA] pt-4">
              <div className="text-[11px] font-mono uppercase text-[#A0A3A7] mb-3">
                Exception & Recovery Branches:
              </div>
              <div className="space-y-2 text-xs font-mono">
                {/* Blocked branch */}
                <div className="flex items-center gap-2 p-2 bg-[#F2F2F0] border border-[#D5D8DA]">
                  <span className="text-[#6E7277]">OBSTACLE:</span>
                  <span className="text-[#111111]">MOVING</span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span
                    className={`px-1.5 py-0.5 ${
                      robot.state === 'BLOCKED'
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-[#6E7277]'
                    }`}
                  >
                    BLOCKED
                  </span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span
                    className={`px-1.5 py-0.5 ${
                      robot.state === 'REROUTING'
                        ? 'bg-[#65B9E8] text-[#111111] font-bold'
                        : 'text-[#6E7277]'
                    }`}
                  >
                    REROUTING
                  </span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span className="text-[#111111]">MOVING</span>
                </div>

                {/* Battery branch */}
                <div className="flex items-center gap-2 p-2 bg-[#F2F2F0] border border-[#D5D8DA]">
                  <span className="text-[#6E7277]">DEPLETION:</span>
                  <span className="text-[#111111]">ACTIVE</span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span
                    className={`px-1.5 py-0.5 ${
                      robot.state === 'LOW_BATTERY'
                        ? 'bg-[#111111] text-white font-bold'
                        : 'text-[#6E7277]'
                    }`}
                  >
                    LOW_BATTERY
                  </span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span
                    className={`px-1.5 py-0.5 ${
                      robot.state === 'CHARGING'
                        ? 'bg-[#65B9E8] text-[#111111] font-bold'
                        : 'text-[#6E7277]'
                    }`}
                  >
                    CHARGING
                  </span>
                  <span className="text-[#A0A3A7]">→</span>
                  <span className="text-[#111111]">IDLE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Transition History Log */}
        {activeTab === 'history' && (
          <div className="py-4 max-h-56 overflow-y-auto space-y-2 no-scrollbar">
            {robot.transitionHistory.map((item) => (
              <div
                key={item.id}
                className="p-2.5 border border-[#D5D8DA] bg-[#F2F2F0] font-mono text-[11px]"
              >
                <div className="flex items-center justify-between text-[#A0A3A7] border-b border-[#D5D8DA]/60 pb-1">
                  <span>{item.timestamp}</span>
                  <span className="text-[#65B9E8]">{item.event}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-[#111111]">
                  <span>{item.fromState}</span>
                  <span className="text-[#6E7277]">→</span>
                  <span className="font-bold">{item.toState}</span>
                </div>
                {item.note && (
                  <div className="text-[10px] text-[#6E7277] mt-1">{item.note}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Demonstration Mode (Viva Triggers) */}
        {activeTab === 'demo' && (
          <div className="py-4 space-y-4">
            <div className="p-3 bg-[#E5F4FB] border border-[#65B9E8] text-xs font-mono text-[#111111]">
              <div className="font-semibold text-[#111111] mb-1">
                Demonstration Mode (Viva Controller)
              </div>
              <div>
                Manually fire discrete Automata input alphabet symbols Σ to verify deterministic state changes without waiting for live simulation ticks.
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => onTriggerEvent(robot.id, 'TASK_ASSIGNED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Assign Task
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'DESTINATION_REACHED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Reach Pickup
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'ITEM_COLLECTED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Pick Item
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'PATH_BLOCKED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Block Path
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'ROUTE_FOUND')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Find Route
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'ROUTE_CONFIRMED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Confirm Route
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'DELIVERY_COMPLETE')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Unload Delivery
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'BASE_REACHED')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Reach Base / Idle
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'LOW_BATTERY')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Low Battery
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'BATTERY_FULL')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Battery Full
              </button>
              <button
                onClick={() => onTriggerEvent(robot.id, 'MANUAL_RESET')}
                className="px-3 py-2 border border-[#D5D8DA] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] text-left cursor-pointer"
              >
                + Reset to Idle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
