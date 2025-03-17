<script setup lang="ts">
import HierarchyChart from "../components/HierarchyChart.vue";
</script>

<template>
  <div class="about">
    <h1>Graph Hierarchy</h1>
    <HierarchyChart />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
