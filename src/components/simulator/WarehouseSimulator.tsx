/**
 * RoboFlow — Section 7: Live Simulator
 * High-performance engineering canvas with two-column layout,
 * interactive controls, dynamic pathfinding, multi-FSM synchronization,
 * and humanized microcopy event stream.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RobotUnit,
  TaskUnit,
  ChargingStation,
  GridCoord,
  RobotEvent,
  RobotState,
  ROBOT_TRANSITIONS,
} from '../../types/automata';
import {
  INITIAL_ROBOTS,
  INITIAL_TASKS,
  INITIAL_CHARGING_STATIONS,
  PICKUP_STATIONS,
  DROPOFF_STATIONS,
  findPath,
  formatTime,
} from '../../simulation/warehouseEngine';
import { WarehouseCanvas } from './WarehouseCanvas';
import { RobotDetailPanel } from './RobotDetailPanel';

interface SimulatorProps {
  onOpenSystemLogic: () => void;
  presetTrigger?: { id: string; timestamp: number } | null;
}

export const WarehouseSimulator: React.FC<SimulatorProps> = ({
  onOpenSystemLogic,
  presetTrigger,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [robots, setRobots] = useState<RobotUnit[]>(INITIAL_ROBOTS);
  const [tasks, setTasks] = useState<TaskUnit[]>(INITIAL_TASKS);
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>(INITIAL_CHARGING_STATIONS);
  const [blockedCoords, setBlockedCoords] = useState<Set<string>>(new Set());
  const [selectedRobotId, setSelectedRobotId] = useState<string>('R01');
  const [eventLogs, setEventLogs] = useState<string[]>([
    'RoboFlow multi-FSM kernel initialized.',
    'Fleet staging complete. 4 units nominal.',
    'Task queue listening for inbound manifests.',
  ]);

  // Append humanized microcopy to event log
  const logEvent = useCallback((msg: string) => {
    const time = formatTime();
    setEventLogs((prev) => [`${time} · ${msg}`, ...prev.slice(0, 19)]);
  }, []);

  // Handle Preset Changes from Presets Section
  useEffect(() => {
    if (!presetTrigger) return;
    const { id } = presetTrigger;
    if (id === 'daily-operations') {
      setBlockedCoords(new Set());
      setSpeedMultiplier(1);
      logEvent('Loaded preset: Daily Operations (Nominal flow)');
    } else if (id === 'high-demand') {
      setSpeedMultiplier(2);
      logEvent('Loaded preset: High Demand (Double speed, rapid dispatch)');
    } else if (id === 'congestion-test') {
      const set = new Set(['5,3', '5,4', '9,5']);
      setBlockedCoords(set);
      logEvent('Loaded preset: Congestion Test (Corridors constricted)');
    } else if (id === 'low-battery-scenario') {
      setRobots((prev) =>
        prev.map((r, i) => (i < 2 ? { ...r, battery: 18, state: 'LOW_BATTERY' } : r))
      );
      logEvent('Loaded preset: Low Battery Scenario (Units <20% rerouting to charge)');
    } else if (id === 'blocked-route') {
      const set = new Set(['4,1', '5,1', '6,1', '5,2']);
      setBlockedCoords(set);
      logEvent('Loaded preset: Blocked Route (Aisle A primary exit obstructed)');
    } else if (id === 'peak-hour') {
      setSpeedMultiplier(2);
      const set = new Set(['8,4']);
      setBlockedCoords(set);
      logEvent('Loaded preset: Peak Hour (Surge schedule loaded)');
    }
  }, [presetTrigger, logEvent]);

  // Toggle dynamic blocked coordinate on map
  const toggleCellBlock = useCallback(
    (coord: GridCoord) => {
      const key = `${coord.x},${coord.y}`;
      setBlockedCoords((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
          logEvent(`Aisle cleared at coordinate (${coord.x}, ${coord.y}).`);
        } else {
          next.add(key);
          logEvent(`Corridor obstruction detected at (${coord.x}, ${coord.y}).`);
        }
        return next;
      });
    },
    [logEvent]
  );

  // Manual event trigger for FSM state transition (Demo mode / Viva)
  const triggerRobotEvent = useCallback(
    (robotId: string, event: RobotEvent) => {
      setRobots((prev) =>
        prev.map((r) => {
          if (r.id !== robotId) return r;
          const allowedTransitions = ROBOT_TRANSITIONS[r.state];
          const nextState: RobotState = allowedTransitions[event] || r.state;

          if (nextState === r.state) {
            logEvent(`Unit ${r.id}: Event ${event} is an invalid transition from state ${r.state}.`);
            return r;
          }

          const time = formatTime();
          const logEntry = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: time,
            fromState: r.state,
            toState: nextState,
            event: event,
            note: `Manual trigger: ${event}`,
          };

          logEvent(`Robot ${r.id}: ${r.state} → ${nextState} via ${event}.`);

          let updatedBattery = r.battery;
          if (nextState === 'CHARGING') updatedBattery = 100;

          return {
            ...r,
            state: nextState,
            battery: updatedBattery,
            lastTransitionTime: time,
            transitionHistory: [logEntry, ...r.transitionHistory.slice(0, 15)],
          };
        })
      );
    },
    [logEvent]
  );

  // Create and inject a new Task into the system
  const handleAddTask = useCallback(() => {
    const pickupIdx = Math.floor(Math.random() * PICKUP_STATIONS.length);
    const dropIdx = Math.floor(Math.random() * DROPOFF_STATIONS.length);
    const pStation = PICKUP_STATIONS[pickupIdx];
    const dStation = DROPOFF_STATIONS[dropIdx];
    const newId = `T-${100 + tasks.length + 1}`;

    const newTask: TaskUnit = {
      id: newId,
      state: 'CREATED',
      itemName: `Component Pack #${Math.floor(Math.random() * 800 + 100)}`,
      pickupLocation: pStation.coord,
      pickupName: pStation.name,
      dropLocation: dStation.coord,
      dropName: dStation.name,
      assignedRobotId: null,
      createdAt: formatTime(),
      priority: Math.random() > 0.6 ? 'high' : 'standard',
    };

    setTasks((prev) => [...prev, newTask]);
    logEvent(`Task ${newId} created: ${pStation.name} → ${dStation.name}.`);
  }, [tasks.length, logEvent]);

  // Trigger Low Battery on selected robot
  const handleTriggerLowBattery = useCallback(() => {
    if (!selectedRobotId) return;
    setRobots((prev) =>
      prev.map((r) => {
        if (r.id === selectedRobotId) {
          logEvent(`Robot ${r.id} battery low warning (16%). Scheduling charging.`);
          return {
            ...r,
            battery: 16,
            state: 'LOW_BATTERY',
            destinationName: 'Charging Bay Pad 01',
          };
        }
        return r;
      })
    );
  }, [selectedRobotId, logEvent]);

  // Add new Robot to fleet
  const handleAddRobot = useCallback(() => {
    const nextIdx = robots.length + 1;
    const newId = `R0${nextIdx}`;
    const startCoord = { x: 1, y: Math.min(nextIdx * 2 - 1, 9) };

    const newRobot: RobotUnit = {
      id: newId,
      name: `Unit 0${nextIdx}`,
      state: 'IDLE',
      battery: 100,
      currentTaskId: null,
      position: startCoord,
      targetPosition: null,
      path: [],
      destinationName: `Staging Base ${newId}`,
      speed: 1.4,
      carryingItem: null,
      lastTransitionTime: formatTime(),
      transitionHistory: [
        {
          id: `init-${Date.now()}`,
          timestamp: formatTime(),
          fromState: 'MAINTENANCE',
          toState: 'IDLE',
          event: 'SERVICE_COMPLETED',
          note: 'Commissioned to active fleet',
        },
      ],
      colorAccent: '#65B9E8',
    };

    setRobots((prev) => [...prev, newRobot]);
    logEvent(`Robot ${newId} added to active fleet at (${startCoord.x}, ${startCoord.y}).`);
  }, [robots.length, logEvent]);

  // Main simulation tick loop
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const intervalTime = Math.max(1200 / speedMultiplier, 250);

    const stepSimulation = () => {
      // 1. Process Task Allocation to Idle Robots
      setRobots((currentRobots) => {
        let updatedRobots = [...currentRobots];

        setTasks((currentTasks) => {
          let updatedTasks = [...currentTasks];

          // Check for unassigned tasks and idle robots
          const pendingTask = updatedTasks.find((t) => t.state === 'CREATED');
          const idleRobot = updatedRobots.find((r) => r.state === 'IDLE' && r.battery > 25);

          if (pendingTask && idleRobot) {
            // Plan path from robot position to pickup
            const pathToPickup = findPath(
              idleRobot.position,
              pendingTask.pickupLocation,
              blockedCoords
            );

            if (pathToPickup && pathToPickup.length > 0) {
              const time = formatTime();
              // Update task
              updatedTasks = updatedTasks.map((t) =>
                t.id === pendingTask.id
                  ? { ...t, state: 'ASSIGNED', assignedRobotId: idleRobot.id }
                  : t
              );

              // Update robot
              updatedRobots = updatedRobots.map((r) =>
                r.id === idleRobot.id
                  ? {
                      ...r,
                      state: 'MOVING_TO_PICKUP',
                      currentTaskId: pendingTask.id,
                      destinationName: pendingTask.pickupName,
                      targetPosition: pendingTask.pickupLocation,
                      path: pathToPickup,
                      lastTransitionTime: time,
                      transitionHistory: [
                        {
                          id: `log-${Date.now()}`,
                          timestamp: time,
                          fromState: 'IDLE',
                          toState: 'MOVING_TO_PICKUP',
                          event: 'TASK_ASSIGNED',
                          note: `Assigned task ${pendingTask.id}`,
                        },
                        ...r.transitionHistory.slice(0, 15),
                      ],
                    }
                  : r
              );
              logEvent(`Assigned ${pendingTask.id} to Robot ${idleRobot.id}.`);
            }
          }

          return updatedTasks;
        });

        // 2. Advance Each Active Robot through its FSM state logic
        updatedRobots = updatedRobots.map((robot) => {
          let r = { ...robot };
          const time = formatTime();

          // Battery management
          if (r.state === 'CHARGING') {
            const nextBat = Math.min(r.battery + 8, 100);
            if (nextBat >= 100) {
              logEvent(`Robot ${r.id} charging complete (100%). Returning to IDLE.`);
              return {
                ...r,
                battery: 100,
                state: 'IDLE',
                destinationName: 'Staging Base',
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: 'CHARGING',
                    toState: 'IDLE',
                    event: 'BATTERY_FULL',
                    note: 'Charge cycle complete',
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
            return { ...r, battery: nextBat };
          } else {
            // Minor battery discharge
            const decay = r.carryingItem ? 0.4 : 0.2;
            r.battery = Math.max(r.battery - decay, 5);

            // Auto low-battery tripwire
            if (r.battery <= 20 && r.state !== 'LOW_BATTERY') {
              // Find nearest charging pad
              const padCoord = { x: 0, y: 2 };
              const pathToPad = findPath(r.position, padCoord, blockedCoords) || [];
              logEvent(`Robot ${r.id} reached low battery threshold (≤20%). Redirecting to pad.`);
              return {
                ...r,
                state: 'LOW_BATTERY',
                targetPosition: padCoord,
                destinationName: 'Charging Pad 01',
                path: pathToPad,
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: r.state,
                    toState: 'LOW_BATTERY',
                    event: 'LOW_BATTERY',
                    note: 'Power reserve warning',
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
          }

          // Handle LOW_BATTERY navigating to pad
          if (r.state === 'LOW_BATTERY') {
            if (r.position.x === 0 && (r.position.y === 2 || r.position.y === 5 || r.position.y === 8)) {
              // Reached charging pad
              logEvent(`Robot ${r.id} docked on inductive pad. Charging started.`);
              return {
                ...r,
                state: 'CHARGING',
                path: [],
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: 'LOW_BATTERY',
                    toState: 'CHARGING',
                    event: 'ROUTE_CONFIRMED',
                    note: 'Docked at inductive charger',
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
          }

          // Check if current planned path is blocked
          if ((r.state === 'MOVING_TO_PICKUP' || r.state === 'MOVING_TO_DROPOFF') && r.path.length > 1) {
            const nextStep = r.path[1];
            if (blockedCoords.has(`${nextStep.x},${nextStep.y}`)) {
              logEvent(`Route blocked near (${nextStep.x}, ${nextStep.y}) for Robot ${r.id}.`);
              return {
                ...r,
                state: 'BLOCKED',
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: r.state,
                    toState: 'BLOCKED',
                    event: 'PATH_BLOCKED',
                    note: `Obstacle at (${nextStep.x}, ${nextStep.y})`,
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
          }

          // If BLOCKED, attempt reroute
          if (r.state === 'BLOCKED' && r.targetPosition) {
            const altPath = findPath(r.position, r.targetPosition, blockedCoords);
            if (altPath && altPath.length > 0) {
              logEvent(`Alternative route found for Robot ${r.id}.`);
              return {
                ...r,
                state: 'REROUTING',
                path: altPath,
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: 'BLOCKED',
                    toState: 'REROUTING',
                    event: 'ROUTE_FOUND',
                    note: 'Alternative vector verified',
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
          }

          // If REROUTING, resume moving next tick
          if (r.state === 'REROUTING') {
            const targetState: RobotState = r.carryingItem ? 'MOVING_TO_DROPOFF' : 'MOVING_TO_PICKUP';
            return {
              ...r,
              state: targetState,
              lastTransitionTime: time,
              transitionHistory: [
                {
                  id: `log-${Date.now()}`,
                  timestamp: time,
                  fromState: 'REROUTING',
                  toState: targetState,
                  event: 'ROUTE_CONFIRMED',
                  note: 'Detour active',
                },
                ...r.transitionHistory.slice(0, 15),
              ],
            };
          }

          // Movement execution (MOVING_TO_PICKUP, MOVING_TO_DROPOFF, RETURNING, LOW_BATTERY)
          if (
            (r.state === 'MOVING_TO_PICKUP' ||
              r.state === 'MOVING_TO_DROPOFF' ||
              r.state === 'RETURNING' ||
              r.state === 'LOW_BATTERY') &&
            r.path.length > 1
          ) {
            const nextCoord = r.path[1];
            const remainingPath = r.path.slice(1);

            // Check if reached destination
            if (remainingPath.length === 1 && r.targetPosition) {
              if (r.state === 'MOVING_TO_PICKUP') {
                logEvent(`Robot ${r.id} arrived at pickup ${r.destinationName}.`);
                return {
                  ...r,
                  position: nextCoord,
                  path: [],
                  state: 'PICKING_ITEM',
                  lastTransitionTime: time,
                  transitionHistory: [
                    {
                      id: `log-${Date.now()}`,
                      timestamp: time,
                      fromState: 'MOVING_TO_PICKUP',
                      toState: 'PICKING_ITEM',
                      event: 'DESTINATION_REACHED',
                      note: `Arrived at ${r.destinationName}`,
                    },
                    ...r.transitionHistory.slice(0, 15),
                  ],
                };
              } else if (r.state === 'MOVING_TO_DROPOFF') {
                logEvent(`Robot ${r.id} arrived at dropoff ${r.destinationName}.`);
                return {
                  ...r,
                  position: nextCoord,
                  path: [],
                  state: 'DELIVERING',
                  lastTransitionTime: time,
                  transitionHistory: [
                    {
                      id: `log-${Date.now()}`,
                      timestamp: time,
                      fromState: 'MOVING_TO_DROPOFF',
                      toState: 'DELIVERING',
                      event: 'DESTINATION_REACHED',
                      note: `Arrived at ${r.destinationName}`,
                    },
                    ...r.transitionHistory.slice(0, 15),
                  ],
                };
              } else if (r.state === 'RETURNING') {
                logEvent(`Robot ${r.id} returned to base staging.`);
                return {
                  ...r,
                  position: nextCoord,
                  path: [],
                  state: 'IDLE',
                  destinationName: 'Staging Base',
                  targetPosition: null,
                  lastTransitionTime: time,
                  transitionHistory: [
                    {
                      id: `log-${Date.now()}`,
                      timestamp: time,
                      fromState: 'RETURNING',
                      toState: 'IDLE',
                      event: 'BASE_REACHED',
                      note: 'Staged at base',
                    },
                    ...r.transitionHistory.slice(0, 15),
                  ],
                };
              }
            }

            return {
              ...r,
              position: nextCoord,
              path: remainingPath,
            };
          }

          // Handling state: PICKING_ITEM -> transition to MOVING_TO_DROPOFF
          if (r.state === 'PICKING_ITEM' && r.currentTaskId) {
            const task = tasks.find((t) => t.id === r.currentTaskId);
            if (task) {
              const pathToDrop = findPath(r.position, task.dropLocation, blockedCoords) || [];
              logEvent(`Robot ${r.id} picked item. Moving to dropoff ${task.dropName}.`);
              return {
                ...r,
                state: 'MOVING_TO_DROPOFF',
                carryingItem: task.itemName,
                destinationName: task.dropName,
                targetPosition: task.dropLocation,
                path: pathToDrop,
                lastTransitionTime: time,
                transitionHistory: [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: time,
                    fromState: 'PICKING_ITEM',
                    toState: 'MOVING_TO_DROPOFF',
                    event: 'ITEM_COLLECTED',
                    note: `Loaded ${task.itemName}`,
                  },
                  ...r.transitionHistory.slice(0, 15),
                ],
              };
            }
          }

          // Handling state: DELIVERING -> transition to RETURNING
          if (r.state === 'DELIVERING') {
            const completedTaskId = r.currentTaskId;
            if (completedTaskId) {
              setTasks((curr) =>
                curr.map((t) =>
                  t.id === completedTaskId ? { ...t, state: 'COMPLETED', completedAt: time } : t
                )
              );
              logEvent(`Task ${completedTaskId} completed successfully.`);
            }

            // Return to staging base
            const baseCoord = { x: 1, y: 1 };
            const pathToBase = findPath(r.position, baseCoord, blockedCoords) || [];

            return {
              ...r,
              state: 'RETURNING',
              carryingItem: null,
              currentTaskId: null,
              destinationName: 'Staging Base 01',
              targetPosition: baseCoord,
              path: pathToBase,
              lastTransitionTime: time,
              transitionHistory: [
                {
                  id: `log-${Date.now()}`,
                  timestamp: time,
                  fromState: 'DELIVERING',
                  toState: 'RETURNING',
                  event: 'DELIVERY_COMPLETE',
                  note: 'Payload transferred to outbound',
                },
                ...r.transitionHistory.slice(0, 15),
              ],
            };
          }

          return r;
        });

        return updatedRobots;
      });
    };

    tickRef.current = window.setInterval(stepSimulation, intervalTime);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, speedMultiplier, blockedCoords, tasks, logEvent]);

  // Selected robot unit reference
  const selectedRobot = robots.find((r) => r.id === selectedRobotId) || robots[0] || null;

  return (
    <section id="simulator" className="relative w-full bg-[#F2F2F0] py-24 px-6 lg:px-12 border-b border-[#D5D8DA]">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6E7277] mb-2">
              05 / INTERACTIVE ENGINE
            </div>
            <h2 className="font-serif text-5xl sm:text-6xl text-[#111111] tracking-tight">
              Build your warehouse flow.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSystemLogic}
              className="inline-flex items-center gap-1.5 border border-[#111111] bg-white px-3.5 py-1.5 text-xs font-mono text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <span>Automata Logic M=(Q,Σ,δ,q₀,F)</span>
              <span className="text-[#65B9E8]">→</span>
            </button>
          </div>
        </div>

        {/* Master Two-Column Simulator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Large Warehouse Simulation Canvas (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <WarehouseCanvas
              robots={robots}
              tasks={tasks}
              chargingStations={chargingStations}
              blockedCoords={blockedCoords}
              selectedRobotId={selectedRobotId}
              onSelectRobot={(id) => setSelectedRobotId(id)}
              onToggleCellBlock={toggleCellBlock}
            />

            {/* Event Log Stream */}
            <div className="border border-[#D5D8DA] bg-white p-4 font-mono">
              <div className="flex items-center justify-between text-[10px] text-[#A0A3A7] uppercase tracking-wider border-b border-[#D5D8DA] pb-2 mb-2">
                <span>Deterministic Event Stream</span>
                <span>FIFO Telemetry</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1 text-xs text-[#111111] no-scrollbar">
                {eventLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#65B9E8] shrink-0">›</span>
                    <span className="leading-snug">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Compact Control Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Primary Control Box */}
            <div className="border border-[#D5D8DA] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#D5D8DA] pb-3 mb-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Simulation Controls
                </span>
                <span className="text-[11px] font-mono text-[#65B9E8] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#65B9E8] animate-ping' : 'bg-[#A0A3A7]'}`} />
                  <span>{isRunning ? 'RUNNING' : 'PAUSED'}</span>
                </span>
              </div>

              {/* Play / Pause / Reset buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`py-2 text-xs font-mono font-medium transition-colors cursor-pointer border ${
                    isRunning
                      ? 'border-[#111111] bg-[#111111] text-[#F2F2EF]'
                      : 'border-[#65B9E8] bg-[#65B9E8] text-[#111111]'
                  }`}
                >
                  {isRunning ? '❚❚ Pause' : '▶ Start'}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    // trigger single tick manually
                  }}
                  className="py-2 text-xs font-mono border border-[#D5D8DA] text-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                >
                  Step Tick
                </button>
                <button
                  onClick={() => {
                    setRobots(INITIAL_ROBOTS);
                    setTasks(INITIAL_TASKS);
                    setBlockedCoords(new Set());
                    logEvent('Simulation reset to initial fleet state.');
                  }}
                  className="py-2 text-xs font-mono border border-[#D5D8DA] text-[#6E7277] hover:text-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Speed Controls */}
              <div className="mt-4 pt-4 border-t border-[#D5D8DA] flex items-center justify-between">
                <span className="text-xs font-mono text-[#6E7277]">Speed Multiplier:</span>
                <div className="inline-flex border border-[#D5D8DA] p-0.5">
                  {[1, 2, 4].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeedMultiplier(s)}
                      className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                        speedMultiplier === s
                          ? 'bg-[#111111] text-white font-bold'
                          : 'text-[#6E7277] hover:text-[#111111]'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Scenario & Event Injection */}
              <div className="mt-6 pt-4 border-t border-[#D5D8DA]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#A0A3A7] mb-2.5">
                  Inject System Events:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAddTask}
                    className="p-2 border border-[#D5D8DA] text-left text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                  >
                    + Add Task
                  </button>
                  <button
                    onClick={() => toggleCellBlock({ x: 5, y: 3 })}
                    className="p-2 border border-[#D5D8DA] text-left text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                  >
                    + Block Route
                  </button>
                  <button
                    onClick={handleTriggerLowBattery}
                    className="p-2 border border-[#D5D8DA] text-left text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                  >
                    + Low Battery
                  </button>
                  <button
                    onClick={() => {
                      toggleCellBlock({ x: 5, y: 3 });
                      toggleCellBlock({ x: 5, y: 4 });
                      toggleCellBlock({ x: 5, y: 5 });
                    }}
                    className="p-2 border border-[#D5D8DA] text-left text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                  >
                    + Congestion
                  </button>
                  <button
                    onClick={handleAddRobot}
                    className="col-span-2 p-2 border border-[#D5D8DA] text-left text-xs font-mono text-[#111111] hover:border-[#111111] hover:bg-[#F2F2F0] cursor-pointer"
                  >
                    + Add Robot to Fleet ({robots.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Fleet Summary List */}
            <div className="border border-[#D5D8DA] bg-white p-6">
              <div className="flex items-center justify-between border-b border-[#D5D8DA] pb-3 mb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#111111]">
                  Active Fleet Units ({robots.length})
                </span>
                <span className="text-[10px] font-mono text-[#A0A3A7]">SELECT TO INSPECT</span>
              </div>

              <div className="space-y-2">
                {robots.map((r) => {
                  const isSelected = r.id === selectedRobotId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRobotId(r.id)}
                      className={`w-full flex items-center justify-between p-2.5 border text-left font-mono text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#111111] bg-[#F2F2F0]'
                          : 'border-[#D5D8DA] hover:border-[#111111]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            r.state === 'BLOCKED'
                              ? 'bg-[#16191D]'
                              : r.state === 'CHARGING'
                              ? 'bg-[#65B9E8]'
                              : 'bg-[#111111]'
                          }`}
                        />
                        <span className="font-bold text-[#111111]">{r.id}</span>
                        <span className="text-[#6E7277] truncate max-w-[120px]">
                          {r.state.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#6E7277]">{Math.round(r.battery)}%</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Robot Detail Panel with FSM & Demonstration Overrides */}
            {selectedRobot && (
              <RobotDetailPanel
                robot={selectedRobot}
                onTriggerEvent={triggerRobotEvent}
                onClose={() => setSelectedRobotId('')}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
