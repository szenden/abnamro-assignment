<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from "axios";
import TreeVisualization from './components/TreeVisualization.vue'


//fetch data from the backend api
const treeData = ref<[]>([]);
const fetchGraphData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/graph/nodes`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}` },
    });
    treeData.value = response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Mount the component
onMounted(fetchGraphData);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Graph Hierarchy</h1>
    <TreeVisualization :data="treeData" />
  </div>

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
