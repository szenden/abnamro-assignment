<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as d3 from 'd3'
import axios from 'axios'
import type { GraphNode } from '../types'

//variables
const data = ref<GraphNode | null>(null)
const selectedNode = ref<GraphNode | null>(null)

//fetch data from the backend api
const fetchGraphData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/graph/nodes`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` },
    })
    data.value = response.data.data[0]
    drawChart()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

//draw the tree chart
const drawChart = () => {
  if (!data.value) return

  const width = 900,
    height = 700

  // Remove previous SVG (to prevent duplicates)
  d3.select('#chart').selectAll('svg').remove()

  // Create SVG container
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(50,50)')

  // Convert data to D3 hierarchy
  const root = d3.hierarchy(data.value)
  const treeLayout = d3.tree<GraphNode>().size([width - 100, height - 150])
  treeLayout(root)

  // Generate links
  const linkGenerator = d3
    .linkHorizontal()
    .x((d) => d.y)
    .y((d) => d.x)

  svg
    .selectAll('.link')
    .data(root.links())
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill', 'none')
    .attr('stroke', '#999')
    .attr('stroke-width', 2)
    .attr('d', (d) =>
      linkGenerator({ source: [d.source.y, d.source.x], target: [d.target.y, d.target.x] }),
    )

  // Generate nodes
  const nodes = svg
    .selectAll('.node')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.y},${d.x})`)
    .on('click', (_, d) => {
      selectedNode.value = d.data // Set selected node
    })

  nodes
    .append('circle')
    .attr('r', 6)
    .attr('fill', (d) => (d.data.name === selectedNode.value?.name ? 'red' : '#007bff')) // Highlight selected node
    .attr('stroke', '#333')
    .attr('stroke-width', 2)

  nodes
    .append('text')
    .attr('dy', 3)
    .attr('x', (d) => (d.children ? -10 : 10))
    .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
    .attr('font-size', '12px')
    .text((d) => d.data.name)
}

onMounted(fetchGraphData)
</script>

<template>
  <div class="container">
    <!-- Sidebar for selected node details -->
    <div class="sidebar" v-if="selectedNode">
      <h2>{{ selectedNode.name }}</h2>
      <p>{{ selectedNode.description }}</p>
    </div>

    <!-- Chart area -->
    <div id="chart"></div>
  </div>
</template>

<style scoped>
/* #chart {
    width: 100%;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
    } */
.container {
  display: flex;
}

#chart {
  width: 70%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar {
  width: 30%;
  padding: 20px;
  background: #f4f4f4;
  border-left: 2px solid #ccc;
}
</style>
