<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import axios from "axios";
import type { GraphNode } from "../types";

//variables
const data = ref<GraphNode | null>(null);
const selectedNode = ref<GraphNode | null>(null);
const showPopup = ref(false);

//fetch data from the backend api
const fetchGraphData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/graph/nodes`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` },
    });
    data.value = response.data.data[0];
    drawChart();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

//draw the chart
const drawChart = () => {
  if (!data.value) return;

  const width = 900, height = 500;
  const rectWidth = 120, rectHeight = 50;

  d3.select("#chart").selectAll("svg").remove();

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(70,50)");

  const root = d3.hierarchy(data.value);
  const treeLayout = d3.tree<GraphNode>().size([height - 100, width - 200]);
  treeLayout(root);

  // Draw links
  svg.selectAll(".link")
    .data(root.links())
    .enter()
    .append("line")
    .attr("class", "stroke-gray-400")
    .attr("x1", d => d.source.y + rectWidth / 2)
    .attr("y1", d => d.source.x)
    .attr("x2", d => d.target.y - rectWidth / 2)
    .attr("y2", d => d.target.x)
    .attr("stroke", "#999")
    .attr("stroke-width", 2);

  // Draw nodes
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
    .attr("fill", d => (d.data.name === selectedNode.value?.name ? "#fff" : "#007bff")) 
    .attr("class", "fill-gray-800 hover:fill-blue-500 transition duration-300 cursor-pointer")
    .attr("stroke", "#333")
    .attr("stroke-width", 2)
    .attr("rx", 6);

  nodes.append("text")
    .attr("dy", 5)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#fff")
    .attr("class", "fill-white font-semibold text-sm")
    .text(d => d.data.name);
};

//close popup function
const closePopup = () => {
  showPopup.value = false;
  selectedNode.value = null;
};

// Mount the component
onMounted(fetchGraphData);
</script>

<template>
  
   <!-- Popup -->
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 popup">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center w-80">
        <h2 class="text-lg font-bold text-gray-800">{{ selectedNode?.name }}</h2>
        <p class="text-gray-600 mt-2">{{ selectedNode?.description }}</p>
        <button @click="closePopup" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Close</button>
      </div>
    </div>
    
     <!-- Chart Container -->
    <div id="chart" class="bg-white shadow-lg p-6 rounded-lg"></div>
  </div>

</template>

<style scoped>
/* .container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
} */

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