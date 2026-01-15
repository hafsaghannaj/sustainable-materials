import React, { useEffect, useMemo, useState } from "react";
import {
  Globe,
  Building2,
  TrendingUp,
  AlertCircle,
  Network,
  GitMerge,
  Shield,
  BarChart3,
  Cpu,
  Database,
  Zap,
} from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const CommandCenter = ({
  globalData,
  realtimeUpdates,
  predictiveModels,
}) => {
  const [timeRange, setTimeRange] = useState("24h");
  const [activeView, setActiveView] = useState("global");

  useEffect(() => {
    const ws = new WebSocket("wss://api.terraweave.com/v2/realtime");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleRealtimeUpdate(data);
    };

    return () => ws.close();
  }, []);

  const computeUtilization = 72;
  const dataThroughput = "1.2GB";
  const networkLatency = 48;
  const savedCarbon = 145000;

  return (
    <div className="command-center">
      <div className="global-header">
        <div className="header-left">
          <Globe size={24} />
          <span className="status-indicator online">
            <div className="pulse-dot" />
            Systems Operational
          </span>
        </div>

        <div className="header-right">
          <TimeSeriesSelector range={timeRange} onChange={setTimeRange} />
          <AlertFeed alerts={realtimeUpdates?.alerts || []} maxItems={5} />
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item col-span-4">
          <GlobalMapVisualization data={globalData} onRegionClick={() => {}} />
        </div>

        <div className="grid-item col-span-4">
          <PredictiveAnalytics models={predictiveModels} confidenceInterval={0.95} />
        </div>

        <div className="grid-item col-span-4">
          <RiskHeatmap risks={calculateRiskMatrix()} thresholds={riskThresholds} />
        </div>

        <div className="grid-item col-span-6">
          <PortfolioPerformance
            portfolio={activePortfolio}
            benchmark={industryBenchmark}
            attribution={performanceAttribution}
          />
        </div>

        <div className="grid-item col-span-6">
          <CarbonArbitrageEngine
            marketData={carbonMarket}
            predictions={carbonPredictions}
            execution={arbitrageExecution}
          />
        </div>

        <div className="grid-item col-span-12">
          <SupplyChainNetwork
            network={supplyChainGraph}
            resilience={calculateResilienceScore()}
            vulnerabilities={identifyVulnerabilities()}
          />
        </div>
      </div>

      <div className="status-bar">
        <div className="status-item">
          <Cpu size={14} />
          <span>Compute: {computeUtilization}%</span>
        </div>
        <div className="status-item">
          <Database size={14} />
          <span>Data: {dataThroughput}/s</span>
        </div>
        <div className="status-item">
          <Network size={14} />
          <span>Latency: {networkLatency}ms</span>
        </div>
        <div className="status-item">
          <Zap size={14} />
          <span>Carbon Saved: {formatCarbon(savedCarbon)}</span>
        </div>
      </div>
    </div>
  );
};

