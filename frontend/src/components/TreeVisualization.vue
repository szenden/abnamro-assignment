<template>
    <div class="relative w-full h-full overflow-auto">
      <svg ref="svgRef" width="100%" height="600"></svg>
      
      <!-- Dialog for node details -->
      <div v-if="selectedNode" class="fixed inset-0 flex justify-center items-center z-10">
        <div class="bg-transparent p-5 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm">
          <h2 class="text-xl font-bold text-gray-800 mt-0">{{ selectedNode.name }}</h2>
          <p class="text-gray-600 my-4">{{ selectedNode.description }}</p>
          <button @click="closeDialog" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none">
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import * as d3 from 'd3';
  import type { GraphNode } from "../types";

  
  const props = defineProps<{
    data: GraphNode[]
  }>();
  
  const svgRef = ref<SVGElement | null>(null);
  const selectedNode = ref<GraphNode | null>(null);
  
  const closeDialog = () => {
    selectedNode.value = null;
  };
  
  // This function needs to be accessible in the D3 event handler
  const handleNodeClick = (nodeData: GraphNode) => {
    selectedNode.value = nodeData;
  };
  
  const renderTree = () => {
    if (!svgRef.value || !props.data.length) return;
    
    const svg = d3.select(svgRef.value);
    svg.selectAll('*').remove();
    
    const width = svgRef.value.clientWidth;
    const height = 600;
    const margin = { top: 20, right: 120, bottom: 20, left: 120 };
    
    // Create a hierarchical layout
    const root = d3.hierarchy(props.data[0]);
    
    // Create a tree layout
    const treeLayout = d3.tree<d3.HierarchyNode<GraphNode>>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    
    // Assign the data to the tree layout
    const treeData = treeLayout(root);
    
    // Create a group element for the tree
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add links between nodes
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<GraphNode>, d3.HierarchyPointNode<GraphNode>>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5);
    
    // Add nodes
    const node = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', function(event, d) {
        // Use function() instead of arrow function to maintain proper 'this' context
        event.stopPropagation();
        // Call the Vue method with the node data
        handleNodeClick(d.data);
      });
    
    // Add rectangles for nodes
    node.append('rect')
      .attr('width', 100)
      .attr('height', 50)
      .attr('x', -50)
      .attr('y', -25)
      .attr('rx', 6)
      .attr('ry', 6)
      .attr('fill', 'white')
      .attr('stroke', '#333')
      .attr('stroke-width', 1);
    
    // Add text to nodes
    node.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(d => d.data.name)
      .style('font-size', '14px')
      .style('font-family', 'Arial, sans-serif');
  };
  
  onMounted(() => {
    renderTree();
    
    // Handle window resize
    window.addEventListener('resize', renderTree);
  });
  
  // Clean up event listener when component is unmounted
  onUnmounted(() => {
    window.removeEventListener('resize', renderTree);
  });
  
  watch(() => props.data, renderTree, { deep: true });
  </script>