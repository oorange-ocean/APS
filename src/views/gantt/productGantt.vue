<template>
    <div class="gantt-chart-container" v-loading="loading">
        <GanttToolbar
            v-model:timeUnit="timeUnit"
            v-model:subTimeUnit="subTimeUnit"
            v-model:dateRangeList="dateRangeList"
            v-model:materialCodes="materialCodes"
            v-model:step="step"
        />
        <Gantt
            v-if="ganttData.length > 0"
            :data="ganttData"
            itemText="物料"
            dateText="日期"
            :dateRangeList="dateRangeList"
            :timeUnit="timeUnit"
            :subTimeUnit="subTimeUnit"
            :step="step"
        />
        <div v-else>暂无数据</div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Gantt from '@/components/customGantt.vue'
import { transformData2 } from '@/utils/gantt'
import useGtt from '@/store/modules/gtt'
import GanttToolbar from './GanttToolbar.vue'

const timeUnit = ref('month')
const subTimeUnit = ref('day')
const gtt = useGtt()
const ganttData = ref([])
const dateRangeList = ref([])
const step = ref(1)
const loading = ref(false)
const materialCodes = ref([]) // 新增：用于存储物料编码

onMounted(async () => {
    await updateGanttData()
})

watch([timeUnit, subTimeUnit, dateRangeList, materialCodes, step], async () => {
    // console.log('更新后的dateRangeList', dateRangeList.value)
    // console.log('更新后的materialCodes', materialCodes.value)
    // console.log('更新后的step', step.value)
    await updateGanttData()
})
async function updateGanttData() {
    loading.value = true
    try {
        const backendData = await gtt.getProductGanttData(materialCodes.value)
        ganttData.value = transformData2(
            backendData,
            timeUnit.value,
            subTimeUnit.value,
            step.value
        )
        // console.log(ganttData.value)
    } catch (error) {
        console.error('更新甘特图数据时出错：', error)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.gantt-chart-container {
    width: 100%;
    height: 100%;
}
</style>
