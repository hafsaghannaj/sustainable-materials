import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere, Cylinder } from "@react-three/drei";
import { Building, Thermometer, Recycle } from "lucide-react";
import "./Material3DViewer.css";

const CarbonVisualization = ({ material }) => {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.003;
      mesh.current.rotation.x += 0.0015;
    }
  });
  const carbon = material?.carbon ?? 0.6;
  const isNegative = carbon < 0;
  const coreColor = isNegative ? "#00B894" : carbon < 0.5 ? "#00B894" : "#FDCB6E";
  const shellColor = isNegative ? "#55D3B7" : carbon < 1.5 ? "#A29BFE" : "#E17055";
  return (
    <group ref={mesh}>
      <Sphere args={[1.05, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={coreColor} />
      </Sphere>
      <Sphere args={[1.45, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={shellColor} wireframe />
      </Sphere>
      <Cylinder args={[0.35, 0.6, 2.4, 32]} position={[2.2, 0, 0]}>
        <meshStandardMaterial color={shellColor} />
      </Cylinder>
    </group>
  );
};

const StructuralVisualization = ({ material }) => {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.002;
      mesh.current.rotation.y += 0.001;
    }
  });
  const density = material?.density ?? 0.8;
  const strength = material?.strength ?? 0.7;
  const columnColor = strength > 0.7 ? "#00A085" : "#6C5CE7";
  const beamColor = density > 0.7 ? "#343A40" : "#6C757D";
  return (
    <group ref={mesh}>
      <Box args={[1.8, 1.2, 1.8]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color={beamColor} />
      </Box>
      <Box args={[0.5, 2.4, 0.5]} position={[-1.6, 0.2, -1]}>
        <meshStandardMaterial color={columnColor} />
      </Box>
      <Box args={[0.5, 2.4, 0.5]} position={[1.6, 0.2, 1]}>
        <meshStandardMaterial color={columnColor} />
      </Box>
    </group>
  );
};

const ThermalVisualization = () => {
  const mesh = useRef();
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.z += 0.0025;
    }
  });
  return (
    <group ref={mesh}>
      <Sphere args={[1.1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#A29BFE" />
      </Sphere>
      <Cylinder args={[0.25, 0.6, 2.4, 32]} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#6C5CE7" />
      </Cylinder>
    </group>
  );
};

const Material3DViewer = ({ material }) => {
  const [viewMode, setViewMode] = useState("structural");

  return (
    <div className="material-viewer">
      <div className="viewer-controls">
        <button
          className={`control-btn ${viewMode === "structural" ? "active" : ""}`}
          onClick={() => setViewMode("structural")}
        >
          <Building size={16} />
          <span>Structural</span>
        </button>

        <button
          className={`control-btn ${viewMode === "thermal" ? "active" : ""}`}
          onClick={() => setViewMode("thermal")}
        >
          <Thermometer size={16} />
          <span>Thermal</span>
        </button>

        <button
          className={`control-btn ${viewMode === "carbon" ? "active" : ""}`}
          onClick={() => setViewMode("carbon")}
        >
          <Recycle size={16} />
          <span>Carbon</span>
        </button>
      </div>

      <div className="viewer-canvas">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />

          {viewMode === "carbon" && <CarbonVisualization material={material} />}
          {viewMode === "structural" && (
            <StructuralVisualization material={material?.mechanical} />
          )}
          {viewMode === "thermal" && <ThermalVisualization />}

          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>
      </div>

      <div className="viewer-legend">
        {viewMode === "carbon" && (
          <>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#E17055" }} />
              <span>High Carbon (&gt;2.0 kg CO2e)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#FDCB6E" }} />
              <span>Medium Carbon (0.5-2.0)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#00B894" }} />
              <span>Low Carbon (&lt;0.5)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: "#00B894" }} />
              <span>Carbon Negative (&lt;0)</span>
            </div>
          </>
        )}
      </div>

      <div className="viewer-data">
        <div className="data-card">
          <span className="data-label">Embodied Carbon</span>
          <strong className="data-value">
            {material?.carbon ?? 0.6} kg CO2e
          </strong>
        </div>
        <div className="data-card">
          <span className="data-label">Thermal Index</span>
          <strong className="data-value">{material?.thermal ?? 0.74}</strong>
        </div>
        <div className="data-card">
          <span className="data-label">Structural Score</span>
          <strong className="data-value">{material?.strength ?? 0.82}</strong>
        </div>
      </div>
    </div>
  );
};

export default Material3DViewer;
