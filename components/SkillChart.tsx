import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SkillSet } from '../types';

interface SkillChartProps {
  skills: SkillSet;
}

const SkillChart: React.FC<SkillChartProps> = ({ skills }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const allSkills = [
      ...skills.languages.map(l => ({ name: l.split('(')[0].trim(), type: 'Lang', value: 90 })),
      ...skills.technical.map(t => ({ name: t, type: 'Tech', value: 85 }))
    ];

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width - margin.left - margin.right]);

    const y = d3.scaleBand()
      .range([0, height - margin.top - margin.bottom])
      .domain(allSkills.map(d => d.name))
      .padding(.1);

    // Bars
    svg.selectAll("myRect")
      .data(allSkills)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name) as number)
      .attr("width", 0) // Animate from 0
      .attr("height", y.bandwidth())
      .attr("fill", "#4ade80")
      .transition()
      .duration(1000)
      .attr("width", d => x(d.value));

    // Axes
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", "#4ade80")
      .style("font-family", "monospace");

    svg.append("g")
      .call(d3.axisLeft(y))
      .attr("color", "#4ade80")
      .style("font-family", "monospace")
      .style("font-size", "12px");

  }, [skills]);

  return <svg ref={svgRef} className="w-full h-auto" />;
};

export default SkillChart;