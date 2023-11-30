import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getAllPage,
  add,
  update,
  deleteData,
  downloadSchemeManagement,
  importInterfaceData,
  downloadInterfaceTemplate
} from '@/api/port/ERP/immediateInventory'

function getFileName(type) {
  let fileName = ''
  if (type == 1) {
    fileName = '即时库存'
  } else if (type == 2) {
    fileName = '委外用料清单列表'
  } else if (type == 3) {
    fileName = '生产用料清单列表'
  } else if (type == 4) {
    fileName = '委外订单列表'
  } else if (type == 5) {
    fileName = '生产订单列表'
  } else if (type == 6) {
    fileName = '采购申请单列表'
  } else if (type == 7) {
    fileName = '采购订单列表'
  } else if (type == 8) {
    fileName = '收料通知单列表'
  } else if (type == 9) {
    fileName = '锁库存列表'
  } else if (type == 10) {
    fileName = '物料清单列表'
  } else if (type == 11) {
    fileName = '出库申请单'
  } else if (type == 20) {
    fileName = 'PCBA烧录'
  } else if (type == 21) {
    fileName = 'TFmini-S-PCBA烧录'
  } else if (type == 22) {
    fileName = 'PCBA分版'
  } else if (type == 23) {
    fileName = 'TFmini-S-PCBA分版'
  } else if (type == 24) {
    fileName = '安装主板'
  } else if (type == 25) {
    fileName = 'TFmini-S-安装主板'
  } else if (type == 26) {
    fileName = '贴SN'
  } else if (type == 27) {
    fileName = 'TFmini-S-贴SN'
  } else if (type == 28) {
    fileName = '校准测试'
  } else if (type == 29) {
    fileName = 'TFmini-S-校准测试'
  } else if (type == 30) {
    fileName = '包装校验'
  } else if (type == 31) {
    fileName = 'TFmini-S-包装校验'
  } else if (type == 32) {
    fileName = 'TFmini-S-主板固定'
  }

  return fileName
}

