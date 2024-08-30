<template>
    <!-- 甘特图主容器 -->
    <div class="gantt" ref="gantt">
        <!-- 左侧指南栏 -->
        <div class="guide">
            <!-- 顶部描述 -->
            <div class="desc">
                <span class="date">{{ props.dateText }}</span>
                <span class="item">{{ props.itemText }}</span>
            </div>
            <!-- 项目名称列表 -->
            <div class="item-name-list">
                <!-- 项目名称项 -->
                <div
                    v-for="({ item, count }, index) in mergedGuideNames"
                    :key="index"
                    :class="{
                        'guide-name': true,
                        'last-guide-name': index === mergedGuideNames.length - 1
                    }"
                    :style="{
                        ...(item.type === 'alike' && computedStyle(item)),
                        height: `calc(var(--itemHeight) * ${count})`
                    }"
                >
                    {{
                        typeof props.alikeName === 'function' &&
                        item.type === 'alike'
                            ? props.alikeName(item)
                            : item.name
                    }}
                </div>
            </div>
        </div>

        <!-- 右侧内容区 -->
        <div class="inner" @scroll="onScrollX($event)" ref="innerRef">
            <!-- 顶部日期列表 -->
            <div class="date-list first-date-list">
                <!-- 时间单位项 -->
                <div
                    v-for="(timeUnitItem, timeUnitIndex) in rangeDate"
                    :key="timeUnitIndex"
                    class="time-unit-item"
                >
                    <!-- 时间单位信息 -->
                    <div class="time-unit-info">
                        {{ getTimeUnitInfo(timeUnitItem) }}
                    </div>
                    <!-- 子时间单位盒子 -->
                    <div class="sub-time-unit-box">
                        <!-- 子时间单位项 -->
                        <div
                            v-for="(
                                subTimeUnitItem, subTimeUnitIndex
                            ) in timeUnitItem"
                            :key="getSubTimeUnitKey(subTimeUnitItem)"
                            :class="{
                                'sub-time-unit-item': true,
                                'first-sub-time-unit-item':
                                    subTimeUnitIndex === 0,
                                'date-active': isActiveDate(subTimeUnitItem)
                            }"
                        >
                            <div class="sub-time-unit-main">
                                {{ getSubTimeUnitMain(subTimeUnitItem) }}
                            </div>
                            <div class="sub-time-unit-sub">
                                {{ getSubTimeUnitSub(subTimeUnitItem) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 日程盒子 -->
            <div class="schedule-box">
                <!-- 日期盒子 -->
                <div
                    v-for="(item, index) in props.data"
                    :key="index"
                    :class="{
                        'date-box': true,
                        alike: item.type === 'alike'
                    }"
                >
                    <!-- 日期项 -->
                    <div
                        v-for="(dateItem, dateIndex) in renderWorks(item)"
                        :key="dateIndex"
                        :class="{
                            startDotline: dateItem.startDotline,
                            endDotline: dateItem.endDotline,
                            'date-item': true,
                            'date-item-work': dateItem.type === 'works',
                            'date-active': isActiveDate(dateItem)
                        }"
                        :style="{
                            ...computedStyle(item, dateItem),
                            '--startDotlineRight': dateItem.startDotlineRight
                                ? `${dateItem.startDotlineRight}px`
                                : '0'
                        }"
                        :title="dateItem.type === `works` ? dateItem.desc : ``"
                    >
                        <span
                            v-if="dateItem.type === 'works'"
                            class="work-desc"
                            v-html="
                                props.scheduleTitle
                                    ? props.scheduleTitle(dateItem)
                                    : dateItem.name.replace(/\n/g, '<br>')
                            "
                        ></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watchEffect, ref, onMounted, nextTick, computed } from 'vue'
