import { defineStore } from 'pinia'
import {
    getProductionPlan, getSemiFinishedGoodsProductionPlan,
    getMaterialShortageAnalysis,getSemiFinishedGoodsMaterialShortageAnalysis
} from '@/api/productionPlan'

const productionPlan = defineStore(
    'productionPlan',
    {
        state: () => ({
            productPlan: {
                data:[],
                pages: 1,
                total:0
            },
                
            semiFinishedProducts: {
                data:[],
                pages: 1,
                total:0
            },
                
            productPlanMaterialShort: {
                data:[],
                pages: 1,
                total:0
            },
                
            sFMaterialShort: {
                data:[],
                total: 0,
                pages:1
            },
            
        }),
        actions: {
            getProductionPlan(page,size) {
                return new Promise((resolve, reject) => {
                    getProductionPlan(page, size).then(res => {
                        if (res.code == 200) {
                            this.productPlan.data = res.data.list
                            this.productPlan.pages = res.data.pages
                            this.productPlan.total = res.data.total
                        }
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            getSemiFinishedGoodsProductionPlan(page,size) {
                return new Promise((resolve, reject) => {
                    getSemiFinishedGoodsProductionPlan(page, size).then(res => {
                        if (res.code == 200) {
                            this.semiFinishedProducts.data = res.data.list
                            this.semiFinishedProducts.pages = res.data.pages
                            this.semiFinishedProducts.total = res.data.total
                        }
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            getMaterialShortageAnalysis(page,size) {
                return new Promise((resolve, reject) => {
                    getMaterialShortageAnalysis(page, size).then(res => {
                        if (res.code == 200) {
                            this.productPlanMaterialShort.data = res.data.list
                            this.productPlanMaterialShort.pages = res.data.pages
                            this.productPlanMaterialShort.total = res.data.total
                        }
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            getSemiFinishedGoodsMaterialShortageAnalysis(page,size) {
                return new Promise((resolve, reject) => {
                    getSemiFinishedGoodsMaterialShortageAnalysis(page, size).then(res => {
                        if (res.code == 200) {
                            this.sFMaterialShort.data = res.data.list
                            this.sFMaterialShort.pages = res.data.pages
                            this.sFMaterialShort.total = res.data.total
                        }
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            }
        }
    }
)

export default productionPlan
