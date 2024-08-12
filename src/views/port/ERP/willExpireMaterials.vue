<template>
    <div class="container">
        <div class="head">
            <button @click="fresh"><span>刷新</span></button>
        </div>
        <div class="main" ref="tableContainer">
            <div class="common" ref="commonPlan">
                <common-plan class="plan" :columnNames="ImmediateInventory.willExpireMaterials.column"
                    :viewColumn="ImmediateInventory.willExpireMaterials.viewColumn" :currentViewId="-1"
                    :currentViewName="currentViewName" :apiUrl="'/interface/searchLike'" :currentTableId="8"
                    :currentOrder="currentOrder" @lookView="lookView" @searchView="searchView"
                    @getCurrentOption="getCurrentOption" />
            </div>
            <el-table ref="myTable" :data="ImmediateInventory.willExpireMaterials.data" border
                :row-class-name="tableRowClassName" :cell-style="{ borderColor: '#9db9d6', textAlign: 'center' }"
                :header-cell-style="{
                    borderColor: '#9db9d6',
                    background: '#d9e9f8',
                    color: '#000',
                    textAlign: 'center',
                    fontWeight: '500'
                }" row-key="id" :max-height="tableMaxHeight" @selection-change="handleChange"
                @sort-change="onSortChange">
                <el-table-column v-for="column in columnConfig" :key="column.prop" :prop="column.prop"
                    :label="column.label" :minWidth="column.minWidth" :sortable="column.sortable"
                    :sort-orders="column.sortOrders">
                    <template v-slot:header="{ column }">
                        <div>
                            {{ column.label }}
                            <span v-html="renderSortIcon(column)"></span>
                        </div>
                    </template>
                    <template v-slot:default="scope">
                        <span v-if="scope.row.editable">
                            <el-input v-model="scope.row[column.prop]" />
                        </span>
                        <span v-else>
                            <span v-if="column.prop === 'expireDays'">
                                <span>{{ formatExpireDays(scope.row[column.prop]) }}
                                </span>
                            </span>
                            <span v-else>{{ scope.row[column.prop] }}</span>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bottom" :style="{
                width: userMenu.isCollapse
                    ? 'calc(100vw - 50px)'
                    : 'calc(100vw - 250px)'
            }">
                <Pagination :total="ImmediateInventory.willExpireMaterials.pages" @change-page="handlePages"
                    @update-size="handleSizeChange" :totalRows="ImmediateInventory.willExpireMaterials.total"
                    :currentPage="currentPage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ref,
    onUnmounted,
    onMounted,
    reactive,
    computed,
    onBeforeUnmount
} from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import { renderSortIcon } from '@/utils/sortIcon'
import useImmediateInventory from '../../../store/modules/port/ERP/immediateInventory'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'
import useUserMenu from '@/store/modules/menu'
import { columnConfig, selectFormConfig } from '@/columnConfig/ERP/willExpireMaterials'
const userMenu = useUserMenu()
const ImmediateInventory = useImmediateInventory()

let currentPage = ref(1)
let currentSize = ref(100)
let currentViewId = ref(null) //当前视图id
let currentViewName = ref('') //当前视图名字
const plan = ref({}) //当前方案各个列的true和false
const tableContainer = ref(null) //点击其他视图或者点击下一页时自动滑动到顶部
const commonPlan = ref(null)
const commonPlanHeight = ref(0)
const tableId = ref(8)
const localCurrentOption = ref([]) //子组件中传过来的currentOption
const currentOrder = ref({}) //当前排序的字段
let column = reactive([]) //所有列名
let viewColumn = reactive([]) //当前视图的所拥有的列名

//对expiredays进行处理
//负数：已过期xx天
//0：今天到期
//正数：还有xx天到期
function formatExpireDays(days) {
    if (days < 0) {
        return `已过期${Math.abs(days)}天`
    } else if (days === 0) {
        return '今天到期'
    } else {
        return `还有${days}天到期`
    }
}

// 修改表格选中行的样式
// 这个方法返回一个类名，基于行是否被选中
function tableRowClassName({ row }) {
    let className = '';

    // 检查 expireDays 是否为正数
    if (row.expireDays > 0) {
        className += 'positive-expire-days';
    }

    return className.trim(); // 移除可能的尾随空格
}

// 获取到子组件中currentOption的值
function getCurrentOption(currentOption) {
    localCurrentOption.value = currentOption
}