import { fetchSubTimeUnitRange, splitForTimeUnit } from '@/utils/gantt'
// 定义组件的props
const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: []
    },
    dateRangeList: {
        type: Array,
        required: true,
        default: [],
        validator(value) {
            return value[0] && value.at(-1)
        }
    },
    dateText: {
        type: String,
        required: true
    },
    itemText: {
        type: String,
        required: true
    },
    activeDate: {
        type: String,
        default: null
    },
    repeatMode: {
        // extract 将重叠部分抽取，单独生成独立的日程
        // cover 重叠部分按照征程日期排序覆盖
        type: Object,
        default: () => ({
            mode: 'cover',
            backgroundColor: '#FFFFCC',
            textColor: '#336666',
            name: '重叠日程',
            desc: '这是多个日程'
        })
    },
    // 每个日程格子的宽度
    itemWidth: {
        type: Number,
        default: 40,
        validator(value) {
            return value >= 40
        }
    },
    itemHeight: {
        type: Number,
        default: 40,
        validator(value) {
            return value >= 40
        }
    },
    scheduleTitle: {
        type: Function,
        default: null
    },
    borderColor: {
        type: String,
        default: '#eee'
    },
    alikeName: {
        type: Function,
        default: null
    },
    timeUnit: {
        type: String,
        default: 'month'
    },
    subTimeUnit: {
        type: String,
        default: 'day'
    },
    step: {
        type: Number,
        default: 1
    }
})

// 定义组件的emit
const emit = defineEmits(['scheduleClick'])

const getTimeUnitInfo = (timeUnitItem) => {
    switch (props.timeUnit) {
        case 'week':
            return `第${timeUnitItem[0].weekNumber}周`
        case 'month':
            return `${timeUnitItem[0].year}-${timeUnitItem[0].month}`
        case 'day':
            return `${timeUnitItem[0].year}-${timeUnitItem[0].month}-${timeUnitItem[0].day}`
        default:
            return ''
    }
}

const getSubTimeUnitKey = (subTimeUnitItem) => {
    return `${subTimeUnitItem.year}-${subTimeUnitItem.month}-${subTimeUnitItem.day}-${subTimeUnitItem.hour}`
}

const isActiveDate = (subTimeUnitItem) => {
    const activeDate =
        props.subTimeUnit === 'hour'
            ? `${subTimeUnitItem.year}-${subTimeUnitItem.month}-${subTimeUnitItem.day}-${subTimeUnitItem.hour}`
            : `${subTimeUnitItem.year}-${subTimeUnitItem.month}-${subTimeUnitItem.day}`
    return props.activeDate === activeDate
}

const getSubTimeUnitMain = (subTimeUnitItem) => {
    switch (props.subTimeUnit) {
        case 'day':
            return subTimeUnitItem.display
        case 'hour':
            return subTimeUnitItem.display
        default:
            return ''
    }
}

const getSubTimeUnitSub = (subTimeUnitItem) => {
    switch (props.subTimeUnit) {
        case 'day':
            return subTimeUnitItem.weekDay
        default:
            return ''
    }
}

// 新增一个计算属性，只用于合并左侧栏的项目名称
const mergedGuideNames = computed(() => {
    const merged = []
    const nameMap = new Map()

    props.data.forEach((item, index) => {
        if (nameMap.has(item.name)) {
            nameMap.get(item.name).count++
        } else {
            nameMap.set(item.name, { item, index, count: 1 })
            merged.push(nameMap.get(item.name))
        }
    })
    // console.log('merged', merged)

    return merged
})
let rangeDate = ref([])
const ganttMaxWidth = ref('2000px')
const ganttInnerHeight = ref('0px')
// 甘特图 dom
const gantt = ref()

let computeTimer = null
// 计算当前图表内容区域高度
const computedGanttInnerHeight = () => {
    clearTimeout(computeTimer)
    computeTimer = setTimeout(() => {
        if (!gantt.value) return
        ganttInnerHeight.value = 0
        nextTick(() => {
            const parent = gantt.value.parentElement || document.body
            const ganttHead = gantt.value.querySelector(`.desc`)
            const headRect = ganttHead.getBoundingClientRect()
            const parentRect = parent.getBoundingClientRect()
            // ganttInnerHeight.value = parent.clientHeight - ganttHead.clientHeight - (ganttHead.offsetTop - parent.offsetTop) - 2 + 'px'
            // gannt顶部的其余内容高
            const topHeight = headRect.top - parentRect.top
            ganttInnerHeight.value =
                parentRect.height - headRect.height - topHeight + 'px'
            // console.log('ganttInnerHeight.value', ganttInnerHeight.value)
        })
    }, 200)
}

