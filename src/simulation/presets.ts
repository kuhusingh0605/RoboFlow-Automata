/**
 * RoboFlow — Simulation Presets
 */

import { GridCoord } from '../types/automata';

export interface SimulationPreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  robotCount: number;
  initialBlockedCoords: GridCoord[];
  batteryMultiplier: number;
  speed: number;
  taskGenIntervalMs: number;
}

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'daily-operations',
    title: 'Daily Operations',
    subtitle: 'Balanced fleet flow',
    description: 'Nominal warehouse conditions. Steady order distribution, balanced aisle traffic, and automatic charging threshold rotations.',
    robotCount: 4,
    initialBlockedCoords: [],
    batteryMultiplier: 1.0,
    speed: 1,
    taskGenIntervalMs: 8000,
  },
  {
    id: 'high-demand',
    title: 'High Demand',
    subtitle: 'Maximum order intake',
    description: 'Surge in picking tickets. All fleet units continuously scheduled across storage racks with rapid pick-and-pack turnover.',
    robotCount: 6,
    initialBlockedCoords: [],
    batteryMultiplier: 1.2,
    speed: 2,
    taskGenIntervalMs: 4000,
  },
  {
    id: 'congestion-test',
    title: 'Congestion Test',
    subtitle: 'Corridor choke stress',
    description: 'High traffic density through the central intersection. Evaluates autonomous queuing, yield invariants, and zone state machine transitions.',
    robotCount: 5,
    initialBlockedCoords: [{ x: 5, y: 5 }, { x: 9, y: 5 }],
    batteryMultiplier: 1.0,
    speed: 1,
    taskGenIntervalMs: 6000,
  },
  {
    id: 'low-battery-scenario',
    title: 'Low Battery Scenario',
    subtitle: 'Power starvation recovery',
    description: 'Fleet units dispatched with depleted reserve (<25%). Tests dynamic path abort, charging pad negotiation, and priority queuing.',
    robotCount: 4,
    initialBlockedCoords: [],
    batteryMultiplier: 2.5,
    speed: 1,
    taskGenIntervalMs: 10000,
  },
  {
    id: 'blocked-route',
    title: 'Blocked Route',
    subtitle: 'Aisle obstacle evasion',
    description: 'Primary transit spine obstructed near Bay B. Robots transition through BLOCKED -> REROUTING to compute alternate perimeter paths.',
    robotCount: 4,
    initialBlockedCoords: [{ x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }],
    batteryMultiplier: 1.0,
    speed: 1,
    taskGenIntervalMs: 7000,
  },
  {
    id: 'peak-hour',
    title: 'Peak Hour',
    subtitle: 'Full warehouse stress',
    description: 'Concurrent multiple pick, delivery, and return tasks with dynamic route recalculation across all four warehouse zones.',
    robotCount: 6,
    initialBlockedCoords: [{ x: 9, y: 3 }],
    batteryMultiplier: 1.3,
    speed: 2,
    taskGenIntervalMs: 3500,
  },
];
