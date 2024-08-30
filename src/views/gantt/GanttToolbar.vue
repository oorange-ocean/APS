<template>
    <div class="gantt-toolbar">
        <el-button @click="moveLeft" :icon="ArrowLeft" />
        <el-select
            v-model="selectedTimeRange"
            @change="handleTimeRangeChange"
            style="width: 70px"
        >
            <el-option label="周" value="week" />
            <el-option label="月" value="month" default />
        </el-select>
        <el-button @click="moveRight" :icon="ArrowRight" />
        <el-autocomplete
            v-model="materialSearch"
            :fetch-suggestions="getProductGanttDetailMaterialCodeLike"
            placeholder="搜索物料"
            @select="handleMaterialSelect"
            style="width: 150px"
        >
            <template #default="{ item }">
                <div class="material-item">
                    <span>{{ item.fmaterialName }}</span>
                    <span class="material-id">{{ item.fmaterialId }}</span>
                </div>
            </template>
        </el-autocomplete>
        <!-- <div class="step-counter">
            <span>步长：</span>
            <el-input-number
                :model-value="step"
                :min="1"
                :max="maxStep"
                @update:model-value="handleStepChange"
            />
            <span>{{ stepUnit }}</span>
        </div> -->
        <el-button @click="handleBack" icon="ArrowLeft" v-show="showBackButton"
            >返回</el-button
        >
    </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { ElButton, ElSelect, ElOption, ElAutocomplete } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { getProductGanttDetailMaterialCodeLike } from '@/utils/autocomplete'
import {
    addWeeks,
    addMonths,
    startOfWeek,
    endOfWeek,
    addDays,
    format,
    eachDayOfInterval
} from 'date-fns'

const props = defineProps({
    timeUnit: String,
    subTimeUnit: String,
    dateRangeList: Array,
    materialCodes: Array,
    step: Number
})

const emit = defineEmits([
    'update:timeUnit',
    'update:subTimeUnit',
    'update:dateRangeList',
    'update:materialCodes',
    'update:step'
])

const selectedTimeRange = ref('month')
const currentDate = ref(new Date())
const materialSearch = ref('')
const selectedMaterials = ref([])
const showBackButton = ref(false)

watch(
    () => props.timeUnit,
    (newValue) => {
        if (newValue === 'day') {
            selectedTimeRange.value = 'week'
        } else if (newValue === 'month') {
            selectedTimeRange.value = 'month'
        }
    }
)

const maxStep = computed(() => {
    switch (props.subTimeUnit) {
        case 'hour':
            return 24
        case 'day':
            return 30
        case 'week':
            return 4
        case 'month':
            return 12
        default:
            return 24
    }
})

const stepUnit = computed(() => {
    switch (props.subTimeUnit) {
        case 'hour':
            return '小时'
        case 'day':
            return '天'
        case 'week':
            return '周'
        case 'month':
            return '月'
        default:
            return '小时'
    }
})

const handleStepChange = (value) => {
    emit('update:step', value)
}

const handleTimeRangeChange = (value) => {
    if (value === 'week') {
        emit('update:timeUnit', 'day')
        emit('update:subTimeUnit', 'hour')
    } else if (value === 'month') {
        emit('update:timeUnit', 'month')
        emit('update:subTimeUnit', 'day')
    }
    updateDateRange()
}

const handleMaterialSelect = (item) => {
    console.log('选中的物料', item)
    if (
        !selectedMaterials.value.some((m) => m.fmaterialId === item.fmaterialId)
    ) {
        console.log('合法')
        selectedMaterials.value.push(item)
        console.log('更新selectedMaterials', selectedMaterials.value)
        console.log(selectedMaterials.value.map((m) => m.fmaterialId))
        emit('update:materialCodes', [item.fmaterialId])
    }
    materialSearch.value = ''
    showBackButton.value = true
}

const handleBack = () => {
    showBackButton.value = false
    materialSearch.value = ''
    selectedMaterials.value = [] // 清空选中的物料
    emit('update:materialCodes', []) // 更新父组件中的materialCodes
}

const updateDateRange = () => {
    let start, end, dateRange
    if (selectedTimeRange.value === 'week') {
        start = currentDate.value
        end = addDays(start, 7)
        dateRange = eachDayOfInterval({ start, end })
    } else {
        start = currentDate.value
        end = addDays(start, 30)
        dateRange = eachDayOfInterval({ start, end })
    }

    emit(
        'update:dateRangeList',
        dateRange.map((date) => format(date, 'yyyy-MM-dd'))
    )
}

const moveLeft = () => {
    currentDate.value =
        selectedTimeRange.value === 'week'
            ? addWeeks(currentDate.value, -1)
            : addMonths(currentDate.value, -1)
    updateDateRange()
}

const moveRight = () => {
    currentDate.value =
        selectedTimeRange.value === 'week'
            ? addWeeks(currentDate.value, 1)
            : addMonths(currentDate.value, 1)
    updateDateRange()
}

// 初始化日期范围
onMounted(() => {
    updateDateRange()
})
</script>

<style scoped>
.gantt-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

.material-item {
    display: flex;
    justify-content: space-between;
}

.material-id {
    color: #999;
    font-size: 0.9em;
}

.step-counter {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>