onMounted(() => {
    const itemBox = gantt.value.querySelector('.item-name-list')
    const innerBox = gantt.value.querySelector('.schedule-box')
    itemBox.addEventListener('scroll', contentScroll)
    innerBox.addEventListener('scroll', contentScroll)
    window.addEventListener('resize', computedGanttInnerHeight)
    computedGanttInnerHeight()
})

const contentScroll = (event) => {
    const target = event ? event.target : innerRef.value
    if (!target) return
    const targetClassName = target.className
    let flag = 'item-name-list'
    if (targetClassName === 'item-name-list') {
        flag = 'schedule-box'
    }
    const flagBox = gantt.value.querySelector(`.${flag}`)
    if (flagBox) {
        flagBox.scrollTop = target.scrollTop
    }
    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        const height = Math.ceil(
            Math.max(target.clientHeight, target.scrollHeight)
        )
        if (target.scrollTop + target.clientHeight >= height) {
            emit('scrollYEnd', event)
        }
    }, 200)
}

/**
 * @function splitForTimeUnit 将日期范围拆分成指定unit的二维数组
 * @param {Array} dateRangeList 日期范围列表
 * @param {String} timeUnit 时间单位
 * @param {String} subTimeUnit 子时间单位
 * @param {Number} step 步长
 * @returns {Array}  日期范围列表
 */
watchEffect(() => {
    rangeDate.value = splitForTimeUnit(
        fetchSubTimeUnitRange(
            props.dateRangeList[0],
            props.dateRangeList.at(-1),
            props.subTimeUnit,
            props.step
        ),
        props.timeUnit
    )
    ganttMaxWidth.value =
        props.itemWidth * rangeDate.value.flat(1).length + 122 + 'px'
})

// console.log('rangeDate.value', rangeDate.value)

const data = ref([])

// 计算当前盒子样式
const computedStyle = (parent, item) => {
    let res = {}
    if (item && item.type === 'works') {
        res = {
            ...res,
            backgroundColor: parent.backgroundColor,
            color: parent.textColor,
            width: item.width + 'px',
            marginLeft: -item.left + 'px',
            textAlign: 'center'
        }
    }
    return res
}

// 检查当前日期是否在最终结果列表上
const _checkTodayInResult = (today, result) => {
    return !!result.find((item) => item.date === today)
}
// 检查当前日程是否已经添加到最终结果列表上
const _checkWorkInResult = (work, result) => {
    return !!result.find((item) => item.id === work.id)
}
// 检查当前日期是否在指定的日程列表中
const _checkTodayInWorkList = (today, workList) => {
    return !!workList.find((item) =>
        item.timeUnits.some((timeUnit) => formatDate(timeUnit) === today)
    )
}
// 检查当前日期是否在当前行已经添加的日程列表中
const _checkTodayInAllWorkList = (today, result) => {
    const res = result.filter((item) => item.type === 'works')
    // console.log('需要检查的行', res)
    return !!_checkTodayInWorkList(today, res)
}
// 把日期范围二维数组处理成适用于日程渲染的一维数组
const _flatDateRange = (dateRange) => {
    return dateRange.flat(1).map((item) => {
        let date
        switch (props.subTimeUnit) {
            case 'hour':
                date = `${item.year}-${item.month}-${item.day}-${item.hour}`
                break
            case 'day':
                date = `${item.year}-${item.month}-${item.day}`
                break
            case 'week':
                date = `${item.year}-W${item.weekNumber}`
                break
            case 'month':
                date = `${item.year}-${item.month}`
                break
            default:
                date = `${item.year}-${item.month}-${item.day}`
        }
        return {
            type: 'normal',
            date,
            display: item.display,
            ...item
        }
    })
}
// 检查两个日程的重叠范围
const _checkWorkRepeatRange = (workA, workB) => {
    // console.log('workA', workA)
    // console.log(workA.timeUnits === workA.timeUnits)
    // console.log('workA.timeUnits', workA.timeUnits)
    const daysA = workA.timeUnits.map(formatDate)
    // console.log('daysA', daysA)
    const daysB = workB.timeUnits.map(formatDate)
    // console.log('daysB', daysB, 'workB', workB)
    return daysA.filter((day) => daysB.includes(day))
}

