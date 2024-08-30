/**
 * 计算指定日期范围内的所有时间单位
 * @param {string} startDate - 开始日期时间，格式为 'YYYY-MM-DD HH:mm:ss'
 * @param {string} endDate - 结束日期时间，格式为 'YYYY-MM-DD HH:mm:ss'
 * @param {string} timeUnit - 主时间单位，可选值：'day', 'week', 'month', 'quarter', 'year'
 * @param {string} subTimeUnit - 子时间单位，可选值：'hour', 'day', 'week', 'month'
 * @param {number} step - 步长，默认为1
 * @returns {Array} 包含日期范围内所有时间单位详细信息的数组
 */
export const fetchSubTimeUnitRange = (
    startDate,
    endDate,
    subTimeUnit = 'day',
    step = 1
) => {
    // console.log(typeof startDate, typeof endDate)
    if (typeof startDate === 'string') {
        startDate = new Date(startDate)
        // console.log('transformed to date')
    }
    if (typeof endDate === 'string') {
        endDate = new Date(endDate)
        // console.log('transformed to date')
    }
    // console.log('start', startDate)
    // console.log('end', endDate)
    let result = []
    result = fetchTimeRange(startDate, endDate, subTimeUnit, step)

    return result.map((item) => fetchTimeUnitDetail(item, subTimeUnit))
}

// 获取指定范围内的时间单位
export const fetchTimeRange = (startDate, endDate, subTimeUnit, step) => {
    const result = []

    // 处理开始日期和结束日期
    const formattedStartDate = formatDate(startDate, subTimeUnit)
    const formattedEndDate = formatDate(endDate, subTimeUnit)

    // 如果开始日期和结束日期相同，直接返回
    if (formattedStartDate === formattedEndDate) {
        return [formattedStartDate]
    }

    // 遍历日期范围
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
        result.push(formatDate(currentDate, subTimeUnit))

        switch (subTimeUnit) {
            case 'hour':
                currentDate.setHours(currentDate.getHours() + step)
                break
            case 'day':
                currentDate.setDate(currentDate.getDate() + step)
                break
            case 'week':
                currentDate.setDate(currentDate.getDate() + 7 * step)
                break
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + step)
                break
        }
    }
    result.push(formatDate(currentDate, subTimeUnit))

    return result
}

// 格式化日期
const formatDate = (date, subTimeUnit) => {
    // console.log('will be formatDate date', date)
    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) {
        console.error('无效的日期:', date)
        return ''
    }

    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    const hour = String(dateObj.getHours()).padStart(2, '0')

    switch (subTimeUnit) {
        case 'hour':
            return `${year}-${month}-${day} ${hour}:00:00`
        case 'day':
            return `${year}-${month}-${day}`
        case 'week':
            return `${year}-${month}-${day}`
        case 'month':
            return `${year}-${month}`
    }
}

// 获取指定时间单位的详细信息
export const fetchTimeUnitDetail = (date, subTimeUnit) => {
    const weekName = ['日', '一', '二', '三', '四', '五', '六']
    //将字符串转为日期对象
    if (typeof date === 'string') {
        date = new Date(date)
    }
    const detail = {
        year: String(date.getFullYear()).padStart(4, '0'),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        weekDay: weekName[date.getDay()],
        weekNumber: getWeekOfYear(date),
        hour: String(date.getHours()).padStart(2, '0')
    }

    switch (subTimeUnit) {
        case 'hour':
            detail.display = `${detail.hour}:00`
            break
        case 'day':
            detail.display = `${detail.month}-${detail.day}`
            break
        case 'week':
            detail.display = `第${getWeekOfYear(date)}周`
            break
        case 'month':
            detail.display = `${detail.year}-${detail.month}`
            break
        case 'quarter':
            detail.display = `${detail.year}Q${Math.floor(
                (date.getMonth() + 3) / 3
            )}`
            break
        case 'year':
            detail.display = detail.year
            break
    }
    // console.log('fetchTimeUnitDetail ', detail)
    return detail
}

