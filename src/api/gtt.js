import request from '@/utils/request'

export function getGttData() {
    return request({
        url: '/scResult/getProductionPlanSort',
        method: 'get'
    })
}

// 获取生产甘特图数据
export function getProductGanttData(product) {
    return request({
        url: '/gantt/getProductGanttData',
        method: 'post',
        params: {
            product
        }
    })
}
