import { ref, onMounted, onUnmounted, computed, toRef } from 'vue';
import { storeToRefs } from 'pinia';
import useProductionPlanStore  from '@/store/modules/productionPlan'; 
import useUserStore from '@/store/modules/user';

export function useVirtualScroll(options = {}) {
  const {
    itemHeight = 40,
    bufferSize = 5,
    //tableId, currentViewId都是参数
    currentViewId,
    // tableId,
    // localCurrentOption

  } = options;

  const productionPlanStore = useProductionPlanStore();
  const { productPlan } = storeToRefs(productionPlanStore);
  const { data, total } = productPlan.value;
  
  const {pageSize} = useUserStore();
  const containerRef = ref(null);
  const listRef = ref(null);
  const visibleItems = ref([]);
  const startIndex = ref(0);
  const endIndex = ref(0);
  const scrollTop = ref(0);
  const containerHeight = ref(0);

  const visibleCount = computed(() => Math.ceil(containerHeight.value / itemHeight) + bufferSize * 2);

  const updateVisibleItems = () => {
    // const start = Math.floor(scrollTop.value / itemHeight) - bufferSize;
    // const end = start + visibleCount.value;

    // startIndex.value = Math.max(0, start);
    // endIndex.value = Math.min(data.value.length, end);

    // visibleItems.value = data.value.slice(startIndex.value, endIndex.value);
    console.log("data",productPlan.value.data)
    visibleItems.value = productPlan.value.data.slice(0,9)
    console.log("visibleItems",visibleItems)
  };

  const onScroll = () => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop;
      updateVisibleItems();
    }
  };

  const loadMoreItems = async () => {
    // const params = {
    //   tableId: tableId.value,
    //   viewId: currentViewId.value,
    //   cols: productionPlanStore.currentOrder ? [productionPlanStore.currentOrder] : []
    // viewId:-1
    // };

    // if (localCurrentOption) {
    //   params.cols.push(localCurrentOption);
    // }

    // await productionPlanStore.getProductionFiltrate(
    // //   params,
    // //   page: Math.floor(data.length / pageSize.value) + 1,
    // //   size: pageSize.value
    // {
    //     viewId:-1
    // },
    // 1,
    // 1500
    // );

    updateVisibleItems();
  };

  onMounted(() => {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight;
      containerRef.value.addEventListener('scroll', onScroll);
    }
    loadMoreItems();
  });

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', onScroll);
    }
  });

//   const totalHeight = computed(() => total.value * itemHeight);
const totalHeight = 100
  const offsetY = computed(() => startIndex.value * itemHeight);

  return {
    containerRef,
    listRef,
    visibleItems,
    totalHeight,
    offsetY,
    loadMoreItems,
  };
}