import { getToken } from './auth'
import { ref } from 'vue'
import axios from 'axios'

// 自动补全方法
const searchResult = ref([])
const querySearch = (tableId, colId, searchUrl) => {
    const querySearch = async (queryString, cb) => {
        // 拼接axios请求
        // const baseUrl = 'https://www.apsceshi.benewake.top/benewake'
        const baseUrl = 'https://www.aps.benewake.top/benewake'
        // const baseUrl = 'https://aps.benewake.com/benewake'
        const apiUrl = baseUrl + searchUrl
        axios
            .post(
                apiUrl,
                {
                    tableId: tableId,
                    colId: colId,
                    value: queryString
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        token: getToken()
                    }
                }
            )
            .then((res) => {
                // console.log(res.data.data, 'searchResult')
                searchResult.value = res.data.data.map((item) => ({
                    value: item
                }))
                cb(searchResult.value)
                // console.log(searchResult.value, 'searchResult')
            })
    }
    return querySearch
}

const querySearchMaterialName = async (item) => {
    // /material/getMaterialLike/
    const baseUrl =
        'https://www.aps.benewake.top/benewake/material/getMaterialLike/'
    const apiUrl = baseUrl + item.value
    const res = await axios.get(apiUrl, {
        headers: {
            'Content-Type': 'application/json',
            token: getToken()
        }
    })
    if (res.data) {
        return res.data
    }
}
export { querySearch, querySearchMaterialName }
