import useSchedule from '../store/modules/scheduling'
import { ref } from 'vue'

const lastActivityTime = ref(Date.now())
const isLocked = ref(true)
export function updateLastActivity() {
    lastActivityTime.value = Date.now()
}

export function checkInactivity() {
    if (!isLocked.value) return // 如果锁已经关闭，直接返回

    const currentTime = Date.now()
    const inactiveTime = currentTime - lastActivityTime.value

    if (inactiveTime >= 3000) {
        // 5分钟 = 300000毫秒
        useSchedule()
            .closeLock()
            .then((res) => {
                console.log('用户无操作，已关闭锁:', res.message)
                isLocked.value = false
                stopInactivityCheck() // 关闭锁后立即停止检测
            })
            .catch((error) => {
                console.error('关闭锁失败:', error)
            })
    }
}
let timer = null
export function startInactivityCheck() {
    isLocked.value = true
    timer = setInterval(() => {
        checkInactivity()
    }, 1000) // 每分钟检查一次
}

export function stopInactivityCheck() {
    clearInterval(timer)
    isLocked.value = false
    console.log('结束排程，关闭定时器')
}
