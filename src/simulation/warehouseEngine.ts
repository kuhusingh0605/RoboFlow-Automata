/**
 * RoboFlow — Warehouse Simulation Engine
 * Graph Pathfinding & Multi-FSM Coordination Core
 */

import {
  GridCoord,
  RobotUnit,
  TaskUnit,
  ChargingStation,
  WarehouseZone,
  RobotState,
  RobotEvent,
  ROBOT_TRANSITIONS,
  TransitionLog,
} from '../types/automata';

export const GRID_COLS = 16;
export const GRID_ROWS = 10;

// Defined static storage racks (shelves)
export interface ShelfBlock {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SHELF_BLOCKS: ShelfBlock[] = [
  { id: 'rack-A1', name: 'RACK A1', x: 3, y: 2, width: 2, height: 2 },
  { id: 'rack-A2', name: 'RACK A2', x: 3, y: 6, width: 2, height: 2 },
  { id: 'rack-B1', name: 'RACK B1', x: 7, y: 2, width: 2, height: 2 },
  { id: 'rack-B2', name: 'RACK B2', x: 7, y: 6, width: 2, height: 2 },
  { id: 'rack-C1', name: 'RACK C1', x: 11, y: 2, width: 2, height: 2 },
  { id: 'rack-C2', name: 'RACK C2', x: 11, y: 6, width: 2, height: 2 },
];

export const PICKUP_STATIONS = [
  { id: 'P-01', name: 'Shelf Bay A-04', coord: { x: 2, y: 2 } },
  { id: 'P-02', name: 'Shelf Bay A-12', coord: { x: 2, y: 6 } },
  { id: 'P-03', name: 'Shelf Bay B-08', coord: { x: 6, y: 3 } },
  { id: 'P-04', name: 'Shelf Bay C-14', coord: { x: 10, y: 6 } },
];

export const DROPOFF_STATIONS = [
  { id: 'D-01', name: 'Outbound Pack 01', coord: { x: 14, y: 1 } },
  { id: 'D-02', name: 'Outbound Pack 02', coord: { x: 14, y: 4 } },
  { id: 'D-03', name: 'Sorting Conveyor 03', coord: { x: 14, y: 7 } },
  { id: 'D-04', name: 'Express Freight 04', coord: { x: 14, y: 9 } },
];

export const INITIAL_CHARGING_STATIONS: ChargingStation[] = [
  { id: 'CS-01', name: 'Pad 01', position: { x: 0, y: 2 }, state: 'AVAILABLE', occupiedByRobotId: null },
  { id: 'CS-02', name: 'Pad 02', position: { x: 0, y: 5 }, state: 'AVAILABLE', occupiedByRobotId: null },
  { id: 'CS-03', name: 'Pad 03', position: { x: 0, y: 8 }, state: 'AVAILABLE', occupiedByRobotId: null },
];

export const INITIAL_ZONES: WarehouseZone[] = [
  { id: 'ZA', name: 'Zone Alpha (Inbound)', bounds: { minX: 0, maxX: 5, minY: 0, maxY: 9 }, state: 'CLEAR', activeRobotCount: 0 },
  { id: 'ZB', name: 'Zone Beta (Core Storage)', bounds: { minX: 6, maxX: 11, minY: 0, maxY: 9 }, state: 'CLEAR', activeRobotCount: 0 },
  { id: 'ZC', name: 'Zone Gamma (Outbound)', bounds: { minX: 12, maxX: 15, minY: 0, maxY: 9 }, state: 'CLEAR', activeRobotCount: 0 },
];

/**
 * Check if a cell is an impassable shelf obstacle
 */
export function isShelf(x: number, y: number): boolean {
  for (const shelf of SHELF_BLOCKS) {
    if (x >= shelf.x && x < shelf.x + shelf.width && y >= shelf.y && y < shelf.y + shelf.height) {
      return true;
    }
  }
  return false;
}

/**
 * Breadth-First Search (BFS) pathfinder
 */
export function findPath(
  start: GridCoord,
  goal: GridCoord,
  blockedCoords: Set<string>
): GridCoord[] | null {
  if (start.x === goal.x && start.y === goal.y) return [start];

  const queue: { coord: GridCoord; path: GridCoord[] }[] = [{ coord: start, path: [start] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { x: 0, y: -1 }, // North
    { x: 1, y: 0 },  // East
    { x: 0, y: 1 },  // South
    { x: -1, y: 0 }, // West
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { coord, path } = current;

    if (coord.x === goal.x && coord.y === goal.y) {
      return path;
    }

    for (const dir of directions) {
      const nextX = coord.x + dir.x;
      const nextY = coord.y + dir.y;
      const key = `${nextX},${nextY}`;

      // Boundary check
      if (nextX < 0 || nextX >= GRID_COLS || nextY < 0 || nextY >= GRID_ROWS) continue;

      // Shelf obstacle check (unless it's the goal coordinate, e.g. edge docking)
      if (isShelf(nextX, nextY) && !(nextX === goal.x && nextY === goal.y)) continue;

      // Dynamic blocked obstacle check (unless it's start or goal)
      if (blockedCoords.has(key) && !(nextX === goal.x && nextY === goal.y)) continue;

      if (!visited.has(key)) {
        visited.add(key);
        queue.push({
          coord: { x: nextX, y: nextY },
          path: [...path, { x: nextX, y: nextY }],
        });
      }
    }
  }

  return null; // No path found
}

/**
 * Format timestamp nicely
 */
export function formatTime(date: Date = new Date()): string {
  return date.toTimeString().split(' ')[0];
}

/**
 * Initial standard fleet setup
 */
export const INITIAL_ROBOTS: RobotUnit[] = [
  {
    id: 'R01',
    name: 'Unit 01 (Alpha)',
    state: 'IDLE',
    battery: 94,
    currentTaskId: null,
    position: { x: 1, y: 1 },
    targetPosition: null,
    path: [],
    destinationName: 'Staging Base 01',
    speed: 1.4,
    carryingItem: null,
    lastTransitionTime: '10:00:00',
    transitionHistory: [
      {
        id: 'log-01',
        timestamp: '10:00:00',
        fromState: 'CHARGING',
        toState: 'IDLE',
        event: 'BATTERY_FULL',
        note: 'Staged at North Bay',
      },
    ],
    colorAccent: '#65B9E8',
  },
  {
    id: 'R02',
    name: 'Unit 02 (Beta)',
    state: 'IDLE',
    battery: 78,
    currentTaskId: null,
    position: { x: 1, y: 4 },
    targetPosition: null,
    path: [],
    destinationName: 'Staging Base 02',
    speed: 1.4,
    carryingItem: null,
    lastTransitionTime: '10:00:00',
    transitionHistory: [
      {
        id: 'log-02',
        timestamp: '10:00:00',
        fromState: 'MAINTENANCE',
        toState: 'IDLE',
        event: 'SERVICE_COMPLETED',
        note: 'Sensor calibrated',
      },
    ],
    colorAccent: '#78C6EB',
  },
  {
    id: 'R03',
    name: 'Unit 03 (Gamma)',
    state: 'IDLE',
    battery: 88,
    currentTaskId: null,
    position: { x: 1, y: 7 },
    targetPosition: null,
    path: [],
    destinationName: 'Staging Base 03',
    speed: 1.4,
    carryingItem: null,
    lastTransitionTime: '10:00:00',
    transitionHistory: [
      {
        id: 'log-03',
        timestamp: '10:00:00',
        fromState: 'RETURNING',
        toState: 'IDLE',
        event: 'BASE_REACHED',
        note: 'Standby for assignment',
      },
    ],
    colorAccent: '#93D2F3',
  },
  {
    id: 'R04',
    name: 'Unit 04 (Delta)',
    state: 'IDLE',
    battery: 62,
    currentTaskId: null,
    position: { x: 5, y: 1 },
    targetPosition: null,
    path: [],
    destinationName: 'Transit Corridor 01',
    speed: 1.4,
    carryingItem: null,
    lastTransitionTime: '10:00:00',
    transitionHistory: [
      {
        id: 'log-04',
        timestamp: '10:00:00',
        fromState: 'CHARGING',
        toState: 'IDLE',
        event: 'BATTERY_FULL',
        note: 'Ready for outbound orders',
      },
    ],
    colorAccent: '#B7DFF1',
  },
];

export const INITIAL_TASKS: TaskUnit[] = [
  {
    id: 'T-101',
    state: 'CREATED',
    itemName: 'Precision Servo Motor #M8',
    pickupLocation: { x: 2, y: 2 },
    pickupName: 'Shelf Bay A-04',
    dropLocation: { x: 14, y: 1 },
    dropName: 'Outbound Pack 01',
    assignedRobotId: null,
    createdAt: '10:00:02',
    priority: 'high',
  },
  {
    id: 'T-102',
    state: 'CREATED',
    itemName: 'Optical Sensor Array 500',
    pickupLocation: { x: 6, y: 3 },
    pickupName: 'Shelf Bay B-08',
    dropLocation: { x: 14, y: 4 },
    dropName: 'Outbound Pack 02',
    assignedRobotId: null,
    createdAt: '10:00:05',
    priority: 'standard',
  },
  {
    id: 'T-103',
    state: 'CREATED',
    itemName: 'Lithium Battery Module 48V',
    pickupLocation: { x: 2, y: 6 },
    pickupName: 'Shelf Bay A-12',
    dropLocation: { x: 14, y: 7 },
    dropName: 'Sorting Conveyor 03',
    assignedRobotId: null,
    createdAt: '10:00:10',
    priority: 'standard',
  },
];
