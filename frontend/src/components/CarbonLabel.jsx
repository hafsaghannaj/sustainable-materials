import React from "react";
import "./CarbonLabel.css";

import Badge from "./Badge";
import CircularProgress from "./CircularProgress";
import LeafIcon from "./LeafIcon";

const CarbonLabel = ({ data, size = "medium" }) => {
  const { embodiedCarbon, rating, circularityScore, comparisons, certifications } =
    data;

  const getRatingColor = (ratingValue) => {
    const colors = {
      "A+": "var(--color-carbon-low)",
      A: "var(--color-carbon-low)",
      B: "#55D3B7",
      C: "var(--color-carbon-medium)",
      D: "#FFA726",
      F: "var(--color-carbon-high)",
    };
    return colors[ratingValue] || "#6C757D";
  };

  return (
    <div className={`carbon-label carbon-label--${size}`}>
      <div className="carbon-label__header">
        <div className="carbon-label__title">
          <LeafIcon />
          <h3>Carbon Nutrition Label</h3>
        </div>
        <div
          className="carbon-label__rating"
          style={{ backgroundColor: getRatingColor(rating) }}
        >
          <span className="rating-letter">{rating}</span>
          <span className="rating-text">Carbon Rating</span>
        </div>
      </div>

      <div className="carbon-label__body">
        <div className="carbon-metric">
          <div className="metric-label">Embodied Carbon</div>
          <div className="metric-value">{embodiedCarbon} kg CO2e/kg</div>
          <div className="metric-bar">
            <div
              className="metric-bar__fill"
              style={{
                width: `${Math.min(embodiedCarbon * 20, 100)}%`,
                backgroundColor: getRatingColor(rating),
              }}
            />
          </div>
        </div>

        <div className="circularity-score">
          <CircularProgress value={circularityScore} />
          <div className="circularity-label">Circularity Score</div>
        </div>

        <div className="comparison-chart">
          <h4>Vs Industry Average</h4>
          {comparisons.map((comp, idx) => (
            <div key={idx} className="comparison-item">
              <span className="material-name">{comp.material}</span>
              <div className="comparison-bar">
                <div className="comparison-bar__industry" style={{ width: "100%" }} />
                <div
                  className="comparison-bar__current"
                  style={{
                    width: `${(comp.current / comp.industry) * 100}%`,
                    backgroundColor:
                      comp.current < comp.industry
                        ? "var(--color-carbon-low)"
                        : "var(--color-carbon-high)",
                  }}
                />
              </div>
              <span className="comparison-percent">
                {comp.current < comp.industry ? "down" : "up"}
                {Math.abs(((comp.current - comp.industry) / comp.industry) * 100).toFixed(
                  1
                )}
                %
              </span>
            </div>
          ))}
        </div>

        <div className="certifications">
          {certifications.map((cert, idx) => (
            <Badge key={idx} type="certification" label={cert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarbonLabel;
