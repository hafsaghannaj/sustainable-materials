import React from "react";
import "./Badge.css";

const CertificationBadge = ({ type }) => {
  return <span className="badge badge--certification">{type}</span>;
};

export default CertificationBadge;
