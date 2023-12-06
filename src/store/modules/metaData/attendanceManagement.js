import { defineStore } from "pinia";
import {
    getAllPage,addOrUpdate,remove
} from '@/api/metaData/attendanceManagement'

const attendanceManagement = defineStore(
    'attendanceManagement',
    {
        state: () => ({
            attendance: {
                data: [],
                pages: 1,
                total: 1
            }
        }),
        actions: {
            getAllPage(page,size) {
                return new Promise((resolve, reject) => {
                    getAllPage(page,size).then(res => {
                        this.attendance.data = res.data.list
                        this.attendance.pages = res.data.pages
                        this.attendance.total = res.data.total
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            addOrUpdate(param){
                return new Promise((resolve, reject) => {
                    addOrUpdate(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            },
            remove(param) {
                return new Promise((resolve, reject) => {
                    remove(param).then(res => {
                        
                        resolve(res)
                    }).catch(error => {
                        
                        reject(error)
                    })
                })
            }
        }
    }
)
export default attendanceManagement