// 字段的排序
function onSortChange(sortDetails) {
    // prop 即为当前排序的字段
    // order 即为排序的方式
    // 1. 升序 order = 'ascending'
    // 2. 降序 order = 'descending'
    // 3. 取消排序 order = null
    //子组件传过来currentOption,还有根据prop对应column中的voColName,提取出colId

    let param = {
        "groupFilters": [{
            "colName": sortDetails.prop,
            "condition": sortDetails.order,
        }]
    }

    // 判断有没有筛选条件，传的参数不一样
    if (localCurrentOption.value) {
        // param.cols.push(...localCurrentOption.value)
        // console.log(localCurrentOption)
        const days = localCurrentOption.value.find(item => item.voColName === 'days');
        const filters = localCurrentOption.value
            .filter(item => item.voColName !== 'days')
            .map(({ voColName, valueOperator, colValue }) => ({
                colName: voColName,
                condition: valueOperator,
                value: colValue
            }));
        param.days = days ? days.colValue : '7';
        param.filters = filters;
    }

    // console.log(localCurrentOption.value, 'localCurrentOption.value')
    ImmediateInventory.getWillExpireMaterials(
        param,
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
            if (res.code == 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                })
            } else {
                const scrollContainer = tableContainer.value.querySelector(
                    '.el-scrollbar__wrap'
                )
                if (scrollContainer) {
                    scrollContainer.scrollTop = 0 // 滚动到顶部
                }
                console.log('获取成品計劃数据成功')
            }
        })
        .catch((error) => { })
}

// 动态计算表格高度
const tableMaxHeight = computed(() => {
    return `calc(100vh - ${190 + commonPlanHeight.value}px)`
})

onMounted(() => {
    const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
            commonPlanHeight.value = entry.target.offsetHeight
        }
    })

    if (commonPlan.value) {
        observer.observe(commonPlan.value)
    }

    onBeforeUnmount(() => {
        if (commonPlan.value) {
            observer.unobserve(commonPlan.value)
        }
    })
})

// 给剩余的列拼上false
function transformColumns(column, viewColumn) {
    // 从 column1 创建初始对象，所有值设为 false
    const result = column.reduce((acc, item) => {
        acc[item.voColName] = false
        return acc
    }, {})

    // 更新 result 对象，将 scheme1 中存在的字段设置为 true
    viewColumn.forEach((col) => {
        if (col.voColName in result) {
            result[col.voColName] = true
        }
    })
    return result
}

// 查看视图
function lookView(viewId, viewName) {
    currentViewId.value = viewId
    currentViewName.value = viewName
    currentPage.value = 1
    ImmediateInventory.getWillExpireMaterials(
        {

            // tableId: tableId.value,
            // viewId: currentViewId.value
        },
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
            if (res.code == 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                })
            }

            const scrollContainer = tableContainer.value.querySelector(
                '.el-scrollbar__wrap'
            )
            if (scrollContainer) {
                scrollContainer.scrollTop = 0 // 滚动到顶部
            }
        })
        .catch((error) => { })

    // console.log(viewId,viewName,'111')
}
// 搜索视图
function searchView(param) {
    currentPage.value = 1;

    const days = param.cols.find(item => item.voColName === 'days');
    const filters = param.cols
        .filter(item => item.voColName !== 'days')
        .map(({ voColName, valueOperator, colValue }) => ({
            colName: voColName,
            condition: valueOperator,
            value: colValue
        }));

    ImmediateInventory.getWillExpireMaterials(
        {
            //默认是7天
            days: days ? days.colValue : '7',
            filters
        },
        currentPage.value,
        currentSize.value
    )
        .then(res => {
            if (res.code === 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                });
            }
            const scrollContainer = tableContainer.value.querySelector('.el-scrollbar__wrap');
            if (scrollContainer) {
                scrollContainer.scrollTop = 0;
            }
            console.log('获取分页表格数据成功');
        })
        .catch(error => console.error(error));
}

const selectProcessName = ref([])
const selectProductFamily = ref([])
// const selectPackagingMethod = ref([])

const querySearch = (queryString, cb) => {
    const results = queryString
        ? selectProcessName.value.filter(createFilter(queryString))
        : selectProcessName.value
    cb(results)
}
const querySearchProductFamily = (queryString, cb) => {
    const results = queryString
        ? selectProductFamily.value.filter(createFilter(queryString))
        : selectProductFamily.value
    cb(results)
}

const createFilter = (queryString) => {
    return (item) => {
        return item.value.indexOf(queryString) !== -1
    }
}

let addAble = false //限制每次只能新增一行

const selectedRows = ref([]) // 存储选中的行数据

// 监控路由，切换页面时自动刷新表格数据
// watch(
//   () => route.path,
//   () => {
//     refresh();
//   }
// );

