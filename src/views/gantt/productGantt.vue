<template>
    <div class="gantt-chart-container" ref="ganttChartContainer">
        <GanttToolbar :showReturnButton="currentView === 'workOrder'" @return="handleReturn" />
        <div ref="ganttContainer" class="gantt-container"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, reactive } from 'vue'; import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import GanttToolbar from './GanttToolbar.vue';

const ganttChartContainer = ref(null);
const currentView = ref('product'); // 'product' 或 'workOrder'
const currentTaskId = ref(null);
const workOrderData = reactive({
    taskId: '',
    materialCode: '',
    materialName: '',
    productProcessDetailDataList: []
});

import useGtt from '@/store/modules/gtt';

// 初始化gtt store
const gtt = useGtt();
// 创建甘特图容器的ref
const ganttContainer = ref(null);
let ganttInitialized = false;
// 组件挂载时初始化甘特图
onMounted(async () => {
    await initGantt();
});

// 组件被激活时重新加载数据
onActivated(async () => {
    if (ganttInitialized) {
        await loadGanttData();
    } else {
        await initGantt();
    }
});

// 组件卸载时清除甘特图数据
onUnmounted(() => {
    if (ganttInitialized) {
        gantt.clearAll();
    }
});

// 初始化甘特图的异步函数
async function initGantt() {
    console.log('初始化甘特图');

    // 配置甘特图（只在首次初始化时设置）
    if (!ganttInitialized) {
        configureGantt();
    }

    // 初始化甘特图
    gantt.init(ganttContainer.value);
    console.log('甘特图初始化完成');

    await loadGanttData();
    ganttInitialized = true;

    // 添加任务点击事件监听
    gantt.attachEvent("onTaskClick", async (id) => {
        const task = gantt.getTask(id);
        console.log('task', task)
        if (task.ftaskSourceId && currentView.value === 'product') {
            currentTaskId.value = task.ftaskId;
            await loadWorkOrderData(task.ftaskId);
            currentView.value = 'workOrder';
            await loadGanttData();
        }
    });
}

// 加载工单数据的函数
async function loadWorkOrderData(ftaskId) {
    const data = await gtt.getProductGanttDetailData(ftaskId);
    Object.assign(workOrderData, data);
}


// 加载甘特图数据
async function loadGanttData() {
    // 获取产品甘特图数据
    let data;
    if (currentView.value === 'product') {
        data = await gtt.getProductGanttData();
    } else {
        data = workOrderData;
    }
    console.log('原始数据:', data);
    // 处理数据
    const { data: tasks, links } = processData(data);
    console.log('处理后的任务数据:', tasks);

    // 加载数据到甘特图
    gantt.clearAll();
    gantt.parse({ data: tasks, links: links });
    console.log('数据和链接已加载到甘特图');
}

