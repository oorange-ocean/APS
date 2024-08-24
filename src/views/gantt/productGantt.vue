<template>
    <div class="gantt-chart-container">
        <div ref="ganttContainer" class="gantt-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import useGtt from '@/store/modules/gtt';

const gtt = useGtt();
const ganttContainer = ref(null);

onMounted(async () => {
    await initGantt();
});

onUnmounted(() => {
    gantt.destructor();
});

async function initGantt() {
    console.log('初始化甘特图');
    const data = await gtt.getProductGanttData();
    console.log('原始数据:', data);
    const tasks = processData(data);
    console.log('处理后的任务数据:', tasks);

    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.scale_height = 50;
    gantt.config.row_height = 30;
    gantt.config.task_height = 20;

    gantt.config.columns = [
        { name: "text", label: "物料", tree: true, width: 200 },
        { name: "start_date", label: "开始时间", align: "center", width: 100 },
        { name: "end_date", label: "结束时间", align: "center", width: 100 },
    ];

    gantt.plugins({
        tooltip: true
    });

    gantt.templates.tooltip_text = function (start, end, task) {
        function formatDate(date) {
            return date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0') + ':' +
                String(date.getSeconds()).padStart(2, '0');
        }

        if (task.materialCode && task.materialName) {
            // 物料级别
            return `
            <div>物料编码: ${task.materialCode}</div>
            <div>物料名称: ${task.materialName}</div>
            <div>开始时间: ${formatDate(start)}</div>
            <div>结束时间: ${formatDate(end)}</div>
        `;
        } else if (task.ftaskSourceId) {
            // 项目级别
            return `
            <div>单据编号: ${task.ftaskSourceId}</div>
            <div>单据类型: ${task.fpriority}</div>
            <div>开始时间: ${formatDate(start)}</div>
            <div>结束时间: ${formatDate(end)}</div>
            <div>满足订单状态: ${task.fdelayDays > 0 ? '满足' : '不满足'}</div>
            <div>延迟交付FIM号: ${task.frelatedOrders}</div>
        `;
        } else {
            // 具体任务级别
            return `
            <div>工序名称: ${task.processName}</div>
            <div>开始时间: ${formatDate(start)}</div>
            <div>结束时间: ${formatDate(end)}</div>
            <div>数量: ${task.fcompletedQuantity ? task.fcompletedQuantity[task.type] : 'N/A'}</div>
            <div>总工时: ${((end - start) / (60 * 60 * 1000)).toFixed(2)} 小时</div>
        `;
        }
    };

    gantt.init(ganttContainer.value);
    console.log('甘特图初始化完成');

    gantt.parse({ data: tasks });
    console.log('数据已加载到甘特图');

    // 添加右侧的行高调整功能
    gantt.config.layout = {
        css: "gantt_container",
        rows: [
            {
                cols: [
                    { view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" },
                    { resizer: true, width: 1 },
                    { view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
                    { view: "scrollbar", id: "scrollVer", group: "vertical" }
                ]
            },
            { view: "scrollbar", id: "scrollHor", group: "horizontal" }
        ]
    };
}

function processData(data) {
    const tasks = [];
    let id = 1;

    data.forEach(item => {
        const materialTask = {
            id: id++,
            text: `${item.materialCode} - ${item.materialName}`,
            start_date: null,
            end_date: null,
            materialCode: item.materialCode,
            materialName: item.materialName,
            open: true,
        };
        tasks.push(materialTask);

        item.processGanttDataList.forEach(process => {
            const processTask = {
                id: id++,
                parent: materialTask.id,
                text: `项目: ${process.ftaskSourceId}`,
                start_date: null,
                end_date: null,
                ftaskSourceId: process.ftaskSourceId,
                fpriority: process.fpriority,
                fdelayDays: process.fdelayDays,
                frelatedOrders: process.frelatedOrders,
                open: true,
            };
            tasks.push(processTask);

            process.processBaseDataList.forEach((baseData, index) => {
                const task = {
                    id: id++,
                    parent: processTask.id,
                    text: baseData.processName,
                    start_date: new Date(baseData.startTime),
                    end_date: new Date(baseData.endTime),
                    materialCode: item.materialCode,
                    materialName: item.materialName,
                    processName: baseData.processName,
                    type: index,
                    fcompletedQuantity: JSON.parse(process.fcompletedQuantity),
                };
                tasks.push(task);

                if (!processTask.start_date || task.start_date < processTask.start_date) {
                    processTask.start_date = task.start_date;
                }
                if (!processTask.end_date || task.end_date > processTask.end_date) {
                    processTask.end_date = task.end_date;
                }
            });

            if (!materialTask.start_date || processTask.start_date < materialTask.start_date) {
                materialTask.start_date = processTask.start_date;
            }
            if (!materialTask.end_date || processTask.end_date > materialTask.end_date) {
                materialTask.end_date = processTask.end_date;
            }
        });
    });

    console.log('处理后的任务数据:', tasks);
    return tasks;
}
</script>

<style scoped>
.gantt-chart-container {
    width: 100%;
    height: 600px;
    overflow: auto;
}

.gantt-container {
    width: 100%;
    height: 100%;
}
</style>