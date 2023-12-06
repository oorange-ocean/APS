import request from '@/utils/request'

export function getAllPage(page,size) {
    return request({
        url: `attendance/list/${page}/${size}`,
        method:'get'
    })
}

export function addOrUpdate(param) {
    return request({
        url: 'attendance/addOrUpdate',
        method: 'post',
        data:param
    })
}

export function remove(param) {
    return request({
        url: 'attendance/remove',
        method: 'post',
        data:param
    })
}