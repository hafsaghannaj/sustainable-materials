import React, { useState } from "react";
import {
  Zap,
  Target,
  TrendingDown,
  DollarSign,
  Layers,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import "./GenerativeDesignDashboard.css";

const GenerativeDesignDashboard = ({ buildingData }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [selectedAlternative, setSelectedAlternative] = useState(null);
  const [optimizationGoals, setOptimizationGoals] = useState({
    carbonReduction: 30,
    costLimit: 500000,
    timeline: "standard",
  });

  const handleOptimize = () => {
    const mockAlternatives = [
      {
        id: "opt-1",
        name: "Carbon Champion",
        carbonReduction: 42,
        costChange: 8,
        timeline: "standard",
        materials: 12,
        score: 94,
        tradeoffs: {
          cost: { impact: "+8%", reason: "Premium sustainable materials" },
          timeline: { impact: "No change", reason: "Standard availability" },
          performance: { impact: "+5%", reason: "Higher quality materials" },
        },
      },
      {
        id: "opt-2",
        name: "Budget Balanced",
        carbonReduction: 28,
        costChange: -2,
        timeline: "+2 weeks",
        materials: 8,
        score: 87,
        tradeoffs: {
          cost: { impact: "-2%", reason: "Local sourcing" },
          timeline: { impact: "+2 weeks", reason: "Custom fabrication" },
          performance: { impact: "No change", reason: "Equivalent specs" },
        },
      },
    ];
    setAlternatives(mockAlternatives);
    setSelectedAlternative(mockAlternatives[0]);
  };

  return (
    <div className="generative-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <Zap className="header-icon" />
          <div>
            <h2>Generative Design Assistant</h2>
            <p>AI-powered material optimization for your project</p>
          </div>
        </div>

        <div className="optimization-goals">
          <div className="goal-slider">
            <label>
              <Target size={16} />
              <span>Carbon Reduction Target</span>
              <span className="goal-value">
                {optimizationGoals.carbonReduction}%
              </span>
            </label>
            <input
              type="range"
              min="10"
              max="80"
              value={optimizationGoals.carbonReduction}
              onChange={(e) =>
                setOptimizationGoals({
                  ...optimizationGoals,
                  carbonReduction: parseInt(e.target.value, 10),
                })
              }
            />
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleOptimize}>
            <RefreshCw size={18} />
            <span>Generate Alternatives</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="alternatives-grid">
          <h3>Generated Design Alternatives</h3>
          <div className="alternatives-list">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className={`alternative-card ${
                  selectedAlternative?.id === alt.id ? "selected" : ""
                }`}
                onClick={() => setSelectedAlternative(alt)}
              >
                <div className="alternative-header">
                  <h4>{alt.name}</h4>
                  <div className="alternative-score">
                    <div className="score-circle">{alt.score}</div>
                  </div>
                </div>

                <div className="alternative-metrics">
                  <div className="metric">
                    <TrendingDown size={16} />
                    <span className="metric-value">{alt.carbonReduction}%</span>
                    <span className="metric-label">Carbon Reduction</span>
                  </div>

                  <div className="metric">
                    <DollarSign size={16} />
                    <span
                      className={`metric-value ${
                        alt.costChange >= 0 ? "positive" : "negative"
                      }`}
                    >
                      {alt.costChange > 0 ? "+" : ""}
                      {alt.costChange}%
                    </span>
                    <span className="metric-label">Cost Impact</span>
                  </div>

                  <div className="metric">
                    <Layers size={16} />
                    <span className="metric-value">{alt.materials}</span>
                    <span className="metric-label">Materials Changed</span>
                  </div>
                </div>

                <div className="alternative-actions">
                  <button
                    className="btn btn-outline"
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Eye size={14} />
                    <span>Preview</span>
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Download size={14} />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedAlternative && (
          <div className="alternative-details">
            <h3>Alternative Details: {selectedAlternative.name}</h3>

            <div className="details-grid">
              <div className="carbon-savings">
                <h4>Carbon Impact</h4>
                <div className="savings-visual">
                  <div className="current-bar">
                    <span>Current</span>
                    <div className="bar" style={{ height: "100%" }} />
                  </div>
                  <div className="proposed-bar">
                    <span>Proposed</span>
                    <div
                      className="bar"
                      style={{
                        height: `${100 - selectedAlternative.carbonReduction}%`,
                        backgroundColor: "var(--color-primary)",
                      }}
                    />
                  </div>
                </div>
                <div className="savings-amount">
                  <TrendingDown size={20} />
                  <span>{selectedAlternative.carbonReduction}% reduction</span>
                  <span className="savings-co2">
                    approx 42,500 kg CO2e saved
                  </span>
                </div>
              </div>

              <div className="material-changes">
                <h4>Material Changes</h4>
                <div className="changes-list">
                  {[
                    {
                      from: "Traditional Concrete",
                      to: "Low-Carbon Concrete",
                      savings: "65%",
                    },
                    {
                      from: "Fiberglass Insulation",
                      to: "Mycelium Insulation",
                      savings: "82%",
                    },
                    {
                      from: "PVC Flooring",
                      to: "Bamboo Flooring",
                      savings: "74%",
                    },
                  ].map((change, idx) => (
                    <div key={idx} className="material-change">
                      <div className="change-from">
                        <div
                          className="material-badge"
                          style={{ backgroundColor: "var(--color-danger)" }}
                        />
                        <span>{change.from}</span>
                      </div>
                      <div className="change-arrow">-&gt;</div>
                      <div className="change-to">
                        <div
                          className="material-badge"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        />
                        <span>{change.to}</span>
                      </div>
                      <div className="change-savings">
                        <span className="savings-badge">
                          {change.savings} less carbon
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tradeoffs-analysis">
                <h4>Tradeoffs Analysis</h4>
                <div className="tradeoffs-list">
                  {Object.entries(selectedAlternative.tradeoffs).map(
                    ([key, value]) => (
                      <div key={key} className="tradeoff-item">
                        <div className="tradeoff-header">
                          <span className="tradeoff-category">{key}</span>
                          <span
                            className={`tradeoff-impact ${
                              value.impact.includes("+") ? "positive" : "negative"
                            }`}
                          >
                            {value.impact}
                          </span>
                        </div>
                        <div className="tradeoff-reason">{value.reason}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => alert("Export to Revit is coming soon.")}
              >
                <Download size={16} />
                <span>Export to Revit</span>
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => alert("Specification sheet generation is coming soon.")}
              >
                <span>Generate Specification Sheet</span>
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => alert("Supplier quote requests are coming soon.")}
              >
                <span>Request Supplier Quotes</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerativeDesignDashboard;
