/**
 * RoboFlow — Automata Definitions & Data Models
 * Formal Specification: M = (Q, Sigma, delta, q0, F)
 */

export type RobotState =
  | 'IDLE'
  | 'TASK_ASSIGNED'
  | 'MOVING_TO_PICKUP'
  | 'PICKING_ITEM'
  | 'MOVING_TO_DROPOFF'
  | 'DELIVERING'
  | 'RETURNING'
  | 'BLOCKED'
  | 'REROUTING'
  | 'LOW_BATTERY'
  | 'CHARGING'
  | 'MAINTENANCE';

export type RobotEvent =
  | 'TASK_ASSIGNED'
  | 'DESTINATION_REACHED'
  | 'ITEM_COLLECTED'
  | 'PATH_BLOCKED'
  | 'ROUTE_FOUND'
  | 'ROUTE_CONFIRMED'
  | 'DELIVERY_COMPLETE'
  | 'BASE_REACHED'
  | 'LOW_BATTERY'
  | 'BATTERY_FULL'
  | 'SERVICE_REQUIRED'
  | 'SERVICE_COMPLETED'
  | 'MANUAL_RESET';

export type TaskState =
  | 'CREATED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'PICKED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'FAILED';

export type ChargingStationState =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'OCCUPIED'
  | 'CHARGING';

export type ZoneState =
  | 'CLEAR'
  | 'BUSY'
  | 'CONGESTED'
  | 'BLOCKED';

export interface GridCoord {
  x: number;
  y: number;
}

export interface TransitionLog {
  id: string;
  timestamp: string;
  fromState: RobotState;
  toState: RobotState;
  event: RobotEvent;
  note?: string;
}

export interface RobotUnit {
  id: string; // e.g. "R01"
  name: string; // e.g. "Unit 01"
  state: RobotState;
  battery: number; // 0 - 100
  currentTaskId: string | null;
  position: GridCoord;
  targetPosition: GridCoord | null;
  path: GridCoord[];
  destinationName: string;
  speed: number; // m/s
  carryingItem: string | null;
  lastTransitionTime: string;
  transitionHistory: TransitionLog[];
  colorAccent?: string;
}

export interface TaskUnit {
  id: string; // e.g. "T-101"
  state: TaskState;
  itemName: string;
  pickupLocation: GridCoord;
  pickupName: string;
  dropLocation: GridCoord;
  dropName: string;
  assignedRobotId: string | null;
  createdAt: string;
  completedAt?: string;
  priority: 'standard' | 'high' | 'urgent';
}

export interface ChargingStation {
  id: string; // e.g. "CS-01"
  name: string;
  position: GridCoord;
  state: ChargingStationState;
  occupiedByRobotId: string | null;
}

export interface WarehouseZone {
  id: string; // e.g. "ZA"
  name: string; // e.g. "Zone Alpha"
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  state: ZoneState;
  activeRobotCount: number;
}

/**
 * Robot FSM Transition Map: delta(State, Event) -> NextState
 */
export const ROBOT_TRANSITIONS: Record<RobotState, Partial<Record<RobotEvent, RobotState>>> = {
  IDLE: {
    TASK_ASSIGNED: 'MOVING_TO_PICKUP',
    LOW_BATTERY: 'CHARGING',
    SERVICE_REQUIRED: 'MAINTENANCE',
  },
  TASK_ASSIGNED: {
    ROUTE_CONFIRMED: 'MOVING_TO_PICKUP',
    PATH_BLOCKED: 'BLOCKED',
    LOW_BATTERY: 'CHARGING',
  },
  MOVING_TO_PICKUP: {
    DESTINATION_REACHED: 'PICKING_ITEM',
    PATH_BLOCKED: 'BLOCKED',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  PICKING_ITEM: {
    ITEM_COLLECTED: 'MOVING_TO_DROPOFF',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  MOVING_TO_DROPOFF: {
    DESTINATION_REACHED: 'DELIVERING',
    PATH_BLOCKED: 'BLOCKED',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  DELIVERING: {
    DELIVERY_COMPLETE: 'RETURNING',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  RETURNING: {
    BASE_REACHED: 'IDLE',
    TASK_ASSIGNED: 'MOVING_TO_PICKUP',
    PATH_BLOCKED: 'BLOCKED',
    LOW_BATTERY: 'CHARGING',
  },
  BLOCKED: {
    ROUTE_FOUND: 'REROUTING',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  REROUTING: {
    ROUTE_CONFIRMED: 'MOVING_TO_DROPOFF',
    PATH_BLOCKED: 'BLOCKED',
    LOW_BATTERY: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  LOW_BATTERY: {
    ROUTE_CONFIRMED: 'CHARGING',
    BASE_REACHED: 'CHARGING',
    MANUAL_RESET: 'IDLE',
  },
  CHARGING: {
    BATTERY_FULL: 'IDLE',
    MANUAL_RESET: 'IDLE',
  },
  MAINTENANCE: {
    SERVICE_COMPLETED: 'IDLE',
    MANUAL_RESET: 'IDLE',
  },
};

/**
 * Human-readable state descriptors for editorial rendering
 */
export const STATE_DESCRIPTIONS: Record<RobotState, { title: string; desc: string; category: string }> = {
  IDLE: {
    title: 'Idle / Quiescent',
    desc: 'Robot rests in queue, monitoring heartbeat and awaiting task dispatch.',
    category: 'Standby',
  },
  TASK_ASSIGNED: {
    title: 'Task Assigned',
    desc: 'Dispatcher binds order manifest and computes primary trajectory.',
    category: 'Coordination',
  },
  MOVING_TO_PICKUP: {
    title: 'Moving to Pickup',
    desc: 'Navigates corridor network toward storage shelf pickup bay.',
    category: 'Transit',
  },
  PICKING_ITEM: {
    title: 'Picking Item',
    desc: 'Docked at shelf elevator; payload transfer and weight verification.',
    category: 'Handling',
  },
  MOVING_TO_DROPOFF: {
    title: 'Moving to Dropoff',
    desc: 'Transporting verified payload toward fulfillment or conveyor bay.',
    category: 'Transit',
  },
  DELIVERING: {
    title: 'Delivering',
    desc: 'Unloading payload to packing station or outbound sortation belt.',
    category: 'Handling',
  },
  RETURNING: {
    title: 'Returning',
    desc: 'Traveling empty toward base staging zone or next optimal waypoint.',
    category: 'Transit',
  },
  BLOCKED: {
    title: 'Blocked Route',
    desc: 'Lidar sensors detected obstacle or cross-traffic; movement halted.',
    category: 'Exception',
  },
  REROUTING: {
    title: 'Rerouting',
    desc: 'Graph pathfinder calculates collision-free alternative waypoint series.',
    category: 'Recovery',
  },
  LOW_BATTERY: {
    title: 'Low Battery',
    desc: 'Charge threshold breached (<20%); task suspended for power top-up.',
    category: 'Safety',
  },
  CHARGING: {
    title: 'Charging',
    desc: 'Docked on inductive copper charging pad, regenerating energy.',
    category: 'Maintenance',
  },
  MAINTENANCE: {
    title: 'Maintenance',
    desc: 'Diagnostic calibration, wheel inspection, or sensor re-zeroing.',
    category: 'Service',
  },
};
