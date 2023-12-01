import { defineStore } from "pinia";
import {
    getApsMachineTable, addOrUpdateApsMachineTable,downloadMachineTableTemplate,
    deleteApsMachineTable,downloadApsMachineTable,importMachineTable
} from '@/api/metaData/machineManagement'

const machineManagement = defineStore(
    'machineManagement',
    {
        state: () => ({
            machine: {
                data: [],
                pages: 1,
                total:1
            }
        }),
        actions: {
            getApsMachineTable(page,size) {
                return new Promise((resolve, reject) => {
                    getApsMachineTable(page,size).then(res => {
                        this.machine.data = res.data.apsProductFamilyMachineTables
                        this.machine.pages = res.data.pages
                        this.machine.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdateApsMachineTable(data) {
                return new Promise((resolve, reject) => {
                    addOrUpdateApsMachineTable(data).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            deleteApsMachineTable(list) {
                return new Promise((resolve, reject) => {
                    deleteApsMachineTable(list).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadApsMachineTable(param) {
                return new Promise((resolve, reject) => {
                    downloadApsMachineTable(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            importMachineTable(param) {
                return new Promise((resolve, reject) => {
                    importMachineTable(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            downloadMachineTableTemplate(param) {
                return new Promise((resolve, reject) => {
                    downloadMachineTableTemplate(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            }
        }
    }
)

export default machineManagement