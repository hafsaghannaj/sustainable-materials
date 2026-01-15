import React from "react";
import "./what-else-portfolio.css";

const WhatElsePortfolio = () => {
  return (
    <div className="portfolio">
      <section className="portfolio-section">
        <div className="portfolio-grid">
          <div className="portfolio-card">
            <h3>Carbon Futures Exchange</h3>
            <div className="diagram-lite">
              <div className="step">Register project</div>
              <div className="arrow">-></div>
              <div className="step">Predict sequestration</div>
              <div className="arrow">-></div>
              <div className="step">Tokenize CFC</div>
              <div className="arrow">-></div>
              <div className="step">Trade and discover price</div>
            </div>
            <p className="caption">
              Example: 100,000 m2 timber building yields 5,000 tons CO2e;
              at 100 per ton equals 500,000 asset.
            </p>
          </div>
          <div className="portfolio-card">
            <h3>Building Genome Project</h3>
            <div className="diagram-lite">
              <div className="step">Gene: material property</div>
              <div className="step">Chromosome: system</div>
              <div className="step">Genome: full spec</div>
            </div>
            <p className="caption">
              Cross-breed successful genomes, predict performance, and evolve
              better buildings via genetic algorithms.
            </p>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-grid">
          <div className="portfolio-card">
            <h3>Quantum Material Discovery</h3>
            <div className="diagram-lite">
              <div className="step">Set target properties</div>
              <div className="arrow">-></div>
              <div className="step">Quantum search</div>
              <div className="arrow">-></div>
              <div className="step">ML evaluation</div>
              <div className="arrow">-></div>
              <div className="step">Synthesis recipes</div>
            </div>
          </div>
          <div className="portfolio-card">
            <h3>Bio-Digital Twin Ecosystem</h3>
            <div className="diagram-lite">
              <div className="step">Physical twin</div>
              <div className="arrow">-></div>
              <div className="step">Digital twin</div>
              <div className="arrow">-></div>
              <div className="step">Cognitive twin</div>
            </div>
            <p className="caption">
              Predict degradation, optimize energy, and self-heal through
              adaptive material suggestions.
            </p>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-grid">
          <div className="portfolio-card">
            <h3>Global Material Passport System</h3>
            <p className="caption">
              Track material DNA, lifecycle events, ownership, carbon history,
              and circularity in real time.
            </p>
          </div>
          <div className="portfolio-card">
            <h3>Circular Economy Orchestrator</h3>
            <p className="caption">
              Match demolition supply to construction demand, minimizing waste
              while optimizing cost and carbon.
            </p>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="portfolio-grid">
          <div className="portfolio-card">
            <h3>Self-Healing Material Network</h3>
            <p className="caption">
              Deploy nano-sensors and healing agents to autonomously detect and
              repair building damage.
            </p>
          </div>
          <div className="portfolio-card">
            <h3>Carbon-Capturing Building Skins</h3>
            <p className="caption">
              Transform envelopes into active carbon capture systems and
              monetize captured carbon.
            </p>
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="diagram-card">
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
                  The Built Environment OS
                </text>
              </g>

              <g className="box">
                <rect x="80" y="130" width="180" height="60" rx="12" />
                <text x="170" y="165" textAnchor="middle">
                  Material Genome Registry
                </text>
              </g>
              <g className="box">
                <rect x="270" y="130" width="180" height="60" rx="12" />
                <text x="360" y="165" textAnchor="middle">
                  Carbon Ledger
                </text>
              </g>
              <g className="box">
                <rect x="460" y="130" width="180" height="60" rx="12" />
                <text x="550" y="165" textAnchor="middle">
                  Circular Orchestrator
                </text>
              </g>
              <g className="box">
                <rect x="650" y="130" width="180" height="60" rx="12" />
                <text x="740" y="165" textAnchor="middle">
                  Financialization Engine
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
    </div>
  );
};

export default WhatElsePortfolio;