// 配置甘特图
function configureGantt() {
    // 设置语言为中文
    gantt.i18n.setLocale('cn');
    // 配置甘特图
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.scale_height = 50;
    gantt.config.row_height = 30;
    gantt.config.task_height = 20;


    // 设置甘特图列
    gantt.config.columns = [
        { name: "text", label: "物料", tree: true, width: 200 },
        { name: "start_date", label: "开始时间", align: "center", width: 100 },
        { name: "end_date", label: "结束时间", align: "center", width: 100 },
    ];

    // 设置日期格式
    gantt.config.scales = [
        { unit: "month", step: 1, format: "%Y年%M" },
        { unit: "day", step: 1, format: "%n/%j" } // 这里设置日期格式为 日/月
    ];


    // 启用tooltip插件
    gantt.plugins({
        tooltip: true
    });

    gantt.config.layout = {
        css: "gantt_container",
        rows: [
            {
                cols: [
                    {
                        // the default grid view  
                        view: "grid",
                        scrollX: "scrollHor",
                        scrollY: "scrollVer"
                    },
                    {
                        // the default timeline view
                        view: "timeline",
                        scrollX: "scrollHor",
                        scrollY: "scrollVer"
                    },
                    {
                        view: "scrollbar",
                        id: "scrollVer"
                    }
                ]
            },
            {
                view: "scrollbar",
                id: "scrollHor"
            }
        ]
    }
    gantt.config.scroll_size = 20;

    // 自定义tooltip内容
    gantt.templates.tooltip_text = function (start, end, task) {
        // 日期格式化函数
        function formatDate(date) {
            return date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0') + ' ' +
                String(date.getHours()).padStart(2, '0') + ':' +
                String(date.getMinutes()).padStart(2, '0') + ':' +
                String(date.getSeconds()).padStart(2, '0');
        }

        // 根据任务类型返回不同的tooltip内容
        if (task.parent === 0) {
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
}

// 处理原始数据，转换为甘特图可用的格式
function processData(data) {
    if (currentView.value === 'product') {
        const tasks = [];
        const links = [];
        let id = 1;
        let linkId = 1;

        // 遍历每个物料项
        data.forEach(item => {
            // 创建物料级别的任务
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

            // 遍历每个工序
            item.processGanttDataList.forEach(process => {
                // 创建项目级别的任务
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
                    ftaskId: process.ftaskId,
                    open: true,
                };
                tasks.push(processTask);
                let previousTaskId = null;

                // 遍历每个具体任务
                process.processBaseDataList.forEach((baseData, index) => {
                    // 创建具体任务级别的任务
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

                    // 创建任务之间的链接
                    if (previousTaskId !== null) {
                        links.push({
                            id: linkId++,
                            source: previousTaskId,
                            target: task.id,
                            type: "0"
                        });
                    }
                    previousTaskId = task.id;

                    // 更新项目任务的开始和结束时间
                    if (!processTask.start_date || task.start_date < processTask.start_date) {
                        processTask.start_date = task.start_date;
                    }
                    if (!processTask.end_date || task.end_date > processTask.end_date) {
                        processTask.end_date = task.end_date;
                    }
                });

                // 更新物料任务的开始和结束时间
                if (!materialTask.start_date || processTask.start_date < materialTask.start_date) {
                    materialTask.start_date = processTask.start_date;
                }
                if (!materialTask.end_date || processTask.end_date > materialTask.end_date) {
                    materialTask.end_date = processTask.end_date;
                }
            });
        });

        return { data: tasks, links: links };
    } else {
        // 工单甘特图数据处理逻辑
        const tasks = [];
        const links = [];
        let id = 1;
        let linkId = 1;

        const materialTask = {
            id: id++,
            text: `${data.materialCode} - ${data.materialName}`,
            start_date: null,
            end_date: null,
            open: true,
        };
        tasks.push(materialTask);

        data.productProcessDetailDataList.forEach(process => {
            const processTask = {
                id: id++,
                parent: materialTask.id,
                text: `项目: ${process.ftaskSourceId}`,
                start_date: null,
                end_date: null,
                open: true,
            };
            tasks.push(processTask);

            process.processDetailBaseDataList.forEach((detail, index) => {
                const task = {
                    id: id++,
                    parent: processTask.id,
                    text: `${detail.processName} - ${detail.employee}`,
                    start_date: new Date(detail.startTime),
                    end_date: new Date(detail.endTime),
                    quantity: detail.quantity,
                    employee: detail.employee,
                };
                tasks.push(task);

                // 更新父任务的时间范围
                if (!processTask.start_date || task.start_date < processTask.start_date) {
                    processTask.start_date = task.start_date;
                }
                if (!processTask.end_date || task.end_date > processTask.end_date) {
                    processTask.end_date = task.end_date;
                }
            });

            // 更新材料任务的时间范围
            if (!materialTask.start_date || processTask.start_date < materialTask.start_date) {
                materialTask.start_date = processTask.start_date;
            }
            if (!materialTask.end_date || processTask.end_date > materialTask.end_date) {
                materialTask.end_date = processTask.end_date;
            }
        });

        return { data: tasks, links: links };
    }
}

// 添加返回按钮的处理函数
function handleReturn() {
    currentView.value = 'product';
    currentTaskId.value = null;
    loadGanttData();
}

</script>

<style scoped>
.gantt-chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.gantt-container {
    width: 100%;
    flex-grow: 1;
}

/* 添加全屏样式 */
.gantt-chart-container:fullscreen {
    background-color: white;
    width: 100vw;
    height: 100vh;
}
</style>