// 从目前排出来的结果中找到指定日期所在的日程信息
const _findTodayForWork = (query, res) => {
    // console.log('查询参数', 'today', today, 'res', res)
    return res.find(
        (item) =>
            item.type === 'works' &&
            item.timeUnits.some((timeUnit) => formatDate(timeUnit) === query)
    )
}
// 更新已有日程
const _updateScheduleItem = (scheduleItem, result) => {
    // 获取已加入的重叠日程
    // console.log('再次查询', formatDate(scheduleItem.timeUnits[0]))
    const inWorkInfo = _findTodayForWork(
        formatDate(scheduleItem.timeUnits[0]),
        result
    )
    if (inWorkInfo && scheduleItem.id !== inWorkInfo.id) {
        // console.log(
        //     '将冲突的日期',
        //     scheduleItem,
        //     '已排好的被冲突的',
        //     inWorkInfo
        // )

        // 获取重叠范围
        const repeatList = _checkWorkRepeatRange(inWorkInfo, scheduleItem)
        // console.log('重叠范围', repeatList)
        //重叠范围的起点
        const start = repeatList[0]
        // console.log('重叠范围的起点', start)
        //重叠范围起点对应的日期索引
        const index = inWorkInfo.timeUnits.findIndex(
            (item) => formatDate(item) === start
        )
        // console.log('重叠范围起点对应的日期索引', index)
        //截取index之前的时间片
        inWorkInfo.timeUnits = inWorkInfo.timeUnits.slice(0, index)
        inWorkInfo.width = inWorkInfo.timeUnits.length * props.itemWidth
        // console.log('截取index之前的部分后的inworkinfo', inWorkInfo)
        inWorkInfo.endDotline = true
        //移除那些和scheduleitem的timeunits相同的日程
        let isFirst = true
        scheduleItem.timeUnits.forEach((timeUnit) => {
            const index = result.findIndex(
                (item) =>
                    item.type === 'normal' && item.date === formatDate(timeUnit)
            )
            if (index !== -1) {
                result.splice(index, 1)
                //如果是首个，就将scheduleitem插入此处
                if (isFirst) {
                    result.splice(index, 0, {
                        type: 'works',
                        date: formatDate(scheduleItem.timeUnits[0]),
                        width: scheduleItem.timeUnits.length * props.itemWidth,
                        left: 0,
                        startDotline: true,
                        startDotlineRight: repeatList.length * props.itemWidth,
                        ...scheduleItem
                    })
                    // console.log(
                    //     '虚线右移距离',
                    //     repeatList.length * props.itemWidth
                    // )
                    isFirst = false
                }
            }
        })
        // console.log(
        //     '移除那些和scheduleItem的date相同的日程并将新日程插入',
        //     result
        // )

        //新日程
    }
    // else {
    //     // 正常更新 (有头有尾)
    //     const index = result.findIndex(
    //         (item) => item.date === scheduleItem.days[0]
    //     )
    //     result[index] = {
    //         type: 'works',
    //         date: scheduleItem.days[0],
    //         width: scheduleItem.days.length * props.itemWidth,
    //         left: 0,
    //         ...scheduleItem
    //     }
    // }
    // // 新增日程，需要同步删除更新日程列表，把原本为空的部分日程删掉
    // result = result.filter((item) => {
    //     return !(
    //         item.type === 'normal' && scheduleItem.days.includes(item.date)
    //     )
    // })
    // return result
}

const formatDate = (timeUnit) => {
    switch (props.subTimeUnit) {
        case 'hour':
            return `${timeUnit.year}-${timeUnit.month}-${timeUnit.day}-${timeUnit.hour}`
        case 'day':
            return `${timeUnit.year}-${timeUnit.month}-${timeUnit.day}`
        case 'week':
            return `${timeUnit.year}-W${timeUnit.weekNumber}`
        case 'month':
            return `${timeUnit.year}-${timeUnit.month}`
        default:
            return `${timeUnit.year}-${timeUnit.month}-${timeUnit.day}`
    }
}

