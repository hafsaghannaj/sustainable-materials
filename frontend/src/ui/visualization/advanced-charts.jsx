import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as d3 from "d3";
import { ForceGraph3D } from "react-force-graph";

export const SupplyChain3D = ({ nodes, links }) => {
  const graphData = useMemo(() => {
    return {
      nodes: (nodes || []).map((node) => ({
        id: node.id,
        name: node.name,
        val: Math.sqrt(node.volume || 1),
        color: getCarbonColor(node.carbonIntensity || 0),
        metadata: node,
      })),
      links: (links || []).map((link) => ({
        source: link.source,
        target: link.target,
        value: link.strength || 1,
        color: getRiskColor(link.riskScore || 0),
      })),
    };
  }, [nodes, links]);

  return (
    <ForceGraph3D
      graphData={graphData}
      nodeLabel="name"
      nodeAutoColorBy="carbonIntensity"
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.005}
      nodeThreeObject={(node) => {
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: createTextTexture(node.name),
            color: node.color,
          })
        );
        sprite.scale.set(10, 10, 1);
        return sprite;
      }}
      linkThreeObjectExtend
      linkThreeObject={(link) => {
        const material = new THREE.LineBasicMaterial({
          color: link.color,
          opacity: 0.6,
          transparent: true,
        });
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(1, 0, 0),
        ]);
        return new THREE.Line(geometry, material);
      }}
      onNodeClick={(node) => handleNodeClick(node)}
      enableNodeDrag={false}
      enableNavigationControls
    />
  );
};

export const ParallelCoordinates = ({ dimensions, data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;
    const margin = { top: 30, right: 10, bottom: 10, left: 10 };

    const yScales = dimensions.reduce((acc, dim) => {
      const values = data.map((d) => d[dim]);
      acc[dim] = d3
        .scaleLinear()
        .domain(d3.extent(values))
        .range([height - margin.bottom, margin.top]);
      return acc;
    }, {});

    const xScale = d3
      .scalePoint()
      .domain(dimensions)
      .range([margin.left, width - margin.right]);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    dimensions.forEach((dim) => {
      svg
        .append("g")
        .attr("transform", `translate(${xScale(dim)},0)`)
        .call(d3.axisLeft(yScales[dim]));

      svg
        .append("text")
        .attr("transform", `translate(${xScale(dim)},${margin.top - 10})`)
        .attr("text-anchor", "middle")
        .text(dim);
    });

    const line = d3
      .line()
      .x((d) => xScale(d.dimension))
      .y((d) => yScales[d.dimension](d.value))
      .curve(d3.curveMonotoneX);

    data.forEach((d) => {
      const lineData = dimensions.map((dim) => ({
        dimension: dim,
        value: d[dim],
      }));

      svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", getCarbonColor(d.carbon))
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.6)
        .attr("d", line);
    });
  }, [dimensions, data]);

  return <svg ref={svgRef} width="100%" height="400" />;
};

export const CarbonContourMap = ({ data, resolution }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grid = createGrid(data, resolution);
    const interpolated = interpolateGrid(grid, data, { power: 2, smoothing: 0 });

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlGn)
      .domain([d3.max(interpolated.flat()), 0]);

    interpolated.forEach((row, y) => {
      row.forEach((value, x) => {
        ctx.fillStyle = colorScale(value);
        ctx.fillRect(x, y, 1, 1);
      });
    });

    const contour = d3.contours().size([grid.width, grid.height]).thresholds(10);
    const contours = contour(interpolated.flat());

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;

    contours.forEach((shape) => {
      ctx.beginPath();
      d3.geoPath().context(ctx)(shape);
      ctx.stroke();
    });
  }, [data, resolution]);

  return <canvas ref={canvasRef} width={800} height={600} />;
};

const getCarbonColor = (value) => {
  if (value < 0.5) return "#00B894";
  if (value < 2) return "#FDCB6E";
  return "#E17055";
};

const getRiskColor = (value) => {
  if (value < 0.3) return "#00B894";
  if (value < 0.7) return "#FDCB6E";
  return "#E17055";
};

const createTextTexture = (text) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  canvas.width = 256;
  canvas.height = 64;
  context.fillStyle = "#ffffff";
  context.font = "24px sans-serif";
  context.fillText(text || "", 10, 40);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

const handleNodeClick = () => {};

const createGrid = (data, resolution) => {
  const width = resolution || 200;
  const height = resolution || 200;
  return { width, height };
};

const interpolateGrid = (grid) => {
  return Array.from({ length: grid.height }, () =>
    Array.from({ length: grid.width }, () => Math.random() * 2)
  );
};