// 获取指定日期是一年中的第几周
const getWeekOfYear = (date) => {
    // console.log('date waiting to be weeked', date)
    const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    )
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const res = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
    // console.log('res周数', res)
    return res
}

// 根据时间单位对时间范围进行分割
export const splitForTimeUnit = (timeRange, timeUnit) => {
    // console.log('timeRange', timeRange)
    // console.log('timeUnit', timeUnit)
    const res = {}
    timeRange.forEach((item) => {
        let key
        switch (timeUnit) {
            case 'hour':
            case 'day':
                key = `${item.year}-${item.month}-${item.day}`
                break
            case 'week':
                // 对于周，我们使用年份和周数作为键
                key = `${item.year}-${item.weekNumber}`
                break
            case 'month':
                // 对于月，我们使用年份和月份作为键
                key = `${item.year}-${item.month}`
                break
            case 'quarter':
                // 对于季度，我们可以使用年份和季度数作为键
                key = `${item.year}-Q${Math.ceil(parseInt(item.month) / 3)}`
                break
            case 'year':
                key = item.year
                break
        }
        if (res[key]) {
            res[key].push(item)
        } else {
            res[key] = [item]
        }
    })
    // console.log('splitForTimeUnit res', res)
    return Object.values(res)
}

// 查询指定日期是否在指定范围内
export const todayInRange = (today, range) => {
    return fethDaysRange(...range).includes(today)
}

// 获取指定月份日期列表
export const fetchMonthRangeDay = (str) => {
    const dateList = String(str).replace('/', '-').split('-')
    return fethDays(str).map((item) => {
        return (
            String(dateList[0]).padStart(4, '0') +
            '-' +
            String(dateList[1]).padStart(2, '0') +
            '-' +
            String(item).padStart(2, '0')
        )
    })
}

export const fetchToday = () => {
    const now = new Date()
    const currentYear = String(now.getFullYear()).padStart(4, '0')
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
    const currentDay = String(now.getDate()).padStart(2, '0')
    return `${currentYear}-${currentMonth}-${currentDay}`
}

