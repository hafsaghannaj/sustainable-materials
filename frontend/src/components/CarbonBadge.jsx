import React from "react";
import "./Badge.css";

const CarbonBadge = ({ rating }) => {
  const ratingColors = {
    "A+": "var(--color-carbon-low)",
    A: "var(--color-carbon-low)",
    B: "#55D3B7",
    C: "var(--color-carbon-medium)",
    D: "#FFA726",
    F: "var(--color-carbon-high)",
  };
  return (
    <span
      className="badge badge--carbon"
      style={{ background: ratingColors[rating] || "var(--color-gray-300)" }}
    >
      {rating}
    </span>
  );
};

export default CarbonBadge;