const PredictiveAnalytics = ({ models, confidenceInterval }) => {
  const predictions = useMemo(() => {
    if (models?.monteCarloSimulation) {
      return models.monteCarloSimulation(10000);
    }
    return {
      distribution: [
        { time: "T1", p95: 1.6, median: 1.2, p5: 0.8 },
        { time: "T2", p95: 1.4, median: 1.1, p5: 0.7 },
        { time: "T3", p95: 1.2, median: 1.0, p5: 0.6 },
      ],
      var: 1.2,
      expectedShortfall: 1.4,
      sharpeRatio: 1.1,
    };
  }, [models]);

  return (
    <div className="predictive-analytics">
      <div className="analytics-header">
        <h4>Monte Carlo Simulation</h4>
        <span className="confidence-badge">CI: {confidenceInterval * 100}%</span>
      </div>

      <div className="simulation-chart">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={predictions.distribution}>
            <defs>
              <linearGradient id="uncertainty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00B894" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00B894" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" />
            <YAxis label={{ value: "Carbon (kg CO2e)", angle: -90 }} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value) => [formatNumber(value), "Carbon"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="p95"
              stroke="#E17055"
              fillOpacity={0.1}
              fill="url(#uncertainty)"
            />
            <Area type="monotone" dataKey="median" stroke="#00B894" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="p5" stroke="#6C5CE7" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="uncertainty-metrics">
        <div className="metric">
          <span className="metric-label">Value at Risk (95%)</span>
          <span className="metric-value">{formatNumber(predictions.var)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Expected Shortfall</span>
          <span className="metric-value">{formatNumber(predictions.expectedShortfall)}</span>
        </div>
        <div className="metric">
          <span className="metric-label">Sharpe Ratio</span>
          <span className="metric-value">{predictions.sharpeRatio.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

const TimeSeriesSelector = ({ range, onChange }) => {
  return (
    <select value={range} onChange={(e) => onChange(e.target.value)}>
      {["1h", "24h", "7d", "30d"].map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
};

const AlertFeed = ({ alerts, maxItems }) => {
  return (
    <div className="alert-feed">
      {alerts.slice(0, maxItems).map((alert, idx) => (
        <div key={idx} className="alert-item">
          <AlertCircle size={14} />
          <span>{alert.message || "System alert"}</span>
        </div>
      ))}
    </div>
  );
};

const GlobalMapVisualization = ({ data, onRegionClick }) => {
  const markers = data?.markers || [
    { name: "NA", coordinates: [-100, 40] },
    { name: "EU", coordinates: [10, 50] },
  ];
  return (
    <div className="global-map">
      <ComposableMap projection="geoEqualEarth">
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#F8F9FA" stroke="#DEE2E6" />
            ))
          }
        </Geographies>
        {markers.map((marker) => (
          <Marker key={marker.name} coordinates={marker.coordinates}>
            <circle r={4} fill="#00B894" onClick={() => onRegionClick(marker)} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

const RiskHeatmap = ({ risks }) => {
  const labels = ["Low", "Medium", "High"];
  return (
    <div className="risk-heatmap">
      <div className="risk-title">Risk Matrix</div>
      <div className="risk-grid">
        {risks.map((cell, idx) => (
          <div
            key={idx}
            className="risk-cell"
            style={{ backgroundColor: cell.color }}
          >
            <span className="risk-value">{cell.value}</span>
            <span className="risk-label">{cell.label}</span>
          </div>
        ))}
      </div>
      <div className="risk-legend">
        {labels.map((label) => (
          <span key={label} className="legend-chip">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};
const PortfolioPerformance = () => <div className="portfolio-performance">Portfolio</div>;
const CarbonArbitrageEngine = () => <div className="carbon-arbitrage">Arbitrage</div>;
const SupplyChainNetwork = () => <div className="supply-chain-network">Supply Chain</div>;

const calculateRiskMatrix = () => {
  return [
    { value: 0.12, label: "Supply", color: "#E8F7F2" },
    { value: 0.28, label: "Cost", color: "#D7F2EA" },
    { value: 0.46, label: "Schedule", color: "#C5ECDD" },
    { value: 0.32, label: "Policy", color: "#FCEFD1" },
    { value: 0.55, label: "Market", color: "#F9DEB0" },
    { value: 0.71, label: "Quality", color: "#F5C78B" },
    { value: 0.64, label: "Energy", color: "#F6D0C7" },
    { value: 0.78, label: "Logistics", color: "#F2B4A7" },
    { value: 0.9, label: "Geopolitics", color: "#EBA08E" },
  ];
};
const calculateResilienceScore = () => 0.82;
const identifyVulnerabilities = () => [];
const handleRealtimeUpdate = () => {};
const formatCarbon = (value) => `${Math.round(value).toLocaleString()} kg CO2e`;
const formatNumber = (value) => Number(value).toFixed(2);

const activePortfolio = [];
const industryBenchmark = {};
const performanceAttribution = {};
const carbonMarket = {};
const carbonPredictions = {};
const arbitrageExecution = {};
const supplyChainGraph = {};
const riskThresholds = {};
