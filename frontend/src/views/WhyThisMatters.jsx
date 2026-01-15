import React from "react";
import "./why-this-matters.css";

const WhyThisMatters = () => {
  return (
    <div className="why-matters">
      <section className="why-section">
        <div className="why-grid">
          <div className="why-card">
            <h3>The Construction Industrys Dirty Secret</h3>
            <div className="mini-diagram">
              <div className="problem-chart">
                <div className="problem-bar">
                  <span className="problem-label">Construction emissions</span>
                  <div className="problem-fill" style={{ width: "39%" }}>
                    39%
                  </div>
                </div>
                <div className="problem-metric">
                  <span>87% want sustainable materials</span>
                  <span>91% cannot find them</span>
                </div>
              </div>
            </div>
          </div>
          <div className="why-card">
            <h3>The Chicken and Egg Failure</h3>
            <ol>
              <li>
                Material innovators have better products but lack standardized
                proof.
              </li>
              <li>
                Architects demand verified LCA, certifications, and supply
                reliability.
              </li>
              <li>Innovation stalls because no one can solve all three.</li>
            </ol>
            <p className="callout">
              Bend the emissions curve of the built environment breaks this
              deadlock.
            </p>
            <div className="mini-diagram">
              <div className="cycle-diagram">
                <div className="cycle-node">Innovators</div>
                <div className="cycle-node">Architects</div>
                <div className="cycle-node">Investors</div>
              </div>
              <div className="cycle-arrow">
                Proof required → Adoption stalls → Funding slows
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-grid">
          <div className="why-card">
            <h3>Layer 1: Immediate Economic Value</h3>
            <div className="mini-diagram">
              <div className="value-stack">
                <div className="value-chip">Minutes not hours</div>
                <div className="value-chip">Verified sourcing</div>
                <div className="value-chip">Compliance ready</div>
                <div className="value-chip">Quantified certainty</div>
              </div>
              <div className="shift-result">Immediate ROI</div>
            </div>
          </div>
          <div className="why-card">
            <h3>Layer 2: Systemic Transformation</h3>
            <div className="mini-diagram">
              <div className="loop-grid">
                <div className="loop-node">Data</div>
                <div className="loop-node">Trust</div>
                <div className="loop-node">Adoption</div>
              </div>
              <div className="loop-arrow">Data → Trust → Adoption → Data</div>
            </div>
          </div>
          <div className="why-card">
            <h3>Layer 3: Civilization-Level Impact</h3>
            <div className="mini-diagram">
              <div className="impact-grid">
                <div className="impact-node">Carbon Sinks</div>
                <div className="impact-node">Resilient Cities</div>
                <div className="impact-node">Circular Economy</div>
              </div>
              <div className="shift-result">Civilization Scale Impact</div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-grid">
          <div className="why-card">
            <h3>Shift 1: Cost Center to Value Generator</h3>
            <div className="mini-diagram">
              <div className="shift-row">
                <div className="shift-pill muted">Traditional Cost</div>
                <span className="shift-symbol">-</span>
                <div className="shift-pill">Carbon Liability</div>
                <span className="shift-symbol">+</span>
                <div className="shift-pill">Circularity Premium</div>
              </div>
              <div className="shift-row">
                <div className="shift-pill">Resilience Value</div>
                <span className="shift-symbol">+</span>
                <div className="shift-pill">Brand Premium</div>
                <span className="shift-symbol">+</span>
                <div className="shift-pill">Regulatory Advantage</div>
              </div>
              <div className="shift-result">Net Value Creation</div>
            </div>
          </div>
          <div className="why-card">
            <h3>Shift 2: Static to Dynamic Optimization</h3>
            <div className="mini-diagram">
              <div className="timeline">
                <div className="timeline-step">
                  <span>Design</span>
                  <strong>AI Selection</strong>
                </div>
                <div className="timeline-step">
                  <span>Construction</span>
                  <strong>Real-time Swaps</strong>
                </div>
                <div className="timeline-step">
                  <span>Operations</span>
                  <strong>Performance Monitor</strong>
                </div>
                <div className="timeline-step">
                  <span>End-of-Life</span>
                  <strong>Circular Routing</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="why-card">
            <h3>Shift 3: Isolated to Network Effects</h3>
            <div className="mini-diagram">
              <div className="network-grid">
                <div className="network-node">Material Innovators</div>
                <div className="network-node">Project Data</div>
                <div className="network-node">Policy Makers</div>
                <div className="network-node">More R&D Funding</div>
                <div className="network-node">Better Decisions</div>
                <div className="network-node">Smarter Regulations</div>
              </div>
              <div className="shift-result">Accelerated Decarbonization</div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="diagram-card">
          <div className="diagram-toolbar">
            <div className="diagram-tabs">
              <span className="diagram-tab active">Diagram</span>
            </div>
            <div className="diagram-actions">
              <span>Data Moats</span>
            </div>
          </div>
          <div className="diagram-canvas">
            <svg viewBox="0 0 900 420" aria-label="Data moats diagram">
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L10,3 L0,6 Z" fill="#64748b" />
                </marker>
              </defs>

              <g className="box">
                <rect x="60" y="40" width="160" height="48" rx="10" />
                <text x="140" y="70" textAnchor="middle">
                  Material Testing
                </text>
              </g>
              <g className="box">
                <rect x="60" y="120" width="160" height="48" rx="10" />
                <text x="140" y="150" textAnchor="middle">
                  Performance Data
                </text>
              </g>

              <g className="box">
                <rect x="310" y="40" width="160" height="48" rx="10" />
                <text x="390" y="70" textAnchor="middle">
                  User Activity
                </text>
              </g>
              <g className="box">
                <rect x="310" y="120" width="160" height="48" rx="10" />
                <text x="390" y="150" textAnchor="middle">
                  Behavioral Data
                </text>
              </g>

              <g className="box">
                <rect x="560" y="40" width="160" height="48" rx="10" />
                <text x="640" y="70" textAnchor="middle">
                  Supply Chain
                </text>
              </g>
              <g className="box">
                <rect x="560" y="120" width="160" height="48" rx="10" />
                <text x="640" y="150" textAnchor="middle">
                  Operational Data
                </text>
              </g>

              <g className="box">
                <rect x="740" y="40" width="160" height="48" rx="10" />
                <text x="820" y="70" textAnchor="middle">
                  Regulatory Input
                </text>
              </g>
              <g className="box">
                <rect x="740" y="120" width="160" height="48" rx="10" />
                <text x="820" y="150" textAnchor="middle">
                  Compliance Data
                </text>
              </g>

              <g className="box highlight">
                <rect x="350" y="210" width="200" height="52" rx="12" />
                <text x="450" y="242" textAnchor="middle">
                  Predictive Models
                </text>
              </g>

              <g className="box">
                <rect x="350" y="300" width="200" height="50" rx="12" />
                <text x="450" y="330" textAnchor="middle">
                  Better Recommendations
                </text>
              </g>
              <g className="box">
                <rect x="350" y="370" width="200" height="40" rx="12" />
                <text x="450" y="395" textAnchor="middle">
                  More User Activity
                </text>
              </g>

              <path d="M140 88 L140 120" className="arrow" markerEnd="url(#arrow)" />
              <path d="M390 88 L390 120" className="arrow" markerEnd="url(#arrow)" />
              <path d="M640 88 L640 120" className="arrow" markerEnd="url(#arrow)" />
              <path d="M820 88 L820 120" className="arrow" markerEnd="url(#arrow)" />

              <path d="M140 168 L350 236" className="arrow" markerEnd="url(#arrow)" />
              <path d="M390 168 L450 210" className="arrow" markerEnd="url(#arrow)" />
              <path d="M640 168 L550 236" className="arrow" markerEnd="url(#arrow)" />
              <path d="M820 168 L550 236" className="arrow" markerEnd="url(#arrow)" />

              <path d="M450 262 L450 300" className="arrow" markerEnd="url(#arrow)" />
              <path d="M450 350 L450 370" className="arrow" markerEnd="url(#arrow)" />
              <path
                d="M550 392 C680 380 680 120 470 80"
                className="arrow dotted"
                markerEnd="url(#arrow)"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="diagram-card">
          <div className="diagram-toolbar">
            <div className="diagram-tabs">
              <span className="diagram-tab active">Diagram</span>
            </div>
            <div className="diagram-actions">
              <span>The Built Environment OS</span>
            </div>
          </div>
          <div className="diagram-canvas">
            <svg viewBox="0 0 900 260" aria-label="Built environment OS">
              <defs>
                <marker
                  id="arrow"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0 L10,3 L0,6 Z" fill="#64748b" />
                </marker>
              </defs>
              <g className="box highlight">
                <rect x="80" y="30" width="740" height="70" rx="16" />
                <text x="450" y="70" textAnchor="middle">
                  Every building decision flows through the platform
                </text>
              </g>

              <g className="box">
                <rect x="80" y="130" width="180" height="60" rx="12" />
                <text x="170" y="165" textAnchor="middle">
                  Material DNA database
                </text>
              </g>
              <g className="box">
                <rect x="270" y="130" width="180" height="60" rx="12" />
                <text x="360" y="165" textAnchor="middle">
                  Carbon trading layer
                </text>
              </g>
              <g className="box">
                <rect x="460" y="130" width="180" height="60" rx="12" />
                <text x="550" y="165" textAnchor="middle">
                  Supply chain orchestration
                </text>
              </g>
              <g className="box">
                <rect x="650" y="130" width="180" height="60" rx="12" />
                <text x="740" y="165" textAnchor="middle">
                  Regulatory compliance engine
                </text>
              </g>

              <path d="M450 100 L170 130" className="arrow" markerEnd="url(#arrow)" />
              <path d="M450 100 L360 130" className="arrow" markerEnd="url(#arrow)" />
              <path d="M450 100 L550 130" className="arrow" markerEnd="url(#arrow)" />
              <path d="M450 100 L740 130" className="arrow" markerEnd="url(#arrow)" />
            </svg>
          </div>
        </div>
      </section>

      <section className="why-section">
        <div className="why-grid">
          <div className="why-card">
            <h3>For Climate Change</h3>
            <ul>
              <li>Building stock doubles by 2060</li>
              <li>Without action: 250+ gigatons CO2 locked in</li>
              <li>With action: carbon-neutral growth is possible</li>
            </ul>
          </div>
          <div className="why-card">
            <h3>For Economic Development</h3>
            <ul>
              <li>$1T+ sustainable materials market</li>
              <li>Millions of green jobs</li>
              <li>Lower construction costs through efficiency</li>
            </ul>
          </div>
          <div className="why-card">
            <h3>For Society</h3>
            <ul>
              <li>Healthier buildings and resilient cities</li>
              <li>Transparent supply chains</li>
              <li>Equitable access to innovation</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="why-section">
        <p className="callout">A more carbon-aware built environment.</p>
      </section>
    </div>
  );
};

export default WhyThisMatters;
