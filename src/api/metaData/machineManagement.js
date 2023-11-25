import request from '@/utils/request'

export function getApsMachineTable(pages,size) {
    return request({
        url: `/machine/getApsMachineTable/${pages}/${size}`,
        method: 'get',
    })
}

export function addOrUpdateApsMachineTable(data) {
    return request({
        url: `/machine/addOrUpdateApsMachineTable`,
        method: 'post',
        data:data
    })
}
export function deleteApsMachineTable(list) {
    return request({
        url: `/machine/deleteApsMachineTable`,
        method: 'post',
        data:list
    })
}