// 生成当前项目在当前日期范围的日程列表
const renderWorks = (item) => {
    // console.log('item', item)
    const dateRange = _flatDateRange(rangeDate.value)
    // 如果当前项目没有日程安排，直接返回默认的数据
    if (!item.schedule || !item.schedule.length) return dateRange
    let res = []
    item.schedule.forEach((scheduleItem) => {
        // console.log(`开始处理${item.name}的日程: ${scheduleItem.name}`)
        dateRange.forEach((dayItem) => {
            // 当前日期是否包含在此次遍历的日程中
            // console.log('dayItem', dayItem)
            const isWork = scheduleItem.timeUnits.some(
                (timeUnit) => formatDate(timeUnit) === dayItem.date
            )
            // console.log('isWork', isWork)
            // 当前日期是否已经添加到该行的目前结果（如果是，说明已经有一个以此处作为起点的日程）
            const todayInResult = _checkTodayInResult(dayItem.date, res)
            // console.log('todayInResult', todayInResult)
            // 当前日期是否在已添加的日程范围内(如果是，就说明在此处添加日程会产生重叠)
            const todayInAllWorkList = _checkTodayInAllWorkList(
                dayItem.date,
                res
            )
            // console.log('todayInAllWorkList', todayInAllWorkList)
            // console.log('开始处理', dayItem.date, scheduleItem)
            // 当前日期包含在此次遍历的日程(scheduleitem)中
            if (isWork) {
                // 当前日期没有曾经被作为起点添加到该行的最后排程结果
                //&& 当前日期不在已添加的日程范围内(包括自身)=>该日就是起点，添加
                if (!todayInResult && !todayInAllWorkList) {
                    // console.log('添加日程', dayItem.date, scheduleItem)
                    res.push({
                        type: 'works',
                        date: dayItem.date,
                        width: scheduleItem.timeUnits.length * props.itemWidth,
                        left: 0,
                        ...scheduleItem
                    })
                    // console.log('该行更新后的值', res)
                } else if (!todayInResult && todayInAllWorkList) {
                    // 当前日期没有作为起点被添加 && 当前日期在已添加的日程范围内 => 冲突或者是和前面的同属一个日程
                    // 获取所在的日程信息
                    // console.log('在已添加的日程范围内', dayItem.date, res)
                    const inWorkInfo = _findTodayForWork(dayItem.date, res)
                    // console.log('查询结果', inWorkInfo)
                    if (scheduleItem.id !== inWorkInfo.id) {
                        //重叠
                        // console.log(
                        //     '发生重叠！',
                        //     '将插入的日程\n',
                        //     scheduleItem,
                        //     '被冲突的日程',
                        //     inWorkInfo
                        // )
                        _updateScheduleItem(scheduleItem, res)
                    } else {
                        // 说明是属于同一个日程，无需处理
                        // console.log('同一个日程', scheduleItem, inWorkInfo)
                    }
                }
            } else {
                //占位
                if (!todayInResult && !todayInAllWorkList) {
                    res.push(dayItem)
                }
            }
        })
        // console.log(`处理${item.name}的日程结束`)
    })
    // console.log('res', res)
    return res
}

let timer = null

const innerRef = ref(null)

