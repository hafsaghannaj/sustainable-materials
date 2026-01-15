import React from "react";
import "./Badge.css";

const Badge = ({ type = "default", label }) => {
  return <span className={`badge badge--${type}`}>{label}</span>;
};

export default Badge;
