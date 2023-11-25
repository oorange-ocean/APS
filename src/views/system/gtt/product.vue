<template>
    <div class="block">
      <span class="demonstration">请选择开始时间和结束时间：</span>
      <el-date-picker
        @change="convertDates"
        v-model="value"
        type="daterange"
        unlink-panels
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        :shortcuts="shortcuts"
      />
    </div>
  <div style="height: 100%; overflow-y: auto">
    <div id="container" :style="{ height: yAxisHeight + 'px' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, watch } from 'vue'
import useGtt from '@/store/modules/gtt'
import * as echarts from 'echarts';

const gtt = useGtt()
const value = ref('')
let yAxisHeight = ref(0)
let pickTime = ref([])
let filteredData = ref([])
const data = ref([]);
let myChart; // 在外部定义一个变量来存储图表实例
let selectedDateIndex = null;  // 开始日期，用于x轴的开始日期
let selectedEndDateIndex = null //结束日期，用于x轴的结束日期

const shortcuts = [
        {
            text: 'Last week',
            value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
            },
        },
        {
            text: 'Last month',
            value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
            },
        },
        {
            text: 'Last 3 months',
            value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
            },
        },
]
//处理挑选的日期格式
function convertDates(dateArray) {
    if (dateArray.length !== 2) {
        throw new Error('Expected an array with 2 date strings');
    }
    function formatDate(dateString) {
        let dateObj = new Date(dateString);
        let year = dateObj.getFullYear();
        let month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 因为月份是从0开始的
        let day = dateObj.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    pickTime.value = dateArray.map(dateString => formatDate(dateString))
}
watch(pickTime, (newVal, oldVal) => {
    //   console.log('pickTime 已更新',newVal);  // 这只是一个示例，你可以替换为任何你需要执行的逻辑
    // 你可以在这里调用其他函数或执行其他操作
    filteredData.value = filterRawData(newVal[0], newVal[1]);
    updateGanttChart(filteredData.value)
    // console.log(pickTime.value[0])
});

// console.log(Object.keys(gtt.product[0]))

const types = [
            { name: '包装', color: '#0053b5' },
            { name: '测试', color: '#1d89e9' },
            { name: '组装', color: '#9db9d6' },
];

// const rawData =  [
//             {
//                 product: "TFmini-i-485(整箱) 2m散线",
//                 processes: [
//                     {
//                         "name": "测试",
//                         "quantity": 100,
//                         "taskDate": "2023-9-19",
//                         "start": "15:15",
//                         "end": "16:30"
//                     },
//                     {
//                         "name": "组装",
//                         "quantity": 80,
//                         "taskDate": "2023-9-19",
//                         "start": "10:57",
//                         "end": "14:42"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-19",
//                         "start": "15:45",
//                         "end": "16:36"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-21",
//                         "start": "17:25",
//                         "end": "18:30"
//                     },
//                     {
//                         "name": "组装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-20",
//                         "start": "13:36",
//                         "end": "14:36"
//                     }
//                 ]
//             },
//             {
//                 product: "TFmini-S-IC(单品包装)-V1.0",
//                 processes:[
//                     {
//                         "name": "组装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-19",
//                         "start": "14:30",
//                         "end": "15:00"
//                     },

//                 ],
//             },
//             {
//                 product: "TFmini Plus-2400标品(单品包装)-V1.0",
//                 processes: [
//                     {
//                         "name": "组装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-19",
//                         "start": "9:30",
//                         "end": "14:06"
//                     },
//                     {
//                         "name": "测试",
//                         "quantity": 100,
//                         "taskDate": "2023-9-21",
//                         "start": "10:39",
//                         "end": "15:15"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-20",
//                         "start": "9:00",
//                         "end": "13:36"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-21",
//                         "start": "9:00",
//                         "end": "13:36"
//                     },{
//                         "name": "组装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-22",
//                         "start": "9:30",
//                         "end": "14:06"
//                     },
//                     {
//                         "name": "测试",
//                         "quantity": 100,
//                         "taskDate": "2023-9-23",
//                         "start": "10:39",
//                         "end": "15:15"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-25",
//                         "start": "9:00",
//                         "end": "13:36"
//                     },
//                     {
//                         "name": "包装",
//                         "quantity": 100,
//                         "taskDate": "2023-9-24",
//                         "start": "9:00",
//                         "end": "13:36"
//                     }
//                 ]
//             },
// ]

const rawData = [];

for (let productKey in gtt.product) {
    const processEntries = Object.values(gtt.product[productKey]); // 获取对象的所有值，这些值应该是关于工序的数组
    const processkey = Object.keys(gtt.product[productKey]); // 获取对象的所有键值，也就是所有的产品名

    for(let i = 0; i < processkey.length; i++) {
        const productName = processkey[i];
        const processes = processEntries[i].map(item => {
            return {
                name: item.processName,
                quantity: item.quantity,
                taskDate: item.taskDate,
                start: item.startTime,
                end: item.endTime
            };
        });
        
        rawData.push({
            product: productName, // 使用productName作为产品名称
            processes: processes
        });
    }
}


const uniqueDates = [...new Set(rawData.flatMap(item => item.processes.map(p => p.taskDate)))].sort();
const hoursPerDay = 12; // 从8点到20点共有12个小时
const minutesPerHour = 60;
const maxMinutes = uniqueDates.length * hoursPerDay * minutesPerHour;
yAxisHeight = types.length * rawData.length * 40;  // 这里30是每个y轴标签的预估高度
// 将时间 "hh:mm" 转换为分钟数。
function timeToMinutesFromDate(taskDate, time) {
    const [hours, minutes] = time.split(":").map(Number);
    const dateOffset = uniqueDates.indexOf(taskDate) * 12 * 60; // 每天12小时
    const timeFrom8AM = (hours - 8) * 60 + minutes; // 从8:00开始计算
    return dateOffset + timeFrom8AM;
}

//如果给的日期时间是断开的话，x轴会出现断层，如果你挑的那一天刚好没有，默认是第一天或最后一天
// console.log(uniqueDates,'@@@')

function filterRawData(startDate, endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // 设置开始日期为当天的开始时间
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // 设置结束日期为当天的最后时间

    return rawData.map(product => ({
        ...product,
        processes: product.processes.filter(process => {
            const processDate = new Date(process.taskDate);
            return processDate >= start && processDate <= end;
        })
    })).filter(product => product.processes.length > 0); // 只返回有流程的产品
}

function initGanttChart() {
    rawData.forEach((productData, idx) => {
            types.forEach((type, typeIdx) => {
                const processes = productData.processes.filter(p => p.name === type.name);
                processes.forEach(process => {
                    const startTime = timeToMinutesFromDate(process.taskDate, process.start);
                    const endTime = timeToMinutesFromDate(process.taskDate, process.end);
                    if (startTime !== null && endTime !== null) {  // 确保在我们关心的时间范围内
                        data.value.push({
                            name: process.name,
                            value: [startTime, idx * types.length + typeIdx, endTime],
                            itemStyle: { color: type.color },
                            quantity: process.quantity
                        });
                    }
                });
            });
        });
}

//默认显示六天的数据
const sixDaysPercentage = 6 / uniqueDates.length * 100;

const option = {
    tooltip: {        //鼠标悬浮时显示的内容
        formatter: function (params) {
        return params.marker + params.name+ ': ' + (params.value[2] - params.value[0])+'分钟';
        }
    },
    title: {
        text: '测试甘特图',
        left: 'center'
    },
    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: [0],  // 只对第一个x轴进行缩放和滑动
            orient: 'horizontal',
            filterMode: 'filter',
            // filterMode: 'weakFilter',
            showDataShadow: false,
            bottom: 20,
            // zoomLock: true,  // 锁定滑块的缩放比例
            start: 0,  // 初始显示数据的起始位置，0表示从第一个数据开始
            // end:100,
            end: sixDaysPercentage,   // 初始显示数据的结束位置，100表示显示到最后一个数据
            moveOnMouseMove: false,  // 禁止通过鼠标移动来平移
            zoomOnMouseWheel: false  // 禁止通过鼠标滚轮来缩放
        },
        {
            type: 'inside',
            xAxisIndex: [0],  // 只对第一个x轴进行缩放
            filterMode: 'filter',
             zoomOnMouseWheel: false  // 禁止通过鼠标滚轮来缩放
        },
    ],
    grid: {
        left: '15%', 
        height: yAxisHeight - 130 // 给滑动条留点空间
    },
    xAxis: {
        type: 'value',
        // min: 0,
        min: function() {
            // 如果选择了日期，从该日期开始，否则从0开始
            return (selectedDateIndex !== null) ? selectedDateIndex * 12 * 60 : 0;
        },
        max: uniqueDates.length * 12 * 60, // 考虑每天的12个小时
        // max:(selectedEndDateIndex + 1) * 12 * 60,
        interval: 12 * 60,  // 每12小时一个日期刻度，表示一个完整的日期
        axisLabel: {
            formatter: function(val) {
                const dayIndex = Math.floor(val / (12 * 60));

                // 检查是否超出了日期数组的长度，如果是，则返回下一天的日期
                if (dayIndex === uniqueDates.length) {
                    const lastDate = new Date(uniqueDates[uniqueDates.length - 1]);
                    const nextDate = new Date(lastDate);
                    nextDate.setDate(lastDate.getDate() + 1);

                    // 根据你的日期格式进行格式化
                    const year = nextDate.getFullYear();
                    const month = nextDate.getMonth() + 1;  // 0-based
                    const day = nextDate.getDate();
                    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
                }

                return uniqueDates[dayIndex];
            },
        },
        splitLine: {  // 在每个日期之间添加分割线
            show: true
        }
    },
    yAxis: {
        data: rawData.flatMap(() => types.map(type => type.name)),
        axisTick: {
            interval: (index) => index % types.length === 0
        },
        axisLabel: {
            fontSize:10,
            interval: (index) => index % types.length === 0,
            formatter: (value, index) => {
                if (index % types.length === 0) {
                    return rawData[Math.floor(index / types.length)].product;
                }
                return '';
            }
        }
    },
    series: [{
        type: 'custom',
        renderItem: renderItem,
        // xAxisIndex: 1,  // 使用隐藏的x轴
        itemStyle: { opacity: 0.8 },
        encode: { x: [0, 2], y: 1 },
        data: data.value
    }]
};

