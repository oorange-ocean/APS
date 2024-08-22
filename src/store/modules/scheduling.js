import { defineStore } from 'pinia'
import {
    updateData,
    getPageLock,
    closeLock,
    lockRenewal,
    startScheduling,
    integrityChecker,
    oneKeyScheduling,
    downloadIntegrityChecker,
    getApsSchedulingOptions
} from '@/api/scheduling'

const scheduling = defineStore('scheduling', {
    state: () => ({
        update: [],
        loading: false,
        //用户的排程选项
        userOptions: {
            target: '1',
            delay_request: 3,
            number_cycles: 2,
            scheduled_days_num: 240,
            in_advance_po: 7,
            buy_delay_days: 5,
            yg_delta: 90,
            consider_the_material: true,
            consider_the_process: false,
            produce_in_parallel: true,
            consider_history: true,
            advance_PO: false,
            advance_PR: false
        }
    }),
    actions: {
        updateData(update) {
            return new Promise((resolve, reject) => {
                updateData(update)
                    .then((res) => {
                        // 请求成功时的处理逻辑
                        // alert(res.data.message)
                        this.loading = false
                        console.log('store中数据更新成功')
                        resolve(res)
                    })
                    .catch((error) => {
                        console.log(error, 'store中数据更新出错')
                        this.loading = false
                        reject(error)
                    })
            })
        },
        getPageLock() {
            return new Promise((resolve, reject) => {
                getPageLock()
                    .then((res) => {
                        // console.log('获取界面的锁')
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        lockRenewal() {
            return new Promise((resolve, reject) => {
                lockRenewal()
                    .then((res) => {
                        console.log('续上锁了')
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        closeLock() {
            return new Promise((resolve, reject) => {
                closeLock()
                    .then((res) => {
                        console.log('关闭锁')
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        startScheduling(params) {
            return new Promise((resolve, reject) => {
                startScheduling(params)
                    .then((res) => {
                        console.log('开始排程')
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        integrityChecker() {
            return new Promise((resolve, reject) => {
                integrityChecker()
                    .then((res) => {
                        // console.log('开始完整性检查',res)
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        oneKeyScheduling(params) {
            return new Promise((resolve, reject) => {
                oneKeyScheduling(params)
                    .then((res) => {
                        console.log('一键排程开始')
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        downloadIntegrityChecker(param) {
            return new Promise((resolve, reject) => {
                downloadIntegrityChecker(param)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getApsSchedulingOptions() {
            return new Promise((resolve, reject) => {
                getApsSchedulingOptions()
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})
export default scheduling
