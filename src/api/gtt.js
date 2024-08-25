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

//获取某一批生产的详细数据
// /gantt/getProductGanttDetailData?taskId=1 get方法
// 获取某一批生产的详细数据
export function getProductGanttDetailData(taskId) {
    return request({
        url: `/gantt/getProductGanttDetailData?taskId=${taskId}`,
        method: 'get'
    })
}
