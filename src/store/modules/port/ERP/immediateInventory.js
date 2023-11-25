import { defineStore } from "pinia";
import { getAllPage,add,update,deleteData,downloadSchemeManagement } from '@/api/port/ERP/immediateInventory'

const immediateInventory = defineStore(
    'immediateInventory',
    {
        state: () => ({
            immediateInventory: {
                data:  [],
                pages:1,
                total:0
                
            },
            outsourcedMaterial: {
                data: [],
                total: 0,
                pages:1
            },
            productionMaterial: {
                data: [],
                total: 0,
                pages:1
            },
            outsourcedOrder: {
                data: [],
                total: 0,
                pages:1
            },
            productionOrder: {
                data: [],
                total: 0,
                pages:1
            },
            purchaseRequest: {
                data: [],
                total: 0,
                pages:1
            },
            purchaseOrder: {
                data: [],
                total: 0,
                pages:1
            },
            receiveNotice: {
                data: [],
                total: 0,
                pages:1
            },
            inventoryLock: {
                data: [],
                total: 0,
                pages:1
            },
            materialBom: {
                data: [],
                total: 0,
                pages:1
            }
        }),
        actions: {
            getAllPage(page,size,type) {
                return new Promise((resolve, reject) => {
                    getAllPage(page, size, type).then(res => {
                        if (type == 1) {
                            if (res.code == 200) {
                                this.immediateInventory.data = res.data.list
                                this.immediateInventory.pages = res.data.pages
                                this.immediateInventory.total = res.data.total
                            }
                        }
                        else if (type == 2) {
                            if (res.code == 200) {
                                this.outsourcedMaterial.data = res.data.list
                                this.outsourcedMaterial.pages = res.data.pages
                                this.outsourcedMaterial.total = res.data.total
                            }
                        }
                        else if (type == 3) {
                            if (res.code == 200) {
                                this.productionMaterial.data = res.data.list
                                this.productionMaterial.pages = res.data.pages
                                this.productionMaterial.total = res.data.total
                            }
                        }
                        else if (type == 4) {
                            if (res.code == 200) {
                                this.outsourcedOrder.data = res.data.list
                                this.outsourcedOrder.pages = res.data.pages
                                this.outsourcedOrder.total = res.data.total
                            }
                        }
                        else if (type == 5) {
                            if (res.code == 200) {
                                this.productionOrder.data = res.data.list
                                this.productionOrder.pages = res.data.pages
                                this.productionOrder.total = res.data.total
                            }
                            
                        }
                        else if (type == 6) {
                            if (res.code == 200) {
                                this.purchaseRequest.data = res.data.list
                                this.purchaseRequest.pages = res.data.pages
                                this.purchaseRequest.total = res.data.total
                            }
                        }
                        else if (type == 7) {
                            if (res.code == 200) {
                                this.purchaseOrder.data = res.data.list
                                this.purchaseOrder.pages = res.data.pages
                                this.purchaseOrder.total = res.data.total
                            }
                        }
                        else if (type == 8) {
                            if (res.code == 200) {
                                this.receiveNotice.data = res.data.list
                                this.receiveNotice.pages = res.data.pages
                                this.receiveNotice.total = res.data.total
                            }
                        }
                        else if (type == 9) {
                            if (res.code == 200) {
                                this.inventoryLock.data = res.data.list
                                this.inventoryLock.pages = res.data.pages
                                this.inventoryLock.total = res.data.total
                            }
                        }
                        else if (type == 10) {
                            if (res.code == 200) {
                                this.materialBom.data = res.data.list
                                this.materialBom.pages = res.data.pages
                                this.materialBom.total = res.data.total
                            }
                        }
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            add(param,type) {
                return new Promise((resolve, reject) => {
                    add(param, type).then(res => {
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            update(param, type) {
                return new Promise((resolve, reject) => {
                    update(param, type).then(res => {
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            deleteData(param, type) {
                return new Promise((resolve, reject) => {
                    deleteData(param, type).then(res => {
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadSchemeManagement(param, type) {
                return new Promise((resolve, reject) => {
                    let fileName = ''
                    if (type == 1) {
                        fileName = '即时库存'
                    }
                    else if (type == 2) {
                        fileName = '委外用料清单列表'
                    }
                    else if (type == 3) {
                        fileName = '生产用料清单列表'
                    }
                    else if (type == 4) {
                        fileName = '委外订单列表'
                    }
                    else if (type == 5) {
                        fileName = '生产订单列表'
                    }
                    else if (type == 6) {
                        fileName = '采购申请单列表'
                    }
                    else if (type == 7) {
                        fileName = '采购订单列表'
                    }
                    else if (type == 8) {
                        fileName = '收料通知单列表'
                    }
                    else if (type == 9) {
                        fileName = '锁库存列表'
                    }
                    else if (type == 10) {
                        fileName = '物料清单列表'
                    }
                    downloadSchemeManagement(param, type,fileName).then(res => {
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            resetState() {
                // 重置状态逻辑
                this.$reset();
              },
        }
    }

)

export default immediateInventory

