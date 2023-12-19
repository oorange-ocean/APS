import request from "@/utils/request";

export function getProductionPlan(pages,size) {
    return request({    
        url: `/scResult/getProductionPlan/${pages}/${size}`,
        method: 'get',
    })
}

export function getProductionFiltrate(param,pages,size) {
    return request({    
        url: `/scResult/getProductionFiltrate/${pages}/${size}`,
        method: 'post',
        data:param
    })
}

export function semiFinishedGoodsFiltrate(param,pages,size) {
    return request({
        url: `/scResult/semiFinishedGoodsFiltrate/${pages}/${size}`,
        method: 'post',
        data:param
    })
}

// 成品缺料分析
export function materialShortageAnalysisFiltrate(param,pages,size) {
    return request({
        url: `/scResult/materialShortageAnalysisFiltrate/${pages}/${size}`,
        method: 'post',
        data:param
    })
}
//半成品缺料分析
export function semiMaterialShortageFiltrate(param,pages,size) {
    return request({
        url: `/scResult/semiMaterialShortageFiltrate/${pages}/${size}`,
        method: 'post',
        data:param
    })
}


// // 模糊查询自动补全
// export function searchLike(param) {
//     return request({    
//         url: `/scResult/searchLike`,
//         method: 'post',
//         data:param
//     })
// }

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