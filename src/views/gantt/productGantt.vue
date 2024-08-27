<template>
    <div class="gantt-chart-container">
        <Gantt
            v-if="ganttData.length > 0"
            :data="ganttData"
            itemText="物料"
            dateText="日期"
            :dateRangeList="dateRangeList"
        />
        <div v-else>暂无数据</div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, reactive } from 'vue'
import Gantt from '@/components/customGantt.vue'
import { transformData2, getDateRangeList } from '@/utils/gantt'
import useGtt from '@/store/modules/gtt'
import { get } from 'lodash'

const gtt = useGtt()
const ganttData = ref([])
const dateRangeList = ref([])

onMounted(async () => {
    const backendData = await gtt.getProductGanttData()
    ganttData.value = transformData2(backendData)
    console.log(ganttData.value)
    dateRangeList.value = getDateRangeList(ganttData.value)
    console.log(dateRangeList.value)
})
</script>

<style scoped>
.gantt-chart-container {
    width: 100%;
    height: 100%;
}
</style>
