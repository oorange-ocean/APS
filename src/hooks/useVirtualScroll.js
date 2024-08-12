import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

export function useVirtualScroll(options = {}) {
  const {
    itemHeight = 23,
    bufferSize = 5,
    debounceTime = 16 // 新增: 防抖时间
  } = options

  const tableRef = ref(null)
  const listData = ref([])
  const visibleData = ref([])
  const startIndex = ref(0)
  const scrollTop = ref(0)
  const viewportHeight = ref(0)

  const totalHeight = computed(() => listData.value.length * itemHeight)
  const visibleCount = computed(() => Math.ceil(viewportHeight.value / itemHeight))
  const endIndex = computed(() => Math.min(listData.value.length, startIndex.value + visibleCount.value + bufferSize))
  const paddingBottom = computed(() => (listData.value.length - endIndex.value) * itemHeight)
  const paddingTop = computed(() => startIndex.value * itemHeight)

  // 优化1: 使用 requestAnimationFrame 进行防抖
  let rafId = null
  const debouncedUpdateVisibleData = () => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      const start = Math.floor(scrollTop.value / itemHeight) - bufferSize
      startIndex.value = Math.max(0, start)
      visibleData.value = listData.value.slice(startIndex.value, endIndex.value)
      updateTableStyle()
    })
  }

  // 优化2: 使用事件委托和被动事件监听
  const onScroll = (e) => {
    scrollTop.value = e.target.scrollTop
    debouncedUpdateVisibleData()
  }

  // 优化3: 缓存 DOM 查询结果
  let scrollWrapper = null
  let tableElement = null

  const updateTableStyle = () => {
    if (tableElement) {
      tableElement.style.paddingBottom = `${paddingBottom.value}px`
      tableElement.style.paddingTop = `${paddingTop.value}px`
    }
  }

  onMounted(() => {
    nextTick(() => {
      if (tableRef.value) {
        scrollWrapper = tableRef.value.$el.querySelector('.el-scrollbar__wrap')
        if (scrollWrapper) {
          scrollWrapper.addEventListener('scroll', onScroll, { passive: true })
          viewportHeight.value = scrollWrapper.clientHeight
          tableElement = scrollWrapper.querySelector("table")
          debouncedUpdateVisibleData()
        }
      }
    })
  })

  onUnmounted(() => {
    if (scrollWrapper) {
      scrollWrapper.removeEventListener('scroll', onScroll)
    }
    cancelAnimationFrame(rafId)
  })

  // 优化4: 减少不必要的更新
  watch(() => listData.value.length, () => {
    debouncedUpdateVisibleData()
  })

  const updateViewportHeight = (height) => {
    if (!isNaN(height) && height !== viewportHeight.value) {
      viewportHeight.value = height
      debouncedUpdateVisibleData()
    }
  }

  return {
    tableRef,
    visibleData,
    totalHeight,
    startIndex,
    itemHeight,
    listData,
    updateViewportHeight,
    paddingBottom,
    paddingTop,
    setListData: (data) => {
      listData.value = data
      debouncedUpdateVisibleData()
    }
  }
}