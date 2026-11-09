# RoboFlow — Warehouse Robot Automation Simulator

**An interactive, browser-based warehouse automation simulator powered by finite-state machines and graph-based pathfinding.**

RoboFlow demonstrates how concepts from **Automata Theory** can be applied to coordinate autonomous warehouse robots. Each robot operates according to a finite-state machine (FSM), while a grid-based simulation models order pickup, delivery, navigation, battery management, obstacles, and operational events.

Built with **React, TypeScript, Vite, and Tailwind CSS**, the project combines an educational explanation of automata with a visual, interactive simulation.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Automata Theory Behind RoboFlow](#automata-theory-behind-roboflow)
- [Pathfinding](#pathfinding)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Simulation Scenarios](#simulation-scenarios)
- [Project Structure](#project-structure)
- [Implementation Notes and Limitations](#implementation-notes-and-limitations)
- [Future Enhancements](#future-enhancements)

## Overview

In a warehouse, robots must execute tasks reliably while responding to changing conditions, such as blocked aisles, low battery levels, and incoming orders. RoboFlow represents each robot's operating mode as a **finite state** and uses **events to trigger transitions** between states.

The simulator includes a **16 × 10 warehouse grid**, storage racks, pickup and drop-off locations, charging stations, predefined tasks, and a fleet of robots. Users can observe robot movement, create new tasks, add robots, block routes, and inspect state transitions as the simulation runs.

### Project Objectives

- Demonstrate a practical use of finite-state machines in warehouse automation.
- Visualize how robots transition between operational states in response to events.
- Use breadth-first search (BFS) to find navigable routes around obstacles.
- Simulate task assignment, item pickup, delivery, return travel, and battery handling.
- Provide an interactive learning environment for automata theory and multi-robot workflows.

## Key Features

| Feature | Description |
| --- | --- |
| **12-state robot FSM** | Models movement, handling, charging, rerouting, maintenance, and idle behavior. |
| **Interactive warehouse** | Visualizes robot positions, storage racks, destinations, and paths on a grid. |
| **BFS navigation** | Finds routes through walkable grid cells, avoiding static racks and blocked coordinates. |
| **Automatic task dispatch** | Assigns pending work to available robots meeting the battery requirement. |
| **Live state tracking** | Displays current robot state, task details, battery level, and transition history. |
| **Dynamic obstacles** | Allows warehouse cells to be blocked or unblocked during the simulation. |
| **Battery simulation** | Models energy use, low-battery alerts, and recharging behavior. |
| **Fleet and task controls** | Supports adding tasks and robots while the simulator is running. |
| **Scenario presets** | Provides six operational scenarios for exploring different conditions. |
| **Playback controls** | Supports starting, pausing, resetting, and changing simulation speed. |
| **System logic view** | Provides additional information on the simulator's state-based behavior. |

## Automata Theory Behind RoboFlow

The core concept is a **finite-state machine (FSM)**, using the familiar automata notation:

**M = (Q, Σ, δ, q₀, F)**

Where:

- **Q** is the set of possible robot states.
- **Σ** is the set of events that may trigger a transition.
- **δ** is the transition function mapping a state and event to the next state.
- **q₀** is the initial state (`IDLE`).
- **F** is the set of accepting or completion states in a formal automaton. In RoboFlow, task completion is instead tracked through the task lifecycle; the robot controller is a continuously operating FSM rather than a language recognizer with a defined accepting set.

### Robot States

The implementation defines the following **12 states**:

| State | Meaning |
| --- | --- |
| `IDLE` | Waiting for an available task. |
| `TASK_ASSIGNED` | Task has been assigned and route planning is underway. |
| `MOVING_TO_PICKUP` | Navigating to the pickup location. |
| `PICKING_ITEM` | Collecting the assigned item. |
| `MOVING_TO_DROPOFF` | Transporting the item to its destination. |
| `DELIVERING` | Completing the drop-off operation. |
| `RETURNING` | Returning toward a staging point or another assignment. |
| `BLOCKED` | Movement cannot continue on the current route. |
| `REROUTING` | Processing an alternative route. |
| `LOW_BATTERY` | Battery level has dropped below the operating threshold. |
| `CHARGING` | Recharging the robot's battery. |
| `MAINTENANCE` | Robot is unavailable for servicing. |

### Example State Transitions

```text
IDLE
  └── TASK_ASSIGNED ──> MOVING_TO_PICKUP
                           └── DESTINATION_REACHED ──> PICKING_ITEM
                                                         └── ITEM_COLLECTED ──> MOVING_TO_DROPOFF
                                                                                   └── DESTINATION_REACHED ──> DELIVERING
                                                                                                                 └── DELIVERY_COMPLETE ──> RETURNING
                                                                                                                                             └── BASE_REACHED ──> IDLE
```

Exception-handling transitions include:

```text
MOVING_TO_PICKUP / MOVING_TO_DROPOFF
  └── PATH_BLOCKED ──> BLOCKED
                         └── ROUTE_FOUND ──> REROUTING

IDLE / ACTIVE STATES
  └── LOW_BATTERY ──> CHARGING
                         └── BATTERY_FULL ──> IDLE

IDLE
  └── SERVICE_REQUIRED ──> MAINTENANCE
                              └── SERVICE_COMPLETED ──> IDLE
```

The FSM transition definitions are maintained in **`src/types/automata.ts`**, while simulation behavior is coordinated through **`src/components/simulator/WarehouseSimulator.tsx`**.

> **Note:** Some declared states and transitions represent the FSM specification and may not be visited during every automated simulation run. State-specific behavior is determined by the simulation engine and UI event handlers.

## Pathfinding

RoboFlow uses **Breadth-First Search (BFS)** to compute routes on the warehouse grid.

1. Start from the robot's current grid coordinate.
2. Examine neighboring cells in four directions: up, right, down, and left.
3. Skip positions outside the grid, storage rack obstacles, and dynamically blocked cells.
4. Continue searching until the destination is found or no route remains.
5. Return the discovered route for the robot to follow.

On an unweighted grid, BFS finds a path with the fewest cell-to-cell moves among traversable positions. The implementation uses a queue and a visited-coordinate set.

**Source:** `src/simulation/warehouseEngine.ts` (`findPath`)

## Technology Stack

| Category | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript |
| Build and development | Vite 8 |
| Styling | Tailwind CSS 4, CSS |
| Icons | Lucide React |
| Animation | Motion |
| Simulation | Custom TypeScript FSM logic and BFS algorithm |
| Runtime | Node.js and npm |

The package manifest also lists some additional dependencies. **The warehouse simulator itself runs in the browser and does not require a database or external AI API for its core functionality.**

## Getting Started

### Prerequisites

Install a recent version of **Node.js** compatible with Vite 8 (Node.js 20.19+ or 22.12+) and **npm**.

### Installation

**1. Clone your repository**

```bash
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>
```

Replace the placeholders with your GitHub username and actual repository name.

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

**4. Open the application**

Visit **http://localhost:3000** in your browser.

### Other Commands

```bash
npm run build     # Create a production build in dist/
npm run preview   # Preview the production build
npm run lint      # Run the TypeScript type check
```

### Environment Variables

An `.env.example` file is included in the repository with placeholders for `GEMINI_API_KEY` and `APP_URL`. **Neither variable is required for the browser-based warehouse simulation functionality reviewed here.** If you extend the project with services that use them, configure those services separately and avoid committing real secrets to GitHub.

## How to Use

1. **Open RoboFlow:** Launch the web app and scroll to the interactive simulator.
2. **Watch live operations:** Observe robots on the warehouse grid and inspect assigned tasks.
3. **Select a robot:** View its state, battery, route, and logged transitions in the robot detail panel.
4. **Create a task:** Use **+ Add Task** to inject another pickup-and-delivery job.
5. **Expand the fleet:** Use **+ Add Robot to Fleet** to introduce another simulated robot.
6. **Test obstacles:** Toggle blockable grid positions and observe the impact on navigation.
7. **Trigger low battery:** Test how the selected robot responds to a low-battery condition.
8. **Control playback:** Pause, resume, reset, or change the simulation speed.
9. **Explore system logic:** Open the system logic information panel to inspect the model behind the simulation.

## Simulation Scenarios

RoboFlow includes six selectable presets:

| Preset | Purpose |
| --- | --- |
| **Daily Operations** | Demonstrates ordinary warehouse workflow. |
| **High Demand** | Increases simulation speed to represent accelerated operations. |
| **Congestion Test** | Blocks selected corridor cells to stress navigation. |
| **Low Battery Scenario** | Places selected robots into a low-battery condition. |
| **Blocked Route** | Introduces obstacles into a primary travel route. |
| **Peak Hour** | Combines faster simulation with a blocked-cell scenario. |

Presets are defined in `src/simulation/presets.ts` and applied through the simulator component. The active handler applies specific scenario changes; not every metadata field in the preset definitions currently controls live simulation behavior.

## Project Structure

```text
automata-main/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── assets/
    │   └── images/
    ├── components/
    │   ├── Navigation.tsx
    │   ├── HeroSection.tsx
    │   ├── PhilosophySection.tsx
    │   ├── RobotFeatureSection.tsx
    │   ├── ConnectedSystemsSection.tsx
    │   ├── RhythmSection.tsx
    │   ├── RobotStatesSection.tsx
    │   ├── TaskFlowSection.tsx
    │   ├── PresetsSection.tsx
    │   ├── FooterSection.tsx
    │   └── simulator/
    │       ├── WarehouseSimulator.tsx
    │       ├── WarehouseCanvas.tsx
    │       ├── RobotDetailPanel.tsx
    │       └── SystemLogicModal.tsx
    ├── simulation/
    │   ├── warehouseEngine.ts
    │   └── presets.ts
    └── types/
        └── automata.ts
```

### Main Code Modules

- **`types/automata.ts`:** Data types, robot states and events, transition map, and descriptions.
- **`simulation/warehouseEngine.ts`:** Warehouse layout, robots, tasks, charging stations, and BFS pathfinding.
- **`simulation/presets.ts`:** Scenario metadata and preset definitions.
- **`components/simulator/WarehouseSimulator.tsx`:** Simulation state, event handling, task dispatch, robot movement, and controls.
- **`components/simulator/WarehouseCanvas.tsx`:** Visual warehouse grid and robot rendering.
- **`components/simulator/RobotDetailPanel.tsx`:** Selected robot details and transition history.
- **`components/simulator/SystemLogicModal.tsx`:** Explanatory system interface.

## Implementation Notes and Limitations

RoboFlow is an **educational simulation**, not a physical robot controller or production warehouse management system. Current limitations include:

- The warehouse uses a fixed-size, 2D grid and simplified movement rules.
- BFS routes do not model continuous-motion dynamics, acceleration, or realistic travel-time costs.
- Task assignment uses a straightforward available-robot strategy rather than an optimized fleet scheduler.
- Robot behavior, battery consumption, and charging are simulated, not connected to actual hardware or telemetry.
- Dynamic obstacles are simplified and do not constitute a formally verified multi-robot collision-avoidance system.
- Simulation data is held in React application state; persistence across page reloads is not implemented.
- Some declared FSM transitions and preset metadata are broader than the automatically exercised behaviors.

## Future Enhancements

- Improve multi-robot coordination and collision avoidance.
- Add priority-aware task scheduling and optimized robot allocation.
- Compare BFS with A* and Dijkstra's algorithm for navigation.
- Implement more realistic battery consumption, charging-station selection, and recovery from interrupted jobs.
- Add configurable warehouse maps, layouts, and robot capabilities.
- Persist simulation runs and export logs for analysis.
- Introduce simulation metrics such as task completion time, throughput, idle time, and route efficiency.
- Add automated tests for FSM transitions, pathfinding, and end-to-end task execution.

## Academic Context

**Subject Area:** Automata Theory / Theory of Computation

RoboFlow illustrates how state-transition models can organize the behavior of autonomous agents in an environment with changing events. It provides a practical connection between theoretical FSM concepts and software-based automation systems.

---

**RoboFlow** — *Modeling autonomous warehouse workflows, one state transition at a time.*
