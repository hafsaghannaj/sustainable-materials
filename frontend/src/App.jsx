import React, { useState } from "react";

import CarbonLabel from "./components/CarbonLabel";
import MaterialComparisonTable from "./components/MaterialComparisonTable";
import GenerativeDesignDashboard from "./components/GenerativeDesignDashboard";
import InteractiveCalculator from "./components/InteractiveCalculator";
import Material3DViewer from "./components/Material3DViewer";
import { IntelligentAssistant } from "./ui/intelligence-layer/intelligent-assistant";
import { CommandCenter } from "./ui/dashboard/command-center";
import { ProfessionalLoading } from "./ui/feedback/professional-loading";
import WhyThisMatters from "./views/WhyThisMatters";
import WhatElsePortfolio from "./views/WhatElsePortfolio";
import ImmersiveExperience from "./views/ImmersiveExperience";

const sampleData = {
  embodiedCarbon: 0.82,
  rating: "B",
  circularityScore: 78,
  comparisons: [
    { material: "Concrete", current: 0.82, industry: 2.5 },
    { material: "Steel", current: 0.82, industry: 3.2 },
    { material: "Wood", current: 0.82, industry: 0.5 },
  ],
  certifications: ["Cradle to Cradle Silver", "FSC"],
};

const comparisonMaterials = [
  {
    id: "mat-1",
    name: "Bamboo Composite",
    supplier: "Evergreen Supply",
    carbon: -0.9,
    carbonRating: "A+",
    cost: 85,
    costTrend: "down",
    costChange: "-3%",
    recycled: 95,
    circularity: 88,
    color: "#00B894",
    certifications: ["FSC", "EPD"],
  },
  {
    id: "mat-2",
    name: "Mycelium Panel",
    supplier: "BioBuild Solutions",
    carbon: -0.5,
    carbonRating: "A",
    cost: 120,
    costTrend: "up",
    costChange: "+4%",
    recycled: 100,
    circularity: 92,
    color: "#6C5CE7",
    certifications: ["C2C", "GreenGuard"],
  },
  {
    id: "mat-3",
    name: "Hempcrete Block",
    supplier: "HempForm Labs",
    carbon: 0.3,
    carbonRating: "B",
    cost: 65,
    costTrend: "flat",
    costChange: "0%",
    recycled: 85,
    circularity: 74,
    color: "#FDCB6E",
    certifications: ["EPD"],
  },
];

const sampleBuildingData = {
  project: "Eco Office Tower",
  area: 15000,
};

const material3d = {
  carbon: 0.42,
  thermal: 0.74,
  strength: 0.82,
  mechanical: {
    density: 0.78,
    strength: 0.82,
  },
};

const App = () => {
  const [activeTab, setActiveTab] = useState("product");
  const globalData = { markers: [{ name: "NA", coordinates: [-100, 40] }] };
  const realtimeUpdates = { alerts: [{ message: "Supplier risk flagged" }] };
  const predictiveModels = {
    monteCarloSimulation: () => ({
      distribution: [
        { time: "T1", p95: 1.6, median: 1.2, p5: 0.8 },
        { time: "T2", p95: 1.4, median: 1.1, p5: 0.7 },
        { time: "T3", p95: 1.2, median: 1.0, p5: 0.6 },
      ],
      var: 1.2,
      expectedShortfall: 1.4,
      sharpeRatio: 1.1,
    }),
  };

  return (
    <div className="container" style={{ padding: "var(--space-8) 0" }}>
      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === "product" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveTab("product")}
        >
          Materials
        </button>
        <button
          className={`tab-button ${activeTab === "atlas" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveTab("atlas")}
        >
          Risk
        </button>
        <button
          className={`tab-button ${activeTab === "why" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveTab("why")}
        >
          Why This Matters
        </button>
        <button
          className={`tab-button ${activeTab === "portfolio" ? "active" : ""}`}
          type="button"
          onClick={() => setActiveTab("portfolio")}
        >
          What Else
        </button>
      </div>

      {activeTab === "atlas" ? (
        <div className="immersive-wrapper">
          <ImmersiveExperience />
        </div>
      ) : activeTab === "portfolio" ? (
        <WhatElsePortfolio />
      ) : activeTab === "why" ? (
        <WhyThisMatters />
      ) : (
        <div className="product-page">
          <header className="atlas-header" />

          <div className="product-grid">
            <section className="product-card">
              <CarbonLabel data={sampleData} />
            </section>

            <section className="product-card span-2">
              <MaterialComparisonTable
                materials={comparisonMaterials}
                onSelect={() => {}}
              />
            </section>

            <section className="product-card span-2">
              <GenerativeDesignDashboard buildingData={sampleBuildingData} />
            </section>

            <section className="product-card">
              <InteractiveCalculator materials={comparisonMaterials} />
            </section>

            <section className="product-card">
              <Material3DViewer material={material3d} />
            </section>

            <section className="product-card span-2">
              <IntelligentAssistant
                projectContext={{}}
                userBehavior={{}}
                marketData={{}}
              />
            </section>

            <section className="product-card">
              <ProfessionalLoading isLoading progress={64} estimatedTime={180} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
