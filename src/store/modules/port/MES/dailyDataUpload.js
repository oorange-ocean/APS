import { defineStore } from "pinia";
import {
    getDailyDataList, downloadDailyData, importloadDailyData,
    downloadDailyDataUploadTemplate,addOrUpdateDailyData,removeDailyData
} from '@/api/port/Mes/dailyDataUpload';

const dailyDataUpload = defineStore(
    'dailyDataUpload',
    {
        state: () => ({
            dailyDataUpload: {
                data: [
                    {
                        "processName": "包装",
                        "orderNumber": "ORD001",
                        "materialCode": "12.01.01.116",
                        "materialName": "航插板 V2.3",
                        "processId": null,
                        "totalQuantity": "100",
                        "completedQuantity": "50",
                        "capacityPsPuPp": "30",
                        "remainingQuantity": "50",
                        "remainingCapacity": "20"
                    }
                ],
                total: 0,
                pages:1,
                
            }
        }),
        actions: {
            getDailyDataList(page,size) {
                return new Promise((resolve, reject) => {
                    getDailyDataList(page,size).then(res => {
                        this.dailyDataUpload.data = res.data.list
                        this.dailyDataUpload.pages = res.data.pages
                        this.dailyDataUpload.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadDailyData(param) {
                return new Promise((resolve, reject) => {
                    downloadDailyData(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            importloadDailyData(param) {
                return new Promise((resolve, reject) => {
                    importloadDailyData(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadDailyDataUploadTemplate() {
                return new Promise((resolve, reject) => {
                    downloadDailyDataUploadTemplate().then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdateDailyData(param) {
                return new Promise((resolve, reject) => {
                    addOrUpdateDailyData(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            removeDailyData(param) {
                return new Promise((resolve, reject) => {
                    removeDailyData(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            }
        }
    }
)
export default dailyDataUpload