onMounted(() => {
    refresh()
    window.addEventListener('keydown', handleEsc);
})
// 处理 Esc 键按下的事件
const handleEsc = (event) => {
    if (event.keyCode === 27) {
        refreshContent();
    }
};
onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEsc);
});
onUnmounted(() => {
    ImmediateInventory.resetState()
})


const myTable = ref(null)

function handlePages(page) {
    currentPage.value = page
    let cols = []
    // 当 currentOrder.value 有键时，添加 currentOrder.value
    if (Object.keys(currentOrder.value).length !== 0) {
        cols.push(currentOrder.value)
    }

    // 当 localCurrentOption.value 存在时，添加 localCurrentOption.value
    if (localCurrentOption.value) {
        cols.push(...localCurrentOption.value)
    }
    const param = {
        // tableId: tableId.value,
        // viewId: currentViewId.value,
        cols: cols
    }

    ImmediateInventory.getWillExpireMaterials(
        param,
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
            if (res.code == 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                })
            }
            const scrollContainer = tableContainer.value.querySelector(
                '.el-scrollbar__wrap'
            )
            if (scrollContainer) {
                scrollContainer.scrollTop = 0 // 滚动到顶部
            }
            console.log('获取分页表格数据成功')
        })
        .catch((error) => { })
}

function handleSizeChange(newSize) {
    currentSize.value = newSize
    let cols = []
    // 当 currentOrder.value 有键时，添加 currentOrder.value
    if (Object.keys(currentOrder.value).length !== 0) {
        cols.push(currentOrder.value)
    }

    // 当 localCurrentOption.value 存在时，添加 localCurrentOption.value
    if (localCurrentOption.value) {
        cols.push(...localCurrentOption.value)
    }
    const param = {
        // tableId: tableId.value,
        // viewId: currentViewId.value,
        cols: cols
    }
    ImmediateInventory.getWillExpireMaterials(
        param,
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
            if (res.code == 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                })
            }
            console.log('获取成品計劃数据成功')
        })
        .catch((error) => { })
}


// 只刷新查到的内容
function refreshContent() {
    addAble = true
    currentSize.value = useUserStore().pageSize
    // 刷新列
    let cols = []
    // 当 currentOrder.value 有键时，添加 currentOrder.value
    if (Object.keys(currentOrder.value).length !== 0) {
        cols.push(currentOrder.value)
    }

    // 当 localCurrentOption.value 存在时，添加 localCurrentOption.value
    if (localCurrentOption.value) {
        cols.push(...localCurrentOption.value)
    }
    const param = {
        // tableId: tableId.value,
        // viewId: currentViewId.value,
        cols: cols
    }
    ImmediateInventory.getWillExpireMaterials(
        param,
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
            if (res.code == 201) {
                ElMessageBox.alert(res.message, '提示', {
                    confirmButtonText: '好的'
                })
            }
        })
        .catch((error) => { })
    myTable.value.clearSelection()
}

function handleChange(selection) {
    // 更新 selectedRows
    selectedRows.value = selection
}


function refresh() {
    addAble = true
    currentSize.value = useUserStore().pageSize
    currentViewId.value = -1
    currentViewName.value = '默认'
    ImmediateInventory.getWillExpireMaterials(
        {

            // tableId: tableId.value,
            // viewId: currentViewId.value
        },
        currentPage.value,
        currentSize.value
    )
        .then((res) => {
        })
        .catch((error) => { })

    ImmediateInventory.willExpireMaterials.column = selectFormConfig


}

function fresh() {
    refreshContent()
    ElMessage({
        type: 'success',
        message: '刷新成功'
    })
}
</script>

<style>
.el-table .el-table__cell {
    padding: 0;
    /* padding: .5rem 0; */
}

.el-table .cell {
    padding: 0
}

.el-table .positive-expire-days {
    background-color: #fff9c4;
}
</style>

<style scoped>
.container {
    display: flex;
    /* height: 34.6875rem; */
    margin: 1.5rem 24px;
    flex-direction: column;
    /* background-color: red; */
}

.plan {
    flex-direction: row-reverse;
    margin: 0;
    margin-top: 24px;
}

.head {
    height: 48px;
    width: 100%;
    background-color: #f1f4f6;
}

button {
    border: none;
    background-color: #f1f4f6;
    padding: 0;
    line-height: 48px;
    padding: 0 25px;
}

button:hover {
    background-color: #0053b5;
    cursor: pointer;
    color: #fff;
}

span {
    font-size: 14px;
}

.main {
    flex: 1;
}

.el-table {
    border: 0.0625rem solid #9db9d6;
    /* background-color: red; */
}

.bottom {
    position: fixed;
    bottom: 0;
}
</style>
