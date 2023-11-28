import { defineStore } from "pinia";
import { getApsMachineTable,addOrUpdateApsMachineTable,deleteApsMachineTable } from '@/api/metaData/machineManagement'

const machineManagement = defineStore(
    'machineManagement',
    {
        state: () => ({
            machine: {
                data: [
                    // {
                    //     "id": 273,
                    //     "number": 1,
                    //     "available": "是",
                    //     "unavailableDates": ["2023-08-23 07:30:00 to 2023-08-23 19:30:00","2023-05-21 09:30:00 to 2023-06-29 15:30:00"],
                    //     "version": null,
                    //     "fMachineId": "20",
                    //     "fMachineName": "SYTFGZZ006",
                    //     "fProductFamily": "tf-02-i",
                    //     "fProcessId": "117",
                    //     "fProcess": "尾线安装",
                    //     "fMachineConfiguration": "TF02尾线压合工装",
                    //     "fWorkshop": "组装车间"
                    // },
                    // {
                    //     "id": 418,
                    //     "number": 2,
                    //     "available": "是",
                    //     "unavailableDates": [],
                    //     "version": null,
                    //     "fMachineId": null,
                    //     "fMachineName": "SYTFSDJ004",
                    //     "fProductFamily": "tf-02-i",
                    //     "fProcessId": "90",
                    //     "fProcess": "发射/接受透镜固定",
                    //     "fMachineConfiguration": "半自动点胶机",
                    //     "fWorkshop": "组装车间"
                    // },
                    // {
                    //     "id": 417,
                    //     "number": 3,
                    //     "available": "是",
                    //     "unavailableDates": [],
                    //     "version": null,
                    //     "fMachineId": null,
                    //     "fMachineName": "\t SYTFZZZ009",
                    //     "fProductFamily": "tf-02-i",
                    //     "fProcessId": "133",
                    //     "fProcess": "转接板分板",
                    //     "fMachineConfiguration": "分板治具",
                    //     "fWorkshop": "组装车间"
                    // },
                    // {
                    //     "id": 416,
                    //     "number": 4,
                    //     "available": "是",
                    //     "unavailableDates": "",
                    //     "unavailableTime": "",
                    //     "version": null,
                    //     "fMachineId": null,
                    //     "fMachineName": "SYTFSDJ004",
                    //     "fProductFamily": "tf-02-i",
                    //     "fProcessId": "95",
                    //     "fProcess": "后壳安装",
                    //     "fMachineConfiguration": "半自动点胶机",
                    //     "fWorkshop": "组装车间"
                    // },
                ],
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
            }
        }
    }
)

export default machineManagement