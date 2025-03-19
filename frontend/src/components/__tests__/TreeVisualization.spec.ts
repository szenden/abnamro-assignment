import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeVisualization from '../TreeVisualization.vue';

// Mock sample data
const mockData = [{
    name: 'A',
    description: 'Root node',
    children: [
      { 
        name: 'B',
        description: 'Child node',
        children: [{ name: 'D', description: 'Leaf node' }]
      },
      { name: 'C', description: 'Child node' }
    ]
  }];

// Improved D3 mock that handles the tree.size() call
vi.mock('d3', () => {
  const mockSelection = {
    remove: vi.fn(),
    data: vi.fn(() => mockSelection),
    enter: vi.fn(() => mockSelection),
    append: vi.fn(() => mockSelection),
    attr: vi.fn(() => mockSelection),
    style: vi.fn(() => mockSelection),
    text: vi.fn(() => mockSelection),
    on: vi.fn(() => mockSelection),
    selectAll: vi.fn(() => mockSelection),
  };

  const mockTreeLayout = vi.fn().mockReturnValue({
    descendants: () => [],
    links: () => []
  });
  mockTreeLayout.size = vi.fn().mockReturnValue(mockTreeLayout);

  return {
    select: vi.fn(() => mockSelection),
    hierarchy: vi.fn(() => ({
      descendants: () => [],
      links: () => []
    })),
    tree: vi.fn(() => mockTreeLayout),
    linkHorizontal: vi.fn(() => ({
      x: vi.fn().mockReturnThis(),
      y: vi.fn().mockReturnThis()
    }))
  };
});

describe('TreeVisualization', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TreeVisualization, {
      props: {
        data: mockData
      },
      attachTo: document.body
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('initializes with no selected node', () => {
    expect(wrapper.vm.selectedNode).toBe(null);
  });

  it('shows dialog when node is selected', async () => {
    await wrapper.vm.handleNodeClick(mockData[0]);
    expect(wrapper.find('.fixed').exists()).toBe(true);
    expect(wrapper.find('h2').text()).toBe('A');
    expect(wrapper.find('p').text()).toBe('Root node');
  });

  it('closes dialog when close button is clicked', async () => {
    await wrapper.vm.handleNodeClick(mockData[0]);
    await wrapper.find('button').trigger('click');
    expect(wrapper.vm.selectedNode).toBe(null);
  });
});