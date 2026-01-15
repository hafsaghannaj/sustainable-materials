import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./immersive-experience.css";

const riskCells = [
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

const monteCarloData = [
  { time: "T1", p95: 1.6, median: 1.2, p5: 0.8 },
  { time: "T2", p95: 1.4, median: 1.1, p5: 0.7 },
  { time: "T3", p95: 1.2, median: 1.0, p5: 0.6 },
];

const markers = [
  { name: "US", coordinates: [-100, 40] },
  { name: "EU", coordinates: [10, 50] },
];

const globeFlags = [
  { id: 1, lat: 40.7, lon: -74, risk: "high" },
  { id: 2, lat: 51.5, lon: -0.1, risk: "medium" },
  { id: 3, lat: 35.7, lon: 139.7, risk: "low" },
  { id: 4, lat: -33.9, lon: 151.2, risk: "medium" },
  { id: 5, lat: 1.3, lon: 103.8, risk: "high" },
  { id: 6, lat: 52.5, lon: 13.4, risk: "low" },
];

const toXYZ = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
};

const riskColor = (risk) => {
  if (risk === "high") return "#E17055";
  if (risk === "medium") return "#FDCB6E";
  return "#00B894";
};

const Globe3D = () => {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 8, 4]} intensity={1.1} />
      <mesh rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          color="#D6EBFF"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      {globeFlags.map((flag) => {
        const [x, y, z] = toXYZ(flag.lat, flag.lon, 2.25);
        return (
          <mesh key={flag.id} position={[x, y, z]}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
            <meshStandardMaterial
              color={riskColor(flag.risk)}
              emissive={riskColor(flag.risk)}
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      })}
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
};

const ImmersiveExperience = () => {
  return (
    <div className="atlas-page">
      <header className="atlas-header">
        <div className="header-left" />
      </header>

      <div className="atlas-controls">
        <select className="time-select" defaultValue="24h">
          <option value="24h">24h</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
        </select>
      </div>

      <div className="atlas-grid">
        <div className="atlas-card">
          <ComposableMap projection="geoEqualEarth">
            <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#F8FAFC"
                    stroke="#E2E8F0"
                  />
                ))
              }
            </Geographies>
            {markers.map((marker) => (
              <Marker key={marker.name} coordinates={marker.coordinates}>
                <circle r={3} fill="#00B894" />
              </Marker>
            ))}
          </ComposableMap>
        </div>

        <div className="atlas-card globe-3d-card">
          <Globe3D />
        </div>

        <div className="atlas-card">
          <h3>Monte Carlo Simulation</h3>
          <div className="chart-meta">CI: 95%</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monteCarloData}>
              <defs>
                <linearGradient id="mcFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="p95" stroke="#E17055" fillOpacity={0} />
              <Area
                type="monotone"
                dataKey="median"
                stroke="#00B894"
                strokeWidth={2}
                fill="url(#mcFill)"
              />
              <Area type="monotone" dataKey="p5" stroke="#6C5CE7" fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="atlas-card">
          <h3>Risk Matrix</h3>
          <div className="risk-grid">
            {riskCells.map((cell, idx) => (
              <div
                key={idx}
                className="risk-cell"
                style={{ backgroundColor: cell.color }}
              >
                <span className="risk-value">{cell.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImmersiveExperience;
