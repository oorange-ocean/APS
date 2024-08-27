// 加工日期范围
export const computedDaysRange = (daysArr, endDay = null) => {
    let result = daysArr
    if (typeof endDay === 'string') {
        result = fethDaysRange(daysArr, endDay)
    }
    return result.map((item) => fetchDayDetail(item))
}

// 获取指定日期详细信息
export const fetchDayDetail = (current) => {
    let currentDate = null
    if (typeof current === 'string') {
        currentDate = new Date(current)
    } else if (current instanceof Date) {
        currentDate = current
    }
    const weekName = ['日', '一', '二', '三', '四', '五', '六']

    return {
        year: String(currentDate.getFullYear()).padStart(4, '0'),
        month: String(currentDate.getMonth() + 1).padStart(2, '0'),
        day: String(currentDate.getDate()).padStart(2, '0'),
        week: weekName[currentDate.getDay()]
    }
}

// 获取指定月份每一天日期 2022-02
export const fethDays = (str) => {
    const month = str.replace(/\//g, '-')
    const monthArr = month.split('-').map((item) => Number(item))
    if (monthArr.length !== 2) throw new Error('获取月份日期参数错误:', str)
    const count = new Date(...monthArr, 0).getDate()
    return new Array(count).fill().map((item, index) => index + 1)
}

// 获取指定范围每一天的日期
export const fethDaysRange = (start, stop) => {
    // console.log('start', start)
    // console.log('stop', stop)
    const current = new Date(start.replace(/\//g, '-'))
    const end = new Date(stop)
    current.setHours(0, 0, 0, 0)
    const result = []
    while (end.getTime() >= current.getTime()) {
        const res = fetchDayDetail(current)
        result.push(`${res.year}-${res.month}-${res.day}`)
        current.setDate(current.getDate() + 1)
    }
    // console.log('result', result)
    return result
}

// 范围日期按 月份归类
export const splitDaysForMonth = (daysArr) => {
    const res = {}
    daysArr.forEach((item) => {
        const name = item.year + '-' + item.month
        if (res[name]) {
            res[name].push(item)
        } else {
            res[name] = [item]
        }
    })
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
    { name: '组装', color: '#ffff80' },
    { name: '测试', color: '#8080ff' },
    { name: '包装', color: '#00ffff' }
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

export function transformData2(backendData) {
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
            color: types.find((type) => type.name === processName).color || '',
            name: `${item.materialCode}-${processName}`,
            materialCode: item.materialCode,
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
                    (p) =>
                        p.name === `${item.materialCode}-${process.processName}`
                )
                console.log(index, 'index')
                console.log(
                    workOrder.fcompletedQuantity[index],
                    'fcompletedQuantity[index]'
                )
                console.log(
                    workOrder.fcompletedQuantity,
                    'workOrder.fcompletedQuantity'
                )
                if (targetProcess) {
                    // console.log('targetProcess', targetProcess)
                    targetProcess.schedule.push({
                        id: parseInt(workOrder.ftaskId, 10) + index, // 假设需要用不同的 id 区分每个 schedule
                        name: `${process.processName}-${completedQuantityArray[index]}`, // 示例: '组装-1'
                        desc: `项目单号${workOrder.ftaskSourceId}`,
                        backgroundColor: targetProcess.color,
                        textColor: 'rgb(245, 36, 9)', // 这个颜色假设是固定的
                        days: fethDaysRange(
                            process.startTime.split(' ')[0],
                            process.endTime.split(' ')[0]
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
            const { days } = schedule
            const startDate = new Date(days[0])
            const endDate = new Date(days[days.length - 1])

            if (!minDate || startDate < minDate) {
                minDate = startDate
            }

            if (!maxDate || endDate > maxDate) {
                maxDate = endDate
            }
        })
    })

    return [
        minDate ? minDate.toISOString().split('T')[0] : null,
        maxDate ? maxDate.toISOString().split('T')[0] : null
    ]
}