const immediateInventory = defineStore('immediateInventory', {
  state: () => ({
    immediateInventory: {
      data: [],
      pages: 1,
      total: 0
    },
    outsourcedMaterial: {
      data: [],
      total: 0,
      pages: 1
    },
    productionMaterial: {
      data: [],
      total: 0,
      pages: 1
    },
    outsourcedOrder: {
      data: [],
      total: 0,
      pages: 1
    },
    productionOrder: {
      data: [],
      total: 0,
      pages: 1
    },
    purchaseRequest: {
      data: [],
      total: 0,
      pages: 1
    },
    purchaseOrder: {
      data: [],
      total: 0,
      pages: 1
    },
    receiveNotice: {
      data: [],
      total: 0,
      pages: 1
    },
    inventoryLock: {
      data: [],
      total: 0,
      pages: 1
    },
    materialBom: {
      data: [],
      total: 0,
      pages: 1
    },
    outboundApplication: {
      data: [],
      total: 0,
      pages: 1
    },

    // MES
    pcbaBurn: {
      data: [
        // {
        //   productionOrderNumber: 'SCDD2023111646',
        //   materialCode: '13.01.07.008',
        //   materialName: 'TF-Luna-ASU',
        //   burnInCompletionQuantity: '1459',
        //   burnQualifiedCount: '1459',
        //   unburnQualifiedCount: null, //烧录不合格数
        //   burnFixtureNumber: 'SYTFGSX008',
        //   totalNumber: null, //订单总数
        //   version: '即时版本'
        // }
      ],
      total: 0,
      pages: 1
    },
    tfminsPcbaBurn: {
      data: [],
      total: 0,
      page:1
    },
    pcbaVersion: {
      data: [],
      total: 0,
      page:1
    },
    tfminisPcbaVersion: {
      data: [],
      total: 0,
      page:1
    },
    installationBoard: {
      data: [],
      total: 0,
      page:1
    },
    tfminisInstallationBoard: {
      data: [],
      total: 0,
      page:1
    },
    snLabeling: {
      data: [],
      total: 0,
      page:1
    },
    tfminisSnLabeling: {
      data: [],
      total: 0,
      page:1
    },
    calibrationTests: {
      data: [],
      total: 0,
      page:1
    },
    tfminisCalibrationTests: {
      data: [],
      total: 0,
      page:1
    },
    packagingTest: {
      data: [],
      total: 0,
      page:1
    },
    tfminisPackagingTest: {
      data: [],
      total: 0,
      page:1
    },
  }),
  actions: {
    getAllPage(page, size, type) {
      return new Promise((resolve, reject) => {
        getAllPage(page, size, type)
          .then((res) => {
            if (res.code == 200) {
              if (type == 1) {
                this.immediateInventory.data = res.data.list
                this.immediateInventory.pages = res.data.pages
                this.immediateInventory.total = res.data.total
              } else if (type == 2) {
                this.outsourcedMaterial.data = res.data.list
                this.outsourcedMaterial.pages = res.data.pages
                this.outsourcedMaterial.total = res.data.total
              } else if (type == 3) {
                this.productionMaterial.data = res.data.list
                this.productionMaterial.pages = res.data.pages
                this.productionMaterial.total = res.data.total
              } else if (type == 4) {
                this.outsourcedOrder.data = res.data.list
                this.outsourcedOrder.pages = res.data.pages
                this.outsourcedOrder.total = res.data.total
              } else if (type == 5) {
                this.productionOrder.data = res.data.list
                this.productionOrder.pages = res.data.pages
                this.productionOrder.total = res.data.total
              } else if (type == 6) {
                this.purchaseRequest.data = res.data.list
                this.purchaseRequest.pages = res.data.pages
                this.purchaseRequest.total = res.data.total
              } else if (type == 7) {
                this.purchaseOrder.data = res.data.list
                this.purchaseOrder.pages = res.data.pages
                this.purchaseOrder.total = res.data.total
              } else if (type == 8) {
                this.receiveNotice.data = res.data.list
                this.receiveNotice.pages = res.data.pages
                this.receiveNotice.total = res.data.total
              } else if (type == 9) {
                this.inventoryLock.data = res.data.list
                this.inventoryLock.pages = res.data.pages
                this.inventoryLock.total = res.data.total
              } else if (type == 10) {
                this.materialBom.data = res.data.list
                this.materialBom.pages = res.data.pages
                this.materialBom.total = res.data.total
              } else if (type == 11) {
                this.outboundApplication.data = res.data.list
                this.outboundApplication.pages = res.data.pages
                this.outboundApplication.total = res.data.total
              }

              // MES
              else if (type == 20) {
                this.pcbaBurn.data = res.data.list
                this.pcbaBurn.pages = res.data.pages
                this.pcbaBurn.total = res.data.total
              }
              else if (type == 21) {
                this.tfminsPcbaBurn.data = res.data.list
                this.tfminsPcbaBurn.pages = res.data.pages
                this.tfminsPcbaBurn.total = res.data.total
              }
              else if (type == 22) {
                this.pcbaVersion.data = res.data.list
                this.pcbaVersion.pages = res.data.pages
                this.pcbaVersion.total = res.data.total
              }
              else if (type == 23) {
                this.tfminisPcbaVersion.data = res.data.list
                this.tfminisPcbaVersion.pages = res.data.pages
                this.tfminisPcbaVersion.total = res.data.total
              }
              else if (type == 24) {
                this.installationBoard.data = res.data.list
                this.installationBoard.pages = res.data.pages
                this.installationBoard.total = res.data.total
              }
              else if (type == 25) {
                this.tfminisInstallationBoard.data = res.data.list
                this.tfminisInstallationBoard.pages = res.data.pages
                this.tfminisInstallationBoard.total = res.data.total
              }
              else if (type == 26) {
                this.snLabeling.data = res.data.list
                this.snLabeling.pages = res.data.pages
                this.snLabeling.total = res.data.total
              }
              else if (type == 27) {
                this.tfminisSnLabeling.data = res.data.list
                this.tfminisSnLabeling.pages = res.data.pages
                this.tfminisSnLabeling.total = res.data.total
              }
              else if (type == 28) {
                this.calibrationTests.data = res.data.list
                this.calibrationTests.pages = res.data.pages
                this.calibrationTests.total = res.data.total
              }
              else if (type == 29) {
                this.tfminisCalibrationTests.data = res.data.list
                this.tfminisCalibrationTests.pages = res.data.pages
                this.tfminisCalibrationTests.total = res.data.total
              }
              else if (type == 30) {
                this.packagingTest.data = res.data.list
                this.packagingTest.pages = res.data.pages
                this.packagingTest.total = res.data.total
              }
              else if (type == 31) {
                this.tfminisPackagingTest.data = res.data.list
                this.tfminisPackagingTest.pages = res.data.pages
                this.tfminisPackagingTest.total = res.data.total
              }
            }

            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    add(param, type) {
      return new Promise((resolve, reject) => {
        add(param, type)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    update(param, type) {
      return new Promise((resolve, reject) => {
        update(param, type)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    deleteData(param, type) {
      return new Promise((resolve, reject) => {
        deleteData(param, type)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    downloadSchemeManagement(param, type) {
      return new Promise((resolve, reject) => {
        const fileName = getFileName(type)
        downloadSchemeManagement(param, type, fileName)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    resetState() {
      // 重置状态逻辑
      this.$reset()
    },
    // 导入
    importInterfaceData(param, code) {
      return new Promise((resolve, reject) => {
        importInterfaceData(param, code)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    downloadInterfaceTemplate(type, param) {
      const fileName = getFileName(type) + '导入模板'
      return new Promise((resolve, reject) => {
        downloadInterfaceTemplate(type, param, fileName)
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

export default immediateInventory
