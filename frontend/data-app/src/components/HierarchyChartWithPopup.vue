<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import axios from "axios";
import type { GraphNode } from "../types";

const data = ref<GraphNode | null>(null);
const selectedNode = ref<GraphNode | null>(null); // Store selected node
  const showPopup = ref(false);

const fetchGraphData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/graph/nodes", {
      headers: { Authorization: "Bearer your_secure_token" },
    });
    data.value = response.data.data[0]; // Assuming "A" is the root
    drawChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const drawChart = () => {
  if (!data.value) return;

  const width = 800, height = 500;
  const rectWidth = 100, rectHeight = 40;

  // Remove previous SVG (to prevent duplicates)
  d3.select("#chart").selectAll("svg").remove();

  // Create SVG container
  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(50,50)");

  // Convert data to D3 hierarchy
  const root = d3.hierarchy(data.value);
  const treeLayout = d3.tree<GraphNode>().size([height - 100, width - 200]); // Left-to-right layout
  treeLayout(root);

  // Generate links (lines connecting nodes)
  svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("x1", d => d.source.y + rectWidth / 2)
    .attr("y1", d => d.source.x)
    .attr("x2", d => d.target.y - rectWidth / 2)
    .attr("y2", d => d.target.x)
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

  // Generate nodes (rectangles instead of circles)
  const nodes = svg.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.y},${d.x})`)
    .on("click", (_, d) => {
      selectedNode.value = d.data; 
      showPopup.value = true;
    });

  nodes.append("rect")
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("x", -rectWidth / 2)
    .attr("y", -rectHeight / 2)
    .attr("fill", d => (d.data.name === selectedNode.value?.name ? "red" : "#007bff")) // Highlight selected node
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("rx", 5); // Rounded corners

  nodes.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#fff")
    .text(d => d.data.name);
};

// Close popup function
const closePopup = () => {
  showPopup.value = false;
  selectedNode.value = null;
};

onMounted(fetchGraphData);
</script>

<template>
  <!-- <div id="chart"></div> -->
  <div class="container">
    <!-- Popup for selected node details -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h2>{{ selectedNode?.name }}</h2>
        <p>{{ selectedNode?.description }}</p>
        <button @click="closePopup">Close</button>
      </div>
    </div>

    <!-- Chart area -->
    <div id="chart"></div>
  </div>

</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#chart {
  width: 100%;
  height: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Popup styles */
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
}

.popup-content {
  text-align: center;
}

.popup button {
  margin-top: 10px;
  padding: 8px 16px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.popup button:hover {
  background: #0056b3;
}
</style>