export const fetchThreeDays = (now = new Date()) => {
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        '0'
    )}`
    let prevDate = ''
    if (currentMonth === 1) {
        prevDate = `${String(currentYear - 1).padStart(4, '0')}-12`
    } else {
        prevDate = `${String(currentYear).padStart(4, '0')}-${String(
            currentMonth - 1
        ).padStart(2, '0')}`
    }
    let nextDate = ''
    if (currentMonth === 12) {
        nextDate = `${String(currentYear + 1).padStart(4, '0')}-01`
    } else {
        nextDate = `${String(currentYear).padStart(4, '0')}-${String(
            currentMonth + 1
        ).padStart(2, '0')}`
    }

    const prev = fetchMonthRangeDay(prevDate)
    const current = fetchMonthRangeDay(currentDate)
    const next = fetchMonthRangeDay(nextDate)
    let result = [...prev, ...current, ...next]
    result.prev = prev
    result.current = current
    result.next = next
    return result
}

const dateSplitForValue = (data) => {
    if (!data.length) return {}
    const start = data[0].days[0]
    const endTime = data
        .map((item) => new Date(item.days.at(-1)).getTime())
        .sort((a, b) => a - b)
        .at(-1)
    const endDate = fetchDayDetail(new Date(endTime))
    const end = `${endDate.year}-${endDate.month}-${endDate.day}`
    const res = {}
    fethDaysRange(start, end).forEach((key) => {
        const current = data
            .map((item, index) => {
                if (item.days.includes(key)) return index
                return false
            })
            .filter((item) => item !== false)
        if (current.length) {
            res[key] = current
        }
    })
    return res
}

export const workListSplitForRepeat = (arr, repeatMode) => {
    const resArr = arr.map((schedule) => {
        if (schedule.type !== 'normal') return schedule
        const obj = dateSplitForValue(schedule.schedule)
        const values = Object.values(obj)
        const keys = Object.keys(obj)
        if (!keys.length) return schedule
        // const resMap = [...new Set(values.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
        const resMap = []
        for (let i = 0; i < values.length; i++) {
            if (JSON.stringify(resMap.at(-1)) !== JSON.stringify(values[i])) {
                resMap.push(values[i])
                resMap.at(-1).days = [keys[i]]
            } else {
                if (resMap.at(-1)) {
                    if (resMap.at(-1).days) {
                        resMap.at(-1).days.push(keys[i])
                    } else {
                        resMap.at(-1).days = [keys[i]]
                    }
                }
            }
        }
        let result = new Array(resMap.length).fill({})
        result = result.map((item, index) => {
            let r = {}
            if (resMap[index].length === 1) {
                r = {
                    ...schedule.schedule[resMap[index][0]],
                    days: resMap[index].days,
                    daysSource: schedule.schedule[resMap[index][0]].days
                }
                if (r.list) {
                    // 这是第n次，循环，重叠数据已经处理过
                    let desc = ''
                    let name = ''
                    if (typeof repeatMode.desc === 'function') {
                        desc = repeatMode.desc(r.list)
                    } else {
                        desc = repeatMode.desc
                    }
                    if (typeof repeatMode.name === 'function') {
                        name = repeatMode.name(r.list)
                    } else {
                        name = repeatMode.name
                    }
                    r = {
                        ...r,
                        desc,
                        name,
                        backgroundColor: repeatMode.backgroundColor,
                        textColor: repeatMode.textColor
                    }
                }
            } else {
                const list = resMap[index].map((v) => schedule.schedule[v])
                let desc = ''
                let name = ''
                if (typeof repeatMode.desc === 'function') {
                    desc = repeatMode.desc(list)
                } else {
                    desc = repeatMode.desc
                }
                if (typeof repeatMode.name === 'function') {
                    name = repeatMode.name(list)
                } else {
                    name = repeatMode.name
                }
                r = {
                    desc,
                    backgroundColor: repeatMode.backgroundColor,
                    textColor: repeatMode.textColor,
                    name,
                    list,
                    days: resMap[index].days
                }
            }
            // r.days = values.map((v, i) => {
            //     if (JSON.stringify(v) === JSON.stringify(resMap[index])) {
            //         return keys[i]
            //     }
            // }).filter(v => v)
            // console.log('*********', r)
            return r
        })
        schedule.schedule = result
        return schedule
    })
    // console.log('resArr--->', resArr)
    return resArr
}

export const fetchNextMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).next
}

export const fetchPrevMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).prev
}

export const fetchTodayMonthRange = (date = new Date()) => {
    return fetchThreeDays(date).current
}

const types = [
    { name: '组装', color: '#fff0b3' },
    { name: '测试', color: '#b3b3ff' },
    { name: '包装', color: '#b3ffff' }
]

export function transformData(backendData) {
    const transformedData = []

    backendData.forEach((item) => {
        const { materialCode, processGanttDataList } = item

        processGanttDataList.forEach((processGantt) => {
            const { processBaseDataList, ftaskId, frelatedOrders } =
                processGantt

            processBaseDataList.forEach((process, index) => {
                const { processName, startTime, endTime } = process
                const colorObj =
                    types.find((type) => type.name === processName) || {}
                const backgroundColor = colorObj.color || ''

                const scheduleItem = {
                    id: parseInt(ftaskId, 10) + index, // 假设需要用不同的 id 区分每个 schedule
                    name: `${processName}-${ftaskId}`, // 示例: '组装-1'
                    desc: `项目单号${frelatedOrders}`,
                    backgroundColor,
                    textColor: 'rgb(245, 36, 9)', // 这个颜色假设是固定的
                    days: fethDaysRange(startTime, endTime)
                }

                transformedData.push({
                    type: 'normal',
                    color: backgroundColor,
                    name: processName,
                    materialCode,
                    schedule: [scheduleItem]
                })
            })
        })
    })

    return transformedData
}

export function transformData2(backendData, timeUnit, subTimeUnit, step) {
    const transformedData = []
    backendData.forEach((item) => {
        // 获取所有唯一的工序
        const uniqueProcesses = [
            ...new Set(
                item.processGanttDataList.flatMap((workOrder) =>
                    workOrder.processBaseDataList.map(
                        (detail) => detail.processName
                    )
                )
            )
        ]
        // console.log('uniqueProcesses', uniqueProcesses)
        // 为每个工序创建基本结构
        const renderData = uniqueProcesses.map((processName) => ({
            type: 'normal',
            backgroundColor:
                types.find((type) => type.name === processName).color || '',
            color: '#000000',
            name: `${item.materialCode}`,
            materialCode: item.materialCode,
            processName: processName,
            schedule: []
        }))
        // console.log('renderData', renderData)

        // 将每个工单的详细数据添加到相应的工序中
        item.processGanttDataList.forEach((workOrder) => {
            // 解析 fcompletedQuantity 字符串为数组
            const completedQuantityArray = JSON.parse(
                workOrder.fcompletedQuantity
            )
            //遍历每个工序
            workOrder.processBaseDataList.forEach((process, index) => {
                const targetProcess = renderData.find(
                    (p) => p.processName === process.processName
                )
                if (targetProcess) {
                    // console.log('targetProcess', targetProcess)
                    // 使用 processIndexMap 来获取正确的完成数量
                    const completedQuantity = completedQuantityArray[index]
                    targetProcess.schedule.push({
                        id: parseInt(workOrder.ftaskId, 10) + index, // 假设需要用不同的 id 区分每个 schedule
                        name: `${process.processName}\n${completedQuantity}`, // 示例: '组装-1'
                        desc: `
                        \n单据编号、单据来源：${workOrder.ftaskSourceId}
                        \n单据类型：${workOrder.fpriority}
                        \n物料编码：${item.materialCode}
                        \n物料名称：${item.materialName}
                        \n数量：${completedQuantity}
                        \n开始时间：${process.startTime}
                        \n结束时间：${process.endTime}
                        \n总工时：${(
                            (new Date(process.endTime) -
                                new Date(process.startTime)) /
                            (1000 * 60 * 60)
                        ).toFixed(2)}小时
                        \n满足订单状态：${
                            workOrder.fdelayDays > 0 ? '满足' : '不满足'
                        }
                        \n延迟交付FIM号：${workOrder.frelatedOrders}`,
                        timeUnits: fetchSubTimeUnitRange(
                            process.startTime,
                            process.endTime,
                            subTimeUnit,
                            step
                        )
                    })
                }
            })
        })
        // console.log('transformedData', transformedData)
        transformedData.push(...renderData)
    })
    return transformedData
}

export function getDateRangeList(data) {
    let minDate = null
    let maxDate = null

    data.forEach((item) => {
        item.schedule.forEach((schedule) => {
            const { timeUnits } = schedule
            if (timeUnits && timeUnits.length > 0) {
                const startDate = new Date(
                    `${timeUnits[0].year}-${timeUnits[0].month}-${timeUnits[0].day}T${timeUnits[0].hour}:00:00`
                )
                const endDate = new Date(
                    `${timeUnits[timeUnits.length - 1].year}-${
                        timeUnits[timeUnits.length - 1].month
                    }-${timeUnits[timeUnits.length - 1].day}T${
                        timeUnits[timeUnits.length - 1].hour
                    }:00:00`
                )

                if (!minDate || startDate < minDate) {
                    minDate = startDate
                }

                if (!maxDate || endDate > maxDate) {
                    maxDate = endDate
                }
            }
        })
    })
    // console.log('minDate', minDate)
    // console.log('maxDate', maxDate)
    return [
        minDate ? minDate.toISOString().split('T')[0] : null,
        maxDate ? maxDate.toISOString().split('T')[0] : null
    ]
}
