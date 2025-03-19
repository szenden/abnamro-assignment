import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HierarchyChart from '../HierarchyChart.vue'
import axios from 'axios'
import * as d3 from 'd3'

// Mock axios
vi.mock('axios')

// Mock D3 select to avoid DOM manipulation
vi.mock('d3', async () => {
  const actual = await vi.importActual('d3')
  return {
    ...actual as object,
    select: vi.fn().mockReturnValue({
      selectAll: vi.fn().mockReturnValue({
        remove: vi.fn(),
      }),
      append: vi.fn().mockReturnValue({
        attr: vi.fn().mockReturnValue({
          append: vi.fn().mockReturnValue({
            attr: vi.fn().mockReturnThis(),
          }),
        }),
      }),
    }),
  }
})

describe('HierarchyChart.vue', () => {
  const mockGraphData = {
    data: [{
      name: 'A',
      children: [
        { 
          name: 'B',
          children: [{ name: 'D' }]
        },
        { name: 'C' }
      ]
    }]
  }

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    // Setup axios mock response
    ;(axios.get as any).mockResolvedValue({ data: mockGraphData })
  })

  it('renders the component', () => {
    const wrapper = mount(HierarchyChart)
    expect(wrapper.find('#chart').exists()).toBe(true)
  })

  it('fetches data on mount', async () => {
    const wrapper = mount(HierarchyChart)
    await wrapper.vm.$nextTick()
    
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/graph/nodes',
      {
        headers: { Authorization: 'Bearer your_secure_token' }
      }
    )
  })

  it('shows sidebar when node is selected', async () => {
    const wrapper = mount(HierarchyChart)
    await wrapper.vm.$nextTick()

    // Ensure selectedNode is initialized to a default value (mock its initialization)
    wrapper.vm.selectedNode = { name: 'Test Node', description: 'Test Description' }

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.sidebar').exists()).toBe(true)
    expect(wrapper.find('.sidebar').text()).toContain('Test Node')
  })

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    ;(axios.get as any).mockRejectedValue(new Error('API Error'))

    const wrapper = mount(HierarchyChart)
    await wrapper.vm.$nextTick()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error))
  })
}) 