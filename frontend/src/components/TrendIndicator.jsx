import React from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

const TrendIndicator = ({ trend, value }) => {
  const map = {
    up: { icon: TrendingUp, className: "trend-up" },
    down: { icon: TrendingDown, className: "trend-down" },
    flat: { icon: Minus, className: "trend-flat" },
  };
  const config = map[trend] || map.flat;
  const Icon = config.icon;
  return (
    <span className={`trend-indicator ${config.className}`}>
      <Icon size={12} />
      {value}
    </span>
  );
};

export default TrendIndicator;
