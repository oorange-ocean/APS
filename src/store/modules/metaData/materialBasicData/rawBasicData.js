import { defineStore } from 'pinia'
import {
    getRawMaterialBasic, addOrUpdateRawMaterial, removeRawMaterial,
    downloadRawMaterial,imporRawMaterial,rawMaterialTemplate
} from '@/api/metaData/materialBasicData/rawBasicData'

const rawMaterialBasic = defineStore(
    'rawMaterialBasic',
    {
        state: () => ({
            rawMaterialBasic: {
                data: [],
                total: 0,
                pages:1
            }
        }),
        actions: {
            getRawMaterialBasic(page,size) {
                return new Promise((resolve, reject) => {
                    getRawMaterialBasic(page,size).then(res => {
                        this.rawMaterialBasic.data = res.data.list
                        this.rawMaterialBasic.pages = res.data.pages
                        this.rawMaterialBasic.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdateRawMaterial(param) {
                return new Promise((resolve, reject) => {
                    addOrUpdateRawMaterial(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            removeRawMaterial(param) {
                return new Promise((resolve, reject) => {
                    removeRawMaterial(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadRawMaterial(param) {
                return new Promise((resolve, reject) => {
                    downloadRawMaterial(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            imporRawMaterial(param) {
                return new Promise((resolve, reject) => {
                    imporRawMaterial(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            rawMaterialTemplate(param) {
                return new Promise((resolve, reject) => {
                    rawMaterialTemplate(param).then(res => {
                        
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

export default rawMaterialBasic