//挑选日期后更新甘特图
function updateGanttChart(newData) {
    data.value = []
    newData.forEach((productData, idx) => {
            types.forEach((type, typeIdx) => {
                const processes = productData.processes.filter(p => p.name === type.name);
                processes.forEach(process => {
                    const startTime = timeToMinutesFromDate(process.taskDate, process.start);
                    const endTime = timeToMinutesFromDate(process.taskDate, process.end);
                    if (startTime !== null && endTime !== null) {  // 确保在我们关心的时间范围内
                        data.value.push({
                            name: process.name,
                            value: [startTime, idx * types.length + typeIdx, endTime],
                            itemStyle: { color: type.color },
                            quantity: process.quantity
                        });
                    }
                });
            });
    });
    //手动更新option.seies[0].data的数据
    option.series[0].data = [...data.value];

    //结束日期
    selectedEndDateIndex = uniqueDates.indexOf(pickTime.value[1]);
    // console.log(selectedEndDateIndex)
    if (selectedEndDateIndex === -1) {
        console.error("选择的结束日期不在可用的日期列表中!");
        selectedEndDateIndex = uniqueDates.length - 1;  // 如果找不到，就默认为最后一个日期
    }

    // 使用Array的indexOf方法来查找此日期在uniqueDates数组中的索引,开始日期
    selectedDateIndex = uniqueDates.indexOf(pickTime.value[0]);
    // 如果日期不在数组中，indexOf会返回-1，所以你可能还想做一些错误检查
    if (selectedDateIndex === -1) {
        console.error("选择的日期不在可用的日期列表中!");
        selectedDateIndex = null;
    }
    // 强制更新结束日期
    option.xAxis.max = (selectedEndDateIndex + 1) * 12 * 60; // +1 以包括结束日期

    if (myChart) {
        // console.log(option.series[0].data,'111')
        myChart.setOption(option,true); 
        // console.log('执行更新')
    }
}
// Generate xAxis labels
const xAxisLabels = [];
for (let i = 0; i <= 24; i += 4) {
    xAxisLabels.push(i.toString().padStart(2, '0') + ':00');
}

