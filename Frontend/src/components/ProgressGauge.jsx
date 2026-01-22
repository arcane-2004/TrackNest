import React from "react";

const polarToCartesian = (cx, cy, r, angle) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

export default function DashedGauge({
  value = 72,
  max = 100,
  size = 260,
  segments = 40,
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 10;
  const thickness = 25;

  const activeSegments = Math.round((percent / 100) * segments);

  return (
    <svg
      width={size}
      height={size / 2 + 30}
      viewBox={`0 0 ${size} ${size / 2 + 30}`}
    >
      {/* Segments */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = -180 + (i / (segments - 1)) * 180;

        const outer = polarToCartesian(cx, cy, radius, angle);
        const inner = polarToCartesian(cx, cy, radius - thickness, angle);

        const isActive = i < activeSegments;

        const color = isActive
          ? percent < 40
            ? "#22c55e"
            : percent < 70
            ? "#facc15"
            : "#ef4444"
          : "#353540";

        return (
          <line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transition: "stroke 0.3s ease" }}
          />
        );
      })}

      {/* Percentage text */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fill="#FF9800"
      >
        {Math.round(percent)}%
      </text>

      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fontSize="13"
        fill="#6b7280"
      >
        Used
      </text>
    </svg>
  );
}
