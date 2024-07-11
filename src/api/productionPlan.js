import request from '@/utils/request'
import { download } from '@/utils/request'
import { getToken } from '@/utils/auth'
import { getVersionNum } from '../store/modules/productionPlan'
import productionPlan from '@/store/modules/productionPlan'



const chColNameTOSearchName = {
    '任务号': 'f_task_id',
    '任务来源': 'f_task_source_id',
    '物料编码': 'f_material_code',
    '物料名称': 'material.f_material_name',
    '总数量': 'f_total_quantity',
    '完成数量': 'f_completed_quantity',
    '实际开始时间': 'f_actual_start_time',
    '实际完成时间': 'f_actual_completion_time',
    '需入库时间': 'f_required_delivery_time',
    '是否按时完成': 'f_on_time_completion',
    '延期天数': 'f_delay_days',
    '优先级': 'f_priority',
    '未完成原因': 'f_unfinished_reason',
    '所包含订单': 'f_related_orders',
    '版本号': 'version',

}
export function getProductionFiltrate(param, pages, size) {
    let filterCriteriaList = []
    let requestData = {}
    const production = productionPlan()

    filterCriteriaList = param.cols?.map(col => ({
        colName: chColNameTOSearchName[col.chColName],
        condition: col.valueOperator,
        //如果中文名字是版本号,那么还需要用getVersion函数进行处理
        // value: col.colValue
        value: col.chColName === '版本号' ? getVersionNum(production.versionNumToName, col.colValue) : col.colValue
    }));

    requestData = {
        filterCriteriaList: filterCriteriaList,
        page: pages,
        size: size
    };
    return request({
        url: `/scResult/getProductionPlan`,
        method: 'post',
        data: requestData
    });
}

export function semiFinishedGoodsFiltrate(param, pages, size) {
    return request({
        url: `/scResult/semiFinishedGoodsFiltrate/${pages}/${size}`,
        method: 'post',
        data: param
    })
}

// 成品缺料分析
export function materialShortageAnalysisFiltrate(param, pages, size) {
    return request({
        url: `/scResult/materialShortageAnalysisFiltrate/${pages}/${size}`,
        method: 'post',
        data: param
    })
}
//半成品缺料分析
export function semiMaterialShortageFiltrate(param, pages, size) {
    return request({
        url: `/scResult/semiMaterialShortageFiltrate/${pages}/${size}`,
        method: 'post',
        data: param
    })
}
// 导出生产计划和FIM优先级
export function downloadTable(param) {
    let fileName = ''
    if (param.tableId == 48) {
        fileName = 'FIM优先级'
    } else if (param.tableId == 40) {
        fileName = '成品生产计划'
    } else if (param.tableId == 42) {
        fileName = '半成品生产计划'
    } else if (param.tableId == 44) {
        fileName = '成品缺料分析'
    } else if (param.tableId == 46) {
        fileName = '半成品缺料分析'
    }
    // 使用封装的 download 方法
    return download('/scResult/download', param, fileName, {
        headers: {
            token: getToken()
        }
    })
}
