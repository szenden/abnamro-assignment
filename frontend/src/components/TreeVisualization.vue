<template>
    <div class="relative w-full h-full overflow-auto">
              <!-- Tailwind Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Background overlay -->
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            @click="closeModal"
          ></div>
  
          <!-- Modal panel -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div 
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            @click.stop
          >
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {{ selectedNode?.name }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ selectedNode?.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="button" 
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <svg ref="svgRef" width="100%" height="600"></svg>
      

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, watch, onUnmounted } from 'vue';
  import * as d3 from 'd3';
  
  interface TreeNode {
    name: string;
    description: string;
    children: TreeNode[];
  }
  
  const props = defineProps<{
    data: TreeNode[]
  }>();
  
  const svgRef = ref<SVGElement | null>(null);
  const selectedNode = ref<TreeNode | null>(null);
  const isModalOpen = ref(false);
  
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  const handleNodeClick = (nodeData: TreeNode) => {
    selectedNode.value = nodeData;
    isModalOpen.value = true;
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
    const treeLayout = d3.tree<d3.HierarchyNode<TreeNode>>()
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
      .attr('d', d3.linkHorizontal<d3.HierarchyPointLink<TreeNode>, d3.HierarchyPointNode<TreeNode>>()
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
        event.stopPropagation();
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
  
  // Handle keyboard events for accessibility
  const handleKeyDown = (event: KeyboardEvent) => {
    if (isModalOpen.value && event.key === 'Escape') {
      closeModal();
    }
  };
  
  onMounted(() => {
    renderTree();
    
    // Handle window resize
    window.addEventListener('resize', renderTree);
    // Add keyboard event listener for accessibility
    window.addEventListener('keydown', handleKeyDown);
  });
  
  // Clean up event listeners when component is unmounted
  onUnmounted(() => {
    window.removeEventListener('resize', renderTree);
    window.removeEventListener('keydown', handleKeyDown);
  });
  
  watch(() => props.data, renderTree, { deep: true });
  </script>