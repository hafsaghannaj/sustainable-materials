import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw, Server, Cpu, Database } from "lucide-react";

export const ProfessionalLoading = ({
  isLoading,
  error,
  retry,
  progress,
  estimatedTime,
}) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  return (
    <div className="professional-loading">
      <div className="neural-background">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="neural-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="loading-content">
        <div className="loading-icon">
          <Cpu className="cpu-icon" />
          <Database className="db-icon" />
          <Server className="server-icon" />
        </div>

        <div className="loading-text">
          <h3>Processing Intelligence</h3>
          <p>Analyzing carbon patterns{dots}</p>
        </div>

        <div className="progress-section">
          {progress !== undefined && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="progress-details">
            <div className="detail-item">
              <span>Query Optimization</span>
              <span className="status">done</span>
            </div>
            <div className="detail-item">
              <span>Vector Search</span>
              <span className="status">running</span>
            </div>
            <div className="detail-item">
              <span>ML Inference</span>
              <span className="status">waiting</span>
            </div>
          </div>

          {estimatedTime && (
            <div className="eta">Estimated completion: {formatTime(estimatedTime)}</div>
          )}
        </div>

        <div className="system-metrics">
          <MetricItem label="CPU" value={75} unit="%" color="#00B894" />
          <MetricItem label="Memory" value={62} unit="%" color="#6C5CE7" />
          <MetricItem label="GPU" value={45} unit="%" color="#FD79A8" />
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="error-state">
      <AlertCircle size={48} className="error-icon" />

      <div className="error-content">
        <h3>Intelligence Engine Encountered an Issue</h3>
        <p className="error-message">{error.message}</p>

        <div className="error-actions">
          <button onClick={onRetry} className="btn btn-primary" type="button">
            <RefreshCw size={16} />
            Retry Analysis
          </button>
          <button onClick={() => setExpanded(!expanded)} className="btn btn-outline" type="button">
            {expanded ? "Hide Details" : "Show Technical Details"}
          </button>
        </div>

        {expanded && (
          <div className="error-details">
            <pre>{error.stack}</pre>
            <div className="error-metadata">
              <span>Timestamp: {new Date().toISOString()}</span>
              <span>Error ID: {generateErrorId()}</span>
              <span>Component: Intelligence Engine</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricItem = ({ label, value, unit, color }) => (
  <div className="metric-item">
    <span className="metric-label">{label}</span>
    <span className="metric-value" style={{ color }}>
      {value}
      {unit}
    </span>
  </div>
);

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const generateErrorId = () => `ERR-${Math.random().toString(36).slice(2, 8)}`;
