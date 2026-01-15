import React, { useState, useEffect } from "react";
import { Calculator, TrendingDown, DollarSign, Zap } from "lucide-react";
import "./InteractiveCalculator.css";

const InteractiveCalculator = ({ materials, buildingSpecs }) => {
  const [inputs, setInputs] = useState({
    area: 1000,
    stories: 5,
    location: "urban",
    buildingType: "office",
  });

  const [results, setResults] = useState(null);
  const [scenarios, setScenarios] = useState([]);

  const calculateImpact = () => {
    const baseCarbon = 1500;
    const baseCost = 5000000;

    const scenarioData = [
      {
        name: "Baseline",
        carbon: baseCarbon,
        cost: baseCost,
        materials: ["Traditional Concrete", "Steel", "Fiberglass"],
      },
      {
        name: "Sustainable",
        carbon: baseCarbon * 0.7,
        cost: baseCost * 1.1,
        materials: ["Low-Carbon Concrete", "Recycled Steel", "Mycelium"],
      },
      {
        name: "Regenerative",
        carbon: baseCarbon * 0.5,
        cost: baseCost * 1.2,
        materials: ["Carbon-Cured Concrete", "Mass Timber", "Hempcrete"],
      },
    ];

    setScenarios(scenarioData);

    setResults({
      totalCarbon: baseCarbon,
      carbonPerM2: baseCarbon / inputs.area,
      costPerM2: baseCost / inputs.area,
      savingsPotential: baseCarbon * 0.5,
    });
  };

  useEffect(() => {
    calculateImpact();
  }, [inputs]);

  return (
    <div className="carbon-calculator">
      <div className="calculator-header">
        <Calculator size={24} />
        <h3>Carbon Impact Calculator</h3>
      </div>

      <div className="calculator-controls">
        <div className="input-group">
          <label>Building Area (m2)</label>
          <input
            type="range"
            min="100"
            max="10000"
            step="100"
            value={inputs.area}
            onChange={(e) =>
              setInputs({ ...inputs, area: parseInt(e.target.value, 10) })
            }
          />
          <span className="input-value">{inputs.area.toLocaleString()} m2</span>
        </div>

        <div className="input-group">
          <label>Building Type</label>
          <select
            value={inputs.buildingType}
            onChange={(e) =>
              setInputs({ ...inputs, buildingType: e.target.value })
            }
          >
            <option value="office">Office</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="institutional">Institutional</option>
          </select>
        </div>
      </div>

      {results && (
        <div className="calculator-results">
          <div className="results-summary">
            <div className="result-card">
              <TrendingDown size={20} />
              <div className="result-value">{results.totalCarbon.toFixed(0)}</div>
              <div className="result-label">Total Carbon (tons CO2e)</div>
            </div>

            <div className="result-card">
              <DollarSign size={20} />
              <div className="result-value">${results.costPerM2.toFixed(0)}</div>
              <div className="result-label">Cost per m2</div>
            </div>

            <div className="result-card">
              <Zap size={20} />
              <div className="result-value">
                {results.savingsPotential.toFixed(0)}
              </div>
              <div className="result-label">Savings Potential (tons CO2e)</div>
            </div>
          </div>

          <div className="scenarios-comparison">
            <h4>Design Scenarios</h4>
            <div className="scenarios-grid">
              {scenarios.map((scenario, idx) => (
                <div key={idx} className="scenario-card">
                  <h5>{scenario.name}</h5>
                  <div className="scenario-metrics">
                    <div className="metric">
                      <span className="metric-value">
                        {scenario.carbon.toFixed(0)}
                      </span>
                      <span className="metric-label">tons CO2e</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">
                        ${(scenario.cost / 1000000).toFixed(1)}M
                      </span>
                      <span className="metric-label">Total Cost</span>
                    </div>
                  </div>
                  <div className="scenario-materials">
                    <h6>Key Materials:</h6>
                    <ul>
                      {scenario.materials.map((mat, matIdx) => (
                        <li key={matIdx}>{mat}</li>
                      ))}
                    </ul>
                  </div>
                  <button className="btn btn-outline" type="button">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCalculator;