const onScrollX = (event) => {
    if (timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(() => {
        const target = event.target
        const width = Math.ceil(
            Math.max(target.clientWidth, target.scrollWidth)
        )
        if (target.scrollLeft + target.clientWidth >= width) {
            emit('scrollXEnd', event)
        }
    }, 200)
}
</script>

<style lang="less" scoped>
.gantt {
    --borderWidth: 1px;
    --borderColor: v-bind(props.borderColor);
    --border: 1px solid var(--borderColor);
    --fontSize: 12px;
    --fontColor: #333;
    --itemWidth: v-bind(props.itemWidth + 'px');
    --itemHeight: v-bind(props.itemHeight + 'px');
}
* {
    box-sizing: border-box;
}
.gantt {
    width: 100%;
    max-width: v-bind(ganttMaxWidth);
    margin: 0 auto;
    height: auto;
    user-select: none;
    box-sizing: border-box;
    border: var(--border);
    font-size: var(--fontSize);
    color: var(--fontColor);
    display: flex;
    position: relative;
    *::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }
    *::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 2px;
        box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
        background: #818181;
    }
    *::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 2px rgba(10, 10, 10, 0.2);
        border-radius: 2px;
        background: #ededed;
    }
    .guide {
        flex-shrink: 0;
        width: 120px;
        height: 100%;
        border-right: var(--border);
        .desc {
            width: 120px;
            height: 120px;
            border-bottom: var(--border);
            position: relative;
            &::after {
                content: '';
                position: absolute;
                height: 1px;
                width: 169.7056274847714px;
                background-color: var(--borderColor);
                top: 0;
                left: 0;
                transform: rotate(45deg);
                transform-origin: 0 0;
            }
            .date {
                position: absolute;
                top: 20px;
                right: 20px;
            }
            .item {
                position: absolute;
                left: 5px;
                bottom: 20px;
            }
        }
        .item-name-list {
            width: 100%;
            max-height: v-bind(ganttInnerHeight);
            overflow-y: auto;
        }
        .guide-name {
            width: 100%;
            min-height: var(--itemHeight);
            border-bottom: var(--border);
            padding: 2px 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            &.last-guide-name {
                border-bottom: none;
            }
        }
    }
    .inner {
        width: 100%;
        overflow-x: auto;
        overflow-x: overlay;
        position: relative;
        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
            height: 5px;
        }
        .date-list {
            width: 100%;
            height: 120px;
            display: flex;
            .time-unit-item {
                height: 100%;
                border-bottom: var(--border);
                display: flex;
                flex-direction: column;
                .time-unit-info {
                    flex: 1;
                    border-left: var(--border);
                    border-bottom: var(--border);
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sub-time-unit-box {
                    flex: 2;
                    display: flex;
                    .sub-time-unit-item {
                        width: var(--itemWidth);
                        .sub-time-unit-main,
                        .sub-time-unit-sub {
                            width: var(--itemWidth);
                            height: 50%;
                            border-left: var(--border);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .sub-time-unit-sub {
                            border-top: var(--border);
                        }
                    }
                }
                &:first-child {
                    .time-unit-info {
                        border-left: none;
                    }
                    .sub-time-unit-box {
                        .first-sub-time-unit-item {
                            .sub-time-unit-main,
                            .sub-time-unit-sub {
                                border-left: none;
                            }
                        }
                    }
                }
            }
        }
        .schedule-box {
            max-height: v-bind(ganttInnerHeight);
            overflow-y: auto;
            position: absolute;
            left: 0;
            bottom: 0;
        }
        .schedule-box::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 0; /*高宽分别对应横竖滚动条的尺寸*/
            height: 0;
        }
        .date-box {
            height: var(--itemHeight);
            display: flex;
            .date-item {
                flex-shrink: 0;
                width: var(--itemWidth);
                height: var(--itemHeight);
                border-left: var(--border);
                border-bottom: var(--border);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0 10px;
                .work-desc {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    white-space: nowrap;
                    text-align: center;
                    font-size: 12px;
                    line-height: 1.2;
                    z-index: 2;
                    // background-color: inherit; // 继承父元素的背景色
                    padding: 2px 4px; // 添加一些内边距
                    border-radius: 2px; // 可选：添加圆角
                    // box-shadow: 0 0 3px rgba(0, 0, 0, 0.2); // 可选：添加阴影以增加可读性
                }
                &.date-item-work {
                    cursor: pointer;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    &.startDotline::before,
                    &.endDotline::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 0;
                        border-style: dashed;
                        border-width: 0.5px; // 增加边框宽度
                        border-color: #ff6b6b; // 使用醒目的颜色
                        z-index: 2; // 确保虚线在网格线之上
                    }

                    &.startDotline::before {
                        left: var(--startDotlineRight, 0);
                        border-left-width: 1.5px;
                    }

                    &.endDotline::after {
                        right: 0;
                        border-right-width: 1.5px;
                    }
                }

                &:first-child {
                    border-left: none;
                }
            }
            &.alike {
                .date-item {
                    border-left: transparent;
                }
            }
            &:last-child {
                .date-item {
                    border-bottom: none;
                }
            }
        }
        .date-active {
            background-color: #caf2ff;
        }
    }
}
</style>
