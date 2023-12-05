import { defineStore } from 'pinia'
import {
    getFinishedProduct, addOrUpdateFinishedProduct, removeFinishedProduct,
    downloadFinishedProduct,imporFinishedProduct,finishedProductTemplate
} from '@/api/metaData/materialBasicData/finishedProduct'


const finishedProduct = defineStore(
    'finishedProduct',
    {
        state: () => ({
            finishedProduct: {
                data: [],
                total: 0,
                pages:1
            }
        }),
        actions: {
            getFinishedProduct(page,size) {
                return new Promise((resolve, reject) => {
                    getFinishedProduct(page,size).then(res => {
                        this.finishedProduct.data = res.data.list
                        this.finishedProduct.pages = res.data.pages
                        this.finishedProduct.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdateFinishedProduct(param) {
                return new Promise((resolve, reject) => {
                    addOrUpdateFinishedProduct(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            removeFinishedProduct(param) {
                return new Promise((resolve, reject) => {
                    removeFinishedProduct(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadFinishedProduct(param) {
                return new Promise((resolve, reject) => {
                    downloadFinishedProduct(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            imporFinishedProduct(param) {
                return new Promise((resolve, reject) => {
                    imporFinishedProduct(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            finishedProductTemplate(param) {
                return new Promise((resolve, reject) => {
                    finishedProductTemplate(param).then(res => {
                        
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

export default finishedProduct