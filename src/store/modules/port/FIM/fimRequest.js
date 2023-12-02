import { defineStore } from 'pinia'
import {
    getFimRequestPage, addOrUpdateFimRequest,importInterfaceData,downloadFimPriority,
    removeFimRequest,downloadFimRequest,fimRequestTemplate,getFimPriority
} from '@/api/port/FIM/fimRequest'
import { reject } from 'lodash'

const fimRequest = defineStore('immediateInventory', {
    state: () => ({
        fimRequest: {
            data: [],
            pages: 1,
            total: 0
        },
        fimPriority: {
            data: [],
            pages: 1,
            total: 0
        }
    }),
    actions: {
        getFimRequestPage(page,size) {
            return new Promise((resolve, reject) => {
                getFimRequestPage(page,size).then(res => {
                    if (res.code == 200) {
                        this.fimRequest.data = res.data.list
                        this.fimRequest.pages = res.data.pages
                        this.fimRequest.total = res.data.total
                    }
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        getFimPriority(page,size) {
            return new Promise((resolve, reject) => {
                getFimPriority(page,size).then(res => {
                    if (res.code == 200) {
                        this.fimPriority.data = res.data.list
                        this.fimPriority.pages = res.data.pages
                        this.fimPriority.total = res.data.total
                    }
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        addOrUpdateFimRequest(param) {
            return new Promise((resolve, reject) => {
                addOrUpdateFimRequest(param).then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        removeFimRequest(param) {
            return new Promise((resolve, reject) => {
                removeFimRequest(param).then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        downloadFimRequest(param) {
            return new Promise((resolve, reject) => {
                downloadFimRequest(param).then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        fimRequestTemplate() {
            return new Promise((resolve, reject) => {
                fimRequestTemplate().then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        importInterfaceData(param) {
            return new Promise((resolve, reject) => {
                importInterfaceData(param).then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        },
        downloadFimPriority(param) {
            return new Promise((resolve, reject) => {
                downloadFimPriority(param).then(res => {
                    
                    resolve(res)
                }).catch(error => {
                    
                    reject(error)
                })
            })
        }
    }
})

export default fimRequest