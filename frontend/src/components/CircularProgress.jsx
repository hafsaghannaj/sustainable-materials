import React from "react";
import "./CircularProgress.css";

const CircularProgress = ({ value, size = "medium" }) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const clamped = Math.max(0, Math.min(100, value));
  const strokeDashoffset =
    circumference - (clamped / 100) * circumference;

  const sizeClass = size === "small" ? "circular-progress--small" : "";

  return (
    <div className={`circular-progress ${sizeClass}`}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="var(--color-gray-300)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--color-primary)"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="circular-progress__value">{clamped}%</div>
    </div>
  );
};

export default CircularProgress;
