import React, { useState } from "react";
import { ArrowUpDown, Filter, Download, Share2, AlertCircle } from "lucide-react";

import CarbonBadge from "./CarbonBadge";
import CertificationBadge from "./CertificationBadge";
import CircularProgress from "./CircularProgress";
import TrendIndicator from "./TrendIndicator";
import "./MaterialComparisonTable.css";

const MaterialComparisonTable = ({ materials, onSelect = () => {} }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState("carbon");

  const handleSelectMaterial = (materialId) => {
    const newSelection = selectedMaterials.includes(materialId)
      ? selectedMaterials.filter((id) => id !== materialId)
      : [...selectedMaterials, materialId].slice(0, 4);

    setSelectedMaterials(newSelection);
    onSelect(newSelection);
  };

  const columns = [
    { key: "name", label: "Material", sortable: true },
    { key: "carbon", label: "Embodied Carbon", sortable: true, unit: "kg CO2e/kg" },
    { key: "cost", label: "Cost", sortable: true, unit: "$/unit" },
    { key: "recycled", label: "Recycled Content", sortable: true, unit: "%" },
    { key: "circularity", label: "Circularity", sortable: true, unit: "/100" },
    { key: "certifications", label: "Certifications", sortable: false },
    { key: "actions", label: "", sortable: false },
  ];


  return (
    <div className="comparison-table">
      <div className="table-toolbar">
        <div className="toolbar-left">
          <h3>Compare Sustainable Materials</h3>
          <span className="selected-count">
            {selectedMaterials.length} selected (max 4)
          </span>
        </div>

        <div className="toolbar-right">
          <button className="btn btn-icon">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="btn btn-icon">
            <ArrowUpDown size={16} />
            <span>Sort</span>
          </button>
          <button className="btn btn-primary">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>
                  <div className="header-cell">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <button
                        className={`sort-btn ${sortBy === col.key ? "active" : ""}`}
                        onClick={() => setSortBy(col.key)}
                      >
                        <ArrowUpDown size={12} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {materials.map((material) => (
              <tr
                key={material.id}
                className={selectedMaterials.includes(material.id) ? "selected" : ""}
                onClick={() => handleSelectMaterial(material.id)}
              >
                <td>
                  <div className="material-info">
                    <div
                      className="material-color"
                      style={{ backgroundColor: material.color }}
                    />
                    <div>
                      <div className="material-name">{material.name}</div>
                      <div className="material-supplier">{material.supplier}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="carbon-cell">
                    <div className="carbon-value">{material.carbon}</div>
                    <CarbonBadge rating={material.carbonRating} />
                  </div>
                </td>

                <td>
                  <div className="cost-cell">
                    <div className="cost-value">{material.cost}</div>
                    <TrendIndicator
                      trend={material.costTrend}
                      value={material.costChange}
                    />
                  </div>
                </td>

                <td>
                  <div className="progress-cell">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${material.recycled}%` }}
                      />
                    </div>
                    <span>{material.recycled}%</span>
                  </div>
                </td>

                <td>
                  <CircularProgress value={material.circularity} size="small" />
                </td>

                <td>
                  <div className="certifications-cell">
                    {material.certifications.map((cert, idx) => (
                      <CertificationBadge key={idx} type={cert} />
                    ))}
                  </div>
                </td>

                <td>
                  <div className="actions-cell">
                    <button className="btn-icon-sm" type="button">
                      <Share2 size={14} />
                    </button>
                    <button className="btn-icon-sm" type="button">
                      <AlertCircle size={14} />
                    </button>
                    <div className="selection-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => handleSelectMaterial(material.id)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialComparisonTable;
