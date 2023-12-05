import { defineStore } from 'pinia'
import {
    getSemiFinished, addOrUpdateSemiFinished, removeSemiFinished,
    downloadSemiFinished,imporSemiFinished,semiFinishedTemplate
} from '@/api/metaData/materialBasicData/semiFinished'

const semiFinished = defineStore(
    'semiFinished',
    {
        state: () => ({
            semiMaterial: {
                data: [],
                total: 0,
                pages:1
            }
        }),
        actions: {
            getSemiFinished(page,size) {
                return new Promise((resolve, reject) => {
                    getSemiFinished(page,size).then(res => {
                        this.semiMaterial.data = res.data.list
                        this.semiMaterial.pages = res.data.pages
                        this.semiMaterial.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdateSemiFinished(param) {
                return new Promise((resolve, reject) => {
                    addOrUpdateSemiFinished(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            removeSemiFinished(param) {
                return new Promise((resolve, reject) => {
                    removeSemiFinished(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadSemiFinished(param) {
                return new Promise((resolve, reject) => {
                    downloadSemiFinished(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            imporSemiFinished(param) {
                return new Promise((resolve, reject) => {
                    imporSemiFinished(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            semiFinishedTemplate(param) {
                return new Promise((resolve, reject) => {
                    semiFinishedTemplate(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            resetState() {
                // 重置状态逻辑
                this.$reset()
            },
        }
    }
)

export default semiFinished