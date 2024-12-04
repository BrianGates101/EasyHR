import '../styling/EmployeeGraph.css';
import ViewEmployee from '../components/ViewEmployee';

import React, { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import md5 from 'md5';

const EmployeeGraph = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmployeeNumber, setSelectedEmployeeNumber] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const svgRef = useRef();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/employees`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
            setLoading(false);
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (employees.length > 0) {
            drawGraph();
        }
    }, [employees]);

    const wrapText = (text, width) => {
        text.each(function() {
            const textElement = d3.select(this);
            const words = textElement.text().split(/\s+/).reverse();
            let word;
            let line = [];
            const lineHeight = 1.1; // ems
            const y = textElement.attr("y");
            const dy = parseFloat(textElement.attr("dy"));
            let tspan = textElement.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", `${dy}em`);
            
            while ((word = words.pop())) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = textElement.append("tspan")
                        .attr("x", 0)
                        .attr("y", y)
                        .attr("dy", `${lineHeight}em`)
                        .text(word);
                }
            }
        });
    };

    const getGravatarUrl = (email, size = 256) => {
        const trimmedEmail = email.trim().toLowerCase() + "@gmail.com";
        const hash = md5(trimmedEmail);
        return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
    };

    const drawGraph = () => {
        const width = 1500;
        const height = 1000;

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)

        // Use D3 stratify to create hierarchy
        const root = d3.stratify()
            .id(d => d.employeeNumber)
            .parentId(d => d.managerId)(employees);

        const treeLayout = d3.tree().size([width - 200, height - 200]);
        const treeData = treeLayout(root);

        svg.selectAll('*').remove();

        const g = svg.append('g').attr('transform', 'translate(100, 50)');

        // eslint-disable-next-line no-unused-vars
        const links = g.selectAll('.link')
            .data(treeData.links())
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        // console.log(treeData.descendants());
        const nodes = g.selectAll('.node')
            .data(treeData.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .on('click', function(event, d) { handleNodeClick(d.data.employeeNumber); })
            .on('mouseover', function(event, d) {
                // Get the current node, parent, and children
                const hoveredNode = d;
                const parentNode = hoveredNode.parent;
                const childrenNodes = hoveredNode.children || [];

                // Apply blur to all nodes except for the hovered node, its parent, and its children
                d3.selectAll('.node')
                    .style('filter', function(node) {
                        // If the node is the hovered node, its parent, or a child, don't apply blur
                        if (node === hoveredNode || node === parentNode || childrenNodes.includes(node)) {
                            return 'none';  // No blur for hovered node, parent, or children
                        } else {
                            return 'blur(5px)';  // Apply blur to all other nodes
                        }
                    })
                    .style('opacity', function(node) {
                        // Maintain full opacity for hovered node, parent, and children
                        if (node === hoveredNode || node === parentNode || childrenNodes.includes(node)) {
                            return 1;
                        } else {
                            return 0.5;  // Lower opacity for blurred nodes
                        }
                    });
            })
            .on('mouseout', function(event, d) {
                // Reset all nodes to normal state when mouse leaves the node
                d3.selectAll('.node')
                    .style('filter', 'none')
                    .style('opacity', 1);
            });

        nodes.append('circle')
            .attr('r', 20)

        nodes.append('image')
            .attr('xlink:href', d => getGravatarUrl(d.data.name + d.data.surname))
            .attr('x', -25) // Center the image
            .attr('y', -25) // Center the image
            .attr('width', 50)
            .attr('height', 50)
            .attr('clip-path', 'circle(25px at 25px 25px)'); // Make it circular

        nodes.append('text')
            .attr('dx', 0) // Center the text horizontally
            .attr('dy', 3) // Position the text below the node
            .text(d => `${d.data.name} ${d.data.surname} (${d.data.employeeNumber})`)
            .call(wrapText, 200); // Optional: Call a function to wrap long text within 100px
    };

    const handleNodeClick = (employeeNumber) => {
        setSelectedEmployeeNumber(employeeNumber);
        setOpenViewModal(true);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedEmployeeNumber(null);
    };

    if (loading) {
        return <div className="graph-loading-text">Loading...</div>;
    }

    return (
        <div className="employee-graph-container">
            <h1>Employee Graph</h1>
            <svg ref={svgRef}></svg>
            {openViewModal && (
                <ViewEmployee
                    employeeNumber={selectedEmployeeNumber}
                    open={openViewModal}
                    handleClose={handleCloseViewModal}
                />
            )}
        </div>
    );
};

export default EmployeeGraph;
