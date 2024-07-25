import { defineStore } from 'pinia'
import {
    getProductionFiltrate,
    semiFinishedGoodsFiltrate,
    semiMaterialShortageFiltrate,
    materialShortageAnalysisFiltrate,
    downloadTable
} from '@/api/productionPlan'
import { getCols, getViews } from '@/api/commonPlan'

function getVersionMap(records) {
    let versionMap = {}
    //首先对version进行去重,然后根据映射关系进行转换,数字由低到高分别对应"版本一" 到 "版本五"
    //例如150，151，152，154，153,对应版本一，版本二，版本三，版本五，版本四
    let versions = records.map((item) => item.version)
    versions = [...new Set(versions)]
    versions.sort((a, b) => a - b)
    let versionName = ['版本1', '版本2', '版本3', '版本4', '最大版本']
    versions.forEach((item, index) => {
        versionMap[item] = versionName[index]
    })
    return versionMap
}
// 根据中文版本号和 versionNumToName 获取对应的数字版本号
function getVersionNum(versionNumToName, versionName) {
    console.log('versionNumToName', versionNumToName, 'versionName', versionName)
    let versionNum = ''
    for (let key in versionNumToName) {
        if (versionNumToName[key] === versionName) {
            versionNum = key
        }
    }
    return versionNum
}

// 根据数字版本号和 versionNumToName 获取对应的中文版本号
function getVersionName(records, versionNumToName) {
    records.forEach(item => {
        item.version = versionNumToName[item.version]
    })
    return records
}

const productionPlan = defineStore('productionPlan', {
    state: () => ({
        tables: {
            40: 'productPlan'
        },
        searchResult: [],
        //版本号很版本简称的对应
        versionNumToName: {},
        productPlan: {
            data: [],
            pages: 1,
            total: 0,
            // 所有列名
            column: [],
            // 所有视图
            views: [],
            // 视图的列名（包含了筛选条件）
            viewColumn: [],
            defaultViewId: null,
            defaultViewName: '',
            //版本号的对应
            versionMap: {}
        },

        semiFinishedProducts: {
            data: [],
            pages: 1,
            total: 0,
            column: [],
            views: [],
            viewColumn: [],
            defaultViewId: null,
            defaultViewName: ''
        },

        productPlanMaterialShort: {
            data: [],
            pages: 1,
            total: 0,
            column: [],
            views: [],
            viewColumn: [],
            defaultViewId: null,
            defaultViewName: ''
        },

        sFMaterialShort: {
            data: [],
            total: 0,
            pages: 1,
            column: [],
            views: [],
            viewColumn: [],
            defaultViewId: null,
            defaultViewName: ''
        }
    }),
    actions: {
        getCols(tableId) {
            return new Promise((resolve, reject) => {
                getCols(tableId)
                    .then((res) => {
                        if (res.code == 200) {
                            if (tableId == 40) {
                                this.productPlan.column = res.data
                            } else if (tableId == 42) {
                                this.semiFinishedProducts.column = res.data
                            } else if (tableId == 44) {
                                this.productPlanMaterialShort.column = res.data
                            } else if (tableId == 46) {
                                this.sFMaterialShort.column = res.data
                            }
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getViews(tableId) {
            return new Promise((resolve, reject) => {
                getViews(tableId)
                    .then((res) => {
                        if (res.code == 200) {
                            if (tableId == 40) {
                                this.productPlan.views = res.data.viewTableVos
                                this.productPlan.defaultViewId = res.data.defaultViewId
                                this.productPlan.defaultViewName = res.data.defaultViewName
                            } else if (tableId == 42) {
                                this.semiFinishedProducts.views = res.data.viewTableVos
                                this.semiFinishedProducts.defaultViewId = res.data.defaultViewId
                                this.semiFinishedProducts.defaultViewName =
                                    res.data.defaultViewName
                            } else if (tableId == 44) {
                                this.productPlanMaterialShort.views = res.data.viewTableVos
                                this.productPlanMaterialShort.defaultViewId =
                                    res.data.defaultViewId
                                this.productPlanMaterialShort.defaultViewName =
                                    res.data.defaultViewName
                            } else if (tableId == 46) {
                                this.sFMaterialShort.views = res.data.viewTableVos
                                this.sFMaterialShort.defaultViewId = res.data.defaultViewId
                                this.sFMaterialShort.defaultViewName = res.data.defaultViewName
                            }
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        getProductionFiltrate(param, page, size) {
            return new Promise((resolve, reject) => {
                getProductionFiltrate(param, page, size)
                    .then((res) => {
                        if (!param.cols) {
                            this.versionNumToName = getVersionMap(res.records)
                        }
                        //将版本号转换为1-5简称
                        this.productPlan.data = getVersionName(res.records, this.versionNumToName)
                        this.productPlan.pages = res.pages
                        this.productPlan.total = res.total
                        //如果param.cols不存在,则说明是全部请求,将versionMap存储到versionNumToName
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        semiFinishedGoodsFiltrate(param, page, size) {
            return new Promise((resolve, reject) => {
                semiFinishedGoodsFiltrate(param, page, size)
                    .then((res) => {
                        if (res.code == 200) {
                            this.semiFinishedProducts.data = res.data.list
                            this.semiFinishedProducts.pages = res.data.pages
                            this.semiFinishedProducts.total = res.data.total
                            if (!param.cols) {
                                this.semiFinishedProducts.viewColumn = res.data.columnTables
                            }
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        materialShortageAnalysisFiltrate(param, page, size) {
            return new Promise((resolve, reject) => {
                materialShortageAnalysisFiltrate(param, page, size)
                    .then((res) => {
                        if (res.code == 200) {
                            this.productPlanMaterialShort.data = res.data.list
                            this.productPlanMaterialShort.pages = res.data.pages
                            this.productPlanMaterialShort.total = res.data.total
                            if (!param.cols) {
                                this.productPlanMaterialShort.viewColumn = res.data.columnTables
                            }
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        semiMaterialShortageFiltrate(param, page, size) {
            return new Promise((resolve, reject) => {
                semiMaterialShortageFiltrate(param, page, size)
                    .then((res) => {
                        if (res.code == 200) {
                            this.sFMaterialShort.data = res.data.list
                            this.sFMaterialShort.pages = res.data.pages
                            this.sFMaterialShort.total = res.data.total
                            if (!param.cols) {
                                this.sFMaterialShort.viewColumn = res.data.columnTables
                            }
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        downloadTable(param) {
            return new Promise((resolve, reject) => {
                downloadTable(param)
                    .then((res) => {

                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        }
    }
})

export default productionPlan
//导出getVersion函数
export { getVersionNum }