// 初始化图表
function initGantt() {
    const dom = document.getElementById('container');
    myChart = echarts.init(dom);
}

//获取文字宽度
function getTextWidth(text, fontSize) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px sans-serif`;
    return ctx.measureText(text).width;
}
//渲染函数
function renderItem(params, api) {
    const categoryIndex = api.value(1);
    const start = api.coord([api.value(0), categoryIndex]);
    const end = api.coord([api.value(2), categoryIndex]);
    const height = api.size([0, 1])[1] * 0.8;

    const rectShape = echarts.graphic.clipRectByRect({
        x: start[0],
        y: start[1] - height / 2,
        width: end[0] - start[0],
        // width:20,
        height: height
    }, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });
    // console.log(params.dataIndex,'111')
    
    const processName = data.value[params.dataIndex].name;
    const quantity = data.value[params.dataIndex].quantity; // 获取quantity的值
    const displayText = `${processName}-${quantity}`; // 修改displayText

    // const displayText = '111'

    const textPosition = [
        (start[0] + end[0]) / 2,
        start[1]
    ];

    const textFontSize = 14;
    const textWidth = getTextWidth(displayText, textFontSize);
    const textHeight = textFontSize;  // approximate height

    const shouldRenderText = (textWidth <= rectShape.width) && (textHeight <= rectShape.height) && (textPosition[0] + textWidth / 2 <= params.coordSys.x + params.coordSys.width) && (textPosition[0] - textWidth / 2 >= params.coordSys.x);

    const children = [{
        type: 'rect',
        shape: rectShape,
        style:api.style()
    }];

    if (shouldRenderText) {
        children.push({
                type: 'text',
                position: textPosition,
                style: {
                text: displayText,
                textAlign: 'center',
                textVerticalAlign: 'middle',
                fontSize: textFontSize,
                fill: '#ffffff',  // 设置文本填充颜色为白色
                fontWeight:'400'
            }
        });
    }

    return rectShape ? {
            type: 'group',
            children: children
        } : null;
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

onMounted(() => {
    // 初始化甘特图
    initGantt();
    // 初始化data数据
    initGanttChart();

    const ONE_DAY_MINUTES = 12 * 60;
    let adjustingZoom = false;
    let lastHandledStart = 0; // 记录上次处理的开始位置

    myChart.on('datazoom', debounce(function (params) {
        if (adjustingZoom) {
            return;
        }

        const totalMinutes = uniqueDates.length * 12 * 60;
        const currentStartMinutes = params.start * totalMinutes / 100;

        // 计算与最近的整天开始时间的差值
        const diff = currentStartMinutes % ONE_DAY_MINUTES;

        // 判断是超过半天还是不足半天
        let nearestDayStartMinutes;
        if (diff > ONE_DAY_MINUTES / 2) {
            nearestDayStartMinutes = currentStartMinutes + (ONE_DAY_MINUTES - diff);
        } else {
            nearestDayStartMinutes = currentStartMinutes - diff;
        }

        adjustingZoom = true;

        const newStart = (nearestDayStartMinutes * 100) / totalMinutes;
        const zoomDiff = newStart - params.start;

        myChart.setOption({
            dataZoom: [{
                start: newStart,
                end: params.end + zoomDiff
            }]
        });

        lastHandledStart = nearestDayStartMinutes;

        adjustingZoom = false;
    }, 300));  // 300ms的延迟

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }
});


</script>

<style>
    .block{
        margin: 15px;
    }
</style>