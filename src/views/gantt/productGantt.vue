<template>
    <div class="gantt-chart-container">
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
import { ref, onMounted, onUnmounted, onActivated, reactive } from 'vue'
import Gantt from '@/components/customGantt.vue'
import { transformData2, getDateRangeList } from '@/utils/gantt'
import useGtt from '@/store/modules/gtt'

const timeUnit = ref('month')
const subTimeUnit = ref('day')
const gtt = useGtt()
const ganttData = ref([])
const dateRangeList = ref([])
const step = ref(1)

onMounted(async () => {
    const backendData = await gtt.getProductGanttData()
    ganttData.value = transformData2(
        backendData,
        timeUnit.value,
        subTimeUnit.value,
        step.value
    )
    console.log(ganttData.value)
    dateRangeList.value = getDateRangeList(ganttData.value)
})
</script>

<style scoped>
.gantt-chart-container {
    width: 100%;
    height: 100%;
}
</style>
