import { defineStore } from 'pinia'
import { getGttData, getProductGanttData } from '@/api/gtt'

const useGtt = defineStore('gtt', {
    state: () => ({
        product: [], //测试接口数据
        productGanttData: [] //生产甘特图数据
    }),
    actions: {
        // 获取测试接口数据
        getGttData() {
            return new Promise((resolve, reject) => {
                getGttData()
                    .then((res) => {
                        if (res.code == 200) {
                            console.log('请求数据')
                            this.product = res.data
                        }
                        resolve(res)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
        // 获取生产甘特图数据
        getProductGanttData(product) {
            return new Promise((resolve, reject) => {
                getProductGanttData(product)
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
export default useGtt
