import request from "@/utils/request";

export function getProductionPlan(pages,size) {
    return request({    
        url: `/scResult/getProductionPlan/${pages}/${size}`,
        method: 'get',
    })
}

export function getSemiFinishedGoodsProductionPlan(pages,size) {
    return request({    
        url: `/scResult/getSemiFinishedGoodsProductionPlan/${pages}/${size}`,
        method: 'get',
    })
}
// 成品分析
export function getMaterialShortageAnalysis(pages,size) {
    return request({    
        url: `/scResult/getMaterialShortageAnalysis/${pages}/${size}`,
        method: 'get',
    })
}

export function getSemiFinishedGoodsMaterialShortageAnalysis(pages,size) {
    return request({    
        url: `scResult/getSemiFinishedGoodsMaterialShortageAnalysis/${pages}/${size}`,
        method: 'get',
    })
}