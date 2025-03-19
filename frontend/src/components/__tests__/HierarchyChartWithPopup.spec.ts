import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HierarchyChartWithPopup from '../HierarchyChartWithPopup.vue'
import axios from 'axios'
import * as d3 from 'd3'

// Mock axios
vi.mock('axios')

// Mock D3 select
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
          append: vi.fn().mockReturnThis(),
        }),
      }),
    }),
  }
})

describe('HierarchyChartWithPopup.vue', () => {
  const mockGraphData = {
    data: [{
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
    }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(axios.get as any).mockResolvedValue({ data: mockGraphData })
  })

  it('renders the component', () => {
    const wrapper = mount(HierarchyChartWithPopup)
    expect(wrapper.find('#chart').exists()).toBe(true)
  })

  it('fetches data on mount', async () => {
    const wrapper = mount(HierarchyChartWithPopup)
    await wrapper.vm.$nextTick()
    
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/graph/nodes',
      {
        headers: { Authorization: 'Bearer your_secure_token' }
      }
    )
  })

  it('shows popup when node is selected', async () => {
    const wrapper = mount(HierarchyChartWithPopup)
    await wrapper.vm.$nextTick()

    // Ensure selectedNode is initialized to a default value (mock its initialization)
    const mockNode = { name: 'Test Node', description: 'Test Description' }
    wrapper.vm.selectedNode = mockNode
    wrapper.vm.showPopup = true

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.popup').exists()).toBe(true)
    expect(wrapper.find('.popup').text()).toContain('Test Node')
  })

  it('closes popup when close button is clicked', async () => {
    const wrapper = mount(HierarchyChartWithPopup)
    await wrapper.vm.$nextTick()

    // First show the popup
    const mockNode = { name: 'Test Node', description: 'Test Description' }
    wrapper.vm.selectedNode = mockNode
    wrapper.vm.showPopup = true

    await wrapper.vm.$nextTick()

    // Click close button
    await wrapper.find('.popup button').trigger('click')

    expect(wrapper.find('.popup').exists()).toBe(false)
  })

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error')
    ;(axios.get as any).mockRejectedValue(new Error('API Error'))

    const wrapper = mount(HierarchyChartWithPopup)
    await wrapper.vm.$nextTick()

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error))
  })

  it('updates selected node styling', async () => {
    const wrapper = mount(HierarchyChartWithPopup)
    await wrapper.vm.$nextTick()

    const testNode = mockGraphData.data[0].children[0]
    wrapper.vm.selectedNode = testNode
    wrapper.vm.showPopup = true
    // await wrapper.setData({
    //   selectedNode: testNode,
    //   showPopup: true
    // })

    // Verify that D3 was called to update the styling
    expect(d3.select).toHaveBeenCalled()
  })
}) 