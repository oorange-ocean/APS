<template>
    <div class="gantt-toolbar">
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="开始日期">
                <el-date-picker v-model="gantt.config.start_date" type="date" placeholder="选择开始日期" @change="updateGantt"
                    class="date-picker" />
            </el-form-item>
            <el-form-item label="结束日期">
                <el-date-picker v-model="gantt.config.end_date" type="date" placeholder="选择结束日期" @change="updateGantt"
                    class="date-picker" />
            </el-form-item>
            <el-form-item label="快速选择">
                <el-select v-model="quickSelect" placeholder="请选择" @change="handleQuickSelect" class="quick-select">
                    <el-option label="本日" value="today" />
                    <el-option label="本周" value="thisWeek" />
                    <el-option label="本月" value="thisMonth" />
                    <el-option label="下月" value="nextMonth" />
                </el-select>
            </el-form-item>
            <el-form-item label="时间尺度">
                <el-select v-model="timeScale" placeholder="请选择" @change="updateTimeScale" class="time-scale">
                    <el-option label="小时" value="hour" />
                    <el-option label="日" value="day" />
                    <el-option label="周" value="week" />
                    <el-option label="月" value="month" />
                </el-select>
            </el-form-item>
            <el-form-item label="步长">
                <el-input-number v-model="timeStep" :min="1" :max="getMaxStep()" @change="updateTimeScale"
                    class="time-step" />
            </el-form-item>
            <el-form-item v-if="showReturnButton">
                <el-button @click="handleReturn" type="primary">返回产品甘特图</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { ElForm, ElFormItem, ElDatePicker, ElSelect, ElOption, ElButton } from 'element-plus';
import { gantt } from 'dhtmlx-gantt';
// 定义 props
const props = defineProps({
    showReturnButton: Boolean
});

// 定义 emits
const emit = defineEmits(['return']);
const handleReturn = () => {
    emit('return');
};
const quickSelect = ref('');
const timeScale = ref('day');
const timeStep = ref(1);
const startDate = ref(null);
const endDate = ref(null);

const getMaxStep = () => {
    switch (timeScale.value) {
        case 'hour': return 24;
        case 'day': return 7;
        case 'week': return 4;
        case 'month': return 12;
        default: return 24;
    }
};

const handleQuickSelect = () => {
    const now = new Date();
    switch (quickSelect.value) {
        case 'today':
            startDate.value = new Date(now.setHours(0, 0, 0, 0));
            endDate.value = new Date(now.setHours(23, 59, 59, 999));
            timeScale.value = 'hour';
            break;
        case 'thisWeek':
            startDate.value = new Date(now.setDate(now.getDate() - now.getDay()));
            endDate.value = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            timeScale.value = 'day';
            break;
        case 'thisMonth':
            startDate.value = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate.value = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            timeScale.value = timeScale.value === 'hour' ? 'day' : timeScale.value;
            break;
        case 'nextMonth':
            startDate.value = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            endDate.value = new Date(now.getFullYear(), now.getMonth() + 2, 0);
            timeScale.value = timeScale.value === 'hour' ? 'day' : timeScale.value;
            break;
    }
    // 更新甘特图配置
    gantt.config.start_date = startDate.value;
    gantt.config.end_date = endDate.value;

    updateTimeScale();
    gantt.render();
};

const updateTimeScale = () => {
    let scales;

    switch (timeScale.value) {
        case 'hour':
            scales = [
                { unit: "day", step: 1, format: "%M%d日" },
                { unit: "hour", step: timeStep.value, format: "%H时" }
            ];
            gantt.config.duration_unit = "hour";
            break;
        case 'day':
            scales = [
                { unit: "month", step: 1, format: "%Y年%M" },
                { unit: "day", step: timeStep.value, format: "%d日" }
            ];
            gantt.config.duration_unit = "day";
            break;
        case 'week':
            scales = [
                { unit: "month", step: 1, format: "%Y年%M" },
                { unit: "week", step: timeStep.value, format: "第%W周" }
            ];
            gantt.config.duration_unit = "week";
            break;
        case 'month':
            scales = [
                { unit: "year", step: 1, format: "%Y年" },
                { unit: "month", step: timeStep.value, format: "%M" }
            ];
            gantt.config.duration_unit = "month";
            break;
    }

    // 确保步长不超过最大值
    const maxStep = getMaxStep();
    if (timeStep.value > maxStep) {
        timeStep.value = maxStep;
    }

    gantt.config.duration_step = timeStep.value;
    gantt.config.scales = scales;
    gantt.render();
};

// 监听 timeScale 的变化，重置 timeStep
watch(timeScale, () => {
    timeStep.value = 1;
    updateTimeScale();
});

// 初始化时同步甘特图配置
onMounted(() => {
    // 根据甘特图的初始配置设置 timeScale 和 timeStep
    const currentScale = gantt.config.scales[1];
    if (currentScale) {
        switch (currentScale.unit) {
            case 'hour':
                timeScale.value = 'hour';
                break;
            case 'day':
                timeScale.value = 'day';
                break;
            case 'week':
                timeScale.value = 'week';
                break;
            case 'month':
                timeScale.value = 'month';
                break;
        }
        timeStep.value = currentScale.step || 1;
    }
    updateTimeScale();
});

</script>

<style scoped>
.gantt-toolbar {
    margin-top: 20px;
    margin-left: 20px;
}

.date-picker {
    width: 130px;
}

.quick-select,
.time-scale {
    width: 100px;
}

.time-step {
    width: 80px;
}
</style>