/**
 * RoboFlow — Top-Down Warehouse Canvas (SVG-based engineering canvas)
 * Renders racks, pickup/dropoff stations, charging pads, dynamic obstacles,
 * paths, lidar ranges, and smoothly animated robot markers.
 */

import React, { useState } from 'react';
import {
  RobotUnit,
  TaskUnit,
  ChargingStation,
  GridCoord,
} from '../../types/automata';
import {
  GRID_COLS,
  GRID_ROWS,
  SHELF_BLOCKS,
  PICKUP_STATIONS,
  DROPOFF_STATIONS,
} from '../../simulation/warehouseEngine';

interface WarehouseCanvasProps {
  robots: RobotUnit[];
  tasks: TaskUnit[];
  chargingStations: ChargingStation[];
  blockedCoords: Set<string>;
  selectedRobotId: string | null;
  onSelectRobot: (robotId: string) => void;
  onToggleCellBlock: (coord: GridCoord) => void;
}

export const WarehouseCanvas: React.FC<WarehouseCanvasProps> = ({
  robots,
  chargingStations,
  blockedCoords,
  selectedRobotId,
  onSelectRobot,
  onToggleCellBlock,
}) => {
  const [hoveredRobot, setHoveredRobot] = useState<RobotUnit | null>(null);
  const [hoverCoord, setHoverCoord] = useState<GridCoord | null>(null);

  // SVG coordinate scale math
  const cellWidth = 56;
  const cellHeight = 56;
  const svgWidth = GRID_COLS * cellWidth;
  const svgHeight = GRID_ROWS * cellHeight;

  return (
    <div className="relative w-full overflow-hidden border border-[#D5D8DA] bg-[#EFEFEC]">
      {/* Top canvas info bar */}
      <div className="flex items-center justify-between border-b border-[#D5D8DA] bg-white px-4 py-2 text-xs font-mono text-[#6E7277]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#65B9E8]" />
            <span className="text-[#111111] font-medium">WAREHOUSE TOP-DOWN CANVAS</span>
          </span>
          <span className="text-[#A0A3A7]">16×10 AISLE MESH</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>CLICK CORRIDOR TO TOGGLE OBSTACLE</span>
          <span>·</span>
          <span>CLICK UNIT TO INSPECT FSM</span>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="relative overflow-x-auto no-scrollbar">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[720px] select-none block"
          style={{ background: '#EFEFEC' }}
        >
          <defs>
            {/* Grid background pattern */}
            <pattern
              id="gridPattern"
              width={cellWidth}
              height={cellHeight}
              patternUnits="userSpaceOnUse"
            >
              <rect
                width={cellWidth}
                height={cellHeight}
                fill="none"
                stroke="#D5D8DA"
                strokeWidth="0.75"
                strokeDasharray="2 4"
              />
            </pattern>

            {/* Shelf hatch pattern */}
            <pattern
              id="shelfHatch"
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#D5D8DA" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={svgWidth} height={svgHeight} fill="url(#gridPattern)" />

          {/* Zone Division Overlays */}
          {/* Zone Alpha (Inbound) */}
          <rect
            x={0}
            y={0}
            width={cellWidth * 5}
            height={svgHeight}
            fill="#111111"
            fillOpacity="0.015"
          />
          <text
            x={12}
            y={20}
            fill="#A0A3A7"
            fontSize="10"
            fontFamily="JetBrains Mono"
            letterSpacing="0.1em"
          >
            ZONE ALPHA / INBOUND & POWER
          </text>

          {/* Zone Beta (Core Storage) */}
          <rect
            x={cellWidth * 5}
            y={0}
            width={cellWidth * 7}
            height={svgHeight}
            fill="#111111"
            fillOpacity="0.025"
          />
          <text
            x={cellWidth * 5 + 12}
            y={20}
            fill="#A0A3A7"
            fontSize="10"
            fontFamily="JetBrains Mono"
            letterSpacing="0.1em"
          >
            ZONE BETA / AUTOMATED RACKS
          </text>

          {/* Zone Gamma (Outbound) */}
          <rect
            x={cellWidth * 12}
            y={0}
            width={cellWidth * 4}
            height={svgHeight}
            fill="#111111"
            fillOpacity="0.015"
          />
          <text
            x={cellWidth * 12 + 12}
            y={20}
            fill="#A0A3A7"
            fontSize="10"
            fontFamily="JetBrains Mono"
            letterSpacing="0.1em"
          >
            ZONE GAMMA / OUTBOUND
          </text>

          {/* Charging Stations (Left Column) */}
          {chargingStations.map((station) => {
            const cx = station.position.x * cellWidth + cellWidth / 2;
            const cy = station.position.y * cellHeight + cellHeight / 2;
            const isOccupied = station.state === 'OCCUPIED' || station.state === 'CHARGING';

            return (
              <g key={station.id}>
                {/* Station bounding area */}
                <rect
                  x={station.position.x * cellWidth + 4}
                  y={station.position.y * cellHeight + 4}
                  width={cellWidth - 8}
                  height={cellHeight - 8}
                  fill={isOccupied ? '#E5F4FB' : '#FFFFFF'}
                  stroke={isOccupied ? '#65B9E8' : '#D5D8DA'}
                  strokeWidth="1.5"
                />
                {/* Outlined ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="14"
                  fill="none"
                  stroke={isOccupied ? '#65B9E8' : '#A0A3A7'}
                  strokeWidth="1.5"
                  strokeDasharray={isOccupied ? 'none' : '3 2'}
                />
                <text
                  x={cx}
                  y={cy + 3}
                  textAnchor="middle"
                  fill="#111111"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                  fontWeight="500"
                >
                  ⚡ {station.id.replace('CS-', 'C')}
                </text>
              </g>
            );
          })}

          {/* Storage Racks (Shelves) */}
          {SHELF_BLOCKS.map((shelf) => {
            const rx = shelf.x * cellWidth;
            const ry = shelf.y * cellHeight;
            const rw = shelf.width * cellWidth;
            const rh = shelf.height * cellHeight;

            return (
              <g key={shelf.id}>
                <rect
                  x={rx + 2}
                  y={ry + 2}
                  width={rw - 4}
                  height={rh - 4}
                  fill="#FFFFFF"
                  stroke="#111111"
                  strokeWidth="1.25"
                />
                <rect
                  x={rx + 2}
                  y={ry + 2}
                  width={rw - 4}
                  height={rh - 4}
                  fill="url(#shelfHatch)"
                  opacity="0.3"
                />
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 4}
                  textAnchor="middle"
                  fill="#111111"
                  fontSize="10"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                  letterSpacing="0.05em"
                >
                  {shelf.name}
                </text>
              </g>
            );
          })}

          {/* Pickup Stations */}
          {PICKUP_STATIONS.map((p) => {
            const px = p.coord.x * cellWidth + cellWidth / 2;
            const py = p.coord.y * cellHeight + cellHeight / 2;

            return (
              <g key={p.id}>
                <circle
                  cx={px}
                  cy={py}
                  r="10"
                  fill="#FFFFFF"
                  stroke="#111111"
                  strokeWidth="1"
                />
                <text
                  x={px}
                  y={py + 3}
                  textAnchor="middle"
                  fill="#111111"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {p.id}
                </text>
              </g>
            );
          })}

          {/* Dropoff Stations */}
          {DROPOFF_STATIONS.map((d) => {
            const dx = d.coord.x * cellWidth + cellWidth / 2;
            const dy = d.coord.y * cellHeight + cellHeight / 2;

            return (
              <g key={d.id}>
                <rect
                  x={dx - 12}
                  y={dy - 12}
                  width="24"
                  height="24"
                  fill="#FFFFFF"
                  stroke="#111111"
                  strokeWidth="1"
                />
                <text
                  x={dx}
                  y={dy + 3}
                  textAnchor="middle"
                  fill="#111111"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {d.id}
                </text>
              </g>
            );
          })}

          {/* Blocked Coordinates (Obstacles) */}
          {Array.from(blockedCoords).map((coordKey) => {
            const [bx, by] = coordKey.split(',').map(Number);
            const ox = bx * cellWidth;
            const oy = by * cellHeight;

            return (
              <g
                key={coordKey}
                onClick={() => onToggleCellBlock({ x: bx, y: by })}
                className="cursor-pointer"
              >
                <rect
                  x={ox + 2}
                  y={oy + 2}
                  width={cellWidth - 4}
                  height={cellHeight - 4}
                  fill="#16191D"
                  stroke="#D5D8DA"
                  strokeWidth="1"
                />
                <line
                  x1={ox + 6}
                  y1={oy + 6}
                  x2={ox + cellWidth - 6}
                  y2={oy + cellHeight - 6}
                  stroke="#65B9E8"
                  strokeWidth="1.5"
                />
                <line
                  x1={ox + cellWidth - 6}
                  y1={oy + 6}
                  x2={ox + 6}
                  y2={oy + cellHeight - 6}
                  stroke="#65B9E8"
                  strokeWidth="1.5"
                />
                <text
                  x={ox + cellWidth / 2}
                  y={oy + cellHeight - 6}
                  textAnchor="middle"
                  fill="#F2F2EF"
                  fontSize="8"
                  fontFamily="JetBrains Mono"
                >
                  BLOCKED
                </text>
              </g>
            );
          })}

          {/* Interactive Corridor Click Layer */}
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((_, c) => {
              const key = `${c},${r}`;
              // Skip shelf locations so user doesn't toggle obstacle on top of racks
              const isShelfCell = SHELF_BLOCKS.some(
                (s) => c >= s.x && c < s.x + s.width && r >= s.y && r < s.y + s.height
              );
              if (isShelfCell) return null;

              return (
                <rect
                  key={key}
                  x={c * cellWidth}
                  y={r * cellHeight}
                  width={cellWidth}
                  height={cellHeight}
                  fill="transparent"
                  className="hover:fill-[#65B9E8]/10 cursor-pointer"
                  onClick={() => onToggleCellBlock({ x: c, y: r })}
                  onMouseEnter={() => setHoverCoord({ x: c, y: r })}
                  onMouseLeave={() => setHoverCoord(null)}
                />
              );
            })
          )}

          {/* Robot Paths (Subtle Thin Blue Lines) */}
          {robots.map((robot) => {
            if (!robot.path || robot.path.length < 2) return null;
            const isSelected = robot.id === selectedRobotId;

            const pathString = robot.path
              .map((pt, i) => {
                const px = pt.x * cellWidth + cellWidth / 2;
                const py = pt.y * cellHeight + cellHeight / 2;
                return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
              })
              .join(' ');

            return (
              <g key={`path-${robot.id}`}>
                <path
                  d={pathString}
                  fill="none"
                  stroke={isSelected ? '#65B9E8' : '#65B9E8'}
                  strokeWidth={isSelected ? '2' : '1.2'}
                  strokeDasharray={robot.state === 'BLOCKED' ? '3 3' : 'none'}
                  strokeOpacity={isSelected ? 0.9 : 0.4}
                />
                {/* Destination target node */}
                {robot.targetPosition && (
                  <circle
                    cx={robot.targetPosition.x * cellWidth + cellWidth / 2}
                    cy={robot.targetPosition.y * cellHeight + cellHeight / 2}
                    r={isSelected ? '5' : '3.5'}
                    fill="none"
                    stroke="#65B9E8"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}

          {/* Robots (Small Blue Circular Markers) */}
          {robots.map((robot) => {
            const rx = robot.position.x * cellWidth + cellWidth / 2;
            const ry = robot.position.y * cellHeight + cellHeight / 2;
            const isSelected = robot.id === selectedRobotId;
            const isBlocked = robot.state === 'BLOCKED';
            const isCharging = robot.state === 'CHARGING';

            return (
              <g
                key={robot.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRobot(robot.id);
                }}
                onMouseEnter={() => setHoveredRobot(robot)}
                onMouseLeave={() => setHoveredRobot(null)}
                className="cursor-pointer transition-all duration-300"
              >
                {/* Lidar perimeter aura for selected unit */}
                {isSelected && (
                  <circle
                    cx={rx}
                    cy={ry}
                    r="28"
                    fill="none"
                    stroke="#65B9E8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    className="animate-pulse-subtle"
                  />
                )}

                {/* Robot Main Outer Ring */}
                <circle
                  cx={rx}
                  cy={ry}
                  r="15"
                  fill="#FFFFFF"
                  stroke={isSelected ? '#111111' : '#6E7277'}
                  strokeWidth={isSelected ? '2' : '1.2'}
                />

                {/* Inner status dot */}
                <circle
                  cx={rx}
                  cy={ry}
                  r="10"
                  fill={isBlocked ? '#16191D' : isCharging ? '#65B9E8' : '#111111'}
                />

                {/* Robot ID label */}
                <text
                  x={rx}
                  y={ry + 3}
                  textAnchor="middle"
                  fill="#F2F2EF"
                  fontSize="8.5"
                  fontFamily="JetBrains Mono"
                  fontWeight="600"
                >
                  {robot.id}
                </text>

                {/* Payload indicator dot */}
                {robot.carryingItem && (
                  <circle
                    cx={rx + 9}
                    cy={ry - 9}
                    r="3.5"
                    fill="#65B9E8"
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredRobot && (
        <div
          className="absolute z-30 pointer-events-none bg-[#16191D] text-[#F2F2EF] border border-[#2A2F35] p-3 text-xs font-mono shadow-xl transition-all"
          style={{
            top: '12px',
            right: '12px',
          }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#2A2F35] pb-1.5">
            <span className="font-bold text-[#65B9E8]">{hoveredRobot.name}</span>
            <span className="text-[10px] text-[#A0A3A7]">BATTERY: {Math.round(hoveredRobot.battery)}%</span>
          </div>
          <div className="mt-1.5 space-y-1 text-[11px]">
            <div>
              <span className="text-[#A0A3A7]">STATE:</span>{' '}
              <span className="text-white">{hoveredRobot.state}</span>
            </div>
            <div>
              <span className="text-[#A0A3A7]">TASK:</span>{' '}
              <span className="text-white">{hoveredRobot.currentTaskId || 'NONE (STANDBY)'}</span>
            </div>
            <div>
              <span className="text-[#A0A3A7]">DESTINATION:</span>{' '}
              <span className="text-white">{hoveredRobot.destinationName}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom coordinate hover indicator */}
      <div className="border-t border-[#D5D8DA] bg-white px-4 py-2 text-[11px] font-mono text-[#6E7277] flex items-center justify-between">
        <div>
          {hoverCoord ? (
            <span>CELL: X={hoverCoord.x}, Y={hoverCoord.y} · CLICK TO OBSTRUCT / FREE</span>
          ) : (
            <span>HOVER OVER MAP TO INSPECT GRID COORDINATES</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#111111]" />
            <span>ROBOT</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#111111] bg-white" />
            <span>SHELF</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[#65B9E8] bg-[#E5F4FB]" />
            <span>CHARGING PAD</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#16191D]" />
            <span>BLOCKED ZONE</span>
          </span>
        </div>
      </div>
    </div>
  );
};
