<template>
    <div class="container">
        <div class="head">
            <button @click="addRow"><span class="first">新增</span></button>
            <button @click="modifyRow"><span>修改</span></button>
            <button @click="deleteSelectedRows"><span>删除</span></button>
            <button @click="fresh"><span>刷新</span></button>
            <button @click="dialogVisible = true"><span>导入</span></button>
            <button @click="downloadData"><span>导出</span></button>
        </div>
        <div class="main" ref="tableContainer">
            <div class="common" ref="commonPlan">
                <common-plan class="plan" :columnNames="dailyDataUpload.dailyDataUpload.column"
                    :viewColumn="dailyDataUpload.dailyDataUpload.viewColumn" :currentViewId="currentViewId"
                    :currentViewName="currentViewName" :apiUrl="'/interface/dailyDatasearchLike'" :currentTableId="34"
                    :currentOrder="currentOrder" @lookView="lookView" @searchView="searchView"
                    @getCurrentOption="getCurrentOption" />
            </div>
            <el-table ref="myTable" :data="dailyDataUpload.dailyDataUpload.data" border
                :row-class-name="tableRowClassName" :cell-style="{ borderColor: '#9db9d6', textAlign: 'center' }"
                :header-cell-style="{
                    borderColor: '#9db9d6',
                    background: '#d9e9f8',
                    color: '#000',
                    textAlign: 'center',
                    fontWeight: '500'
                }" row-key="id" :max-height="tableMaxHeight" @selection-change="handleChange" @row-dblclick="changeRow"
                @sort-change="onSortChange">
                <el-table-column type="selection" :reserve-selection="true" label="" width="35" class="one" />
                <el-table-column v-for="column in dynamicColumns" :key="column.prop" :prop="column.prop"
                    :label="column.label" :width="column.width" :sortable="column.sortable"
                    :sort-orders="column.sortOrders">
                    <template v-slot:header="{ column }">
                        <div>
                            {{ column.label }}
                            <span v-html="renderSortIcon(column)"></span>
                        </div>
                    </template>
                    <template v-slot:default="scope">
                        <span v-if="scope.row.editable">
                            <!-- 根据inputType来决定是el-input还是el-autocomplete -->
                            <el-input v-if="column.inputType === 'el-input'" v-model="scope.row[column.prop]"
                                @keyup.enter="saveRow(scope.row)" />
                            <el-autocomplete v-else-if="column.inputType === 'el-autocomplete'"
                                v-model="scope.row[column.prop]" :fetch-suggestions="querySearch" clearable
                                class="inline-input w-50" placeholder="Please Input"
                                @select="(item) => handleSelect(item, scope.row)" />
                        </span>
                        <span v-else>
                            <!-- 如果是数量字段，column.format属性为true需要格式化 -->
                            <span v-if="column.format">{{ formatNumber(scope.row[column.prop]) }}</span>
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
                <Pagination :total="dailyDataUpload.dailyDataUpload.pages" @change-page="handlePages"
                    @update-size="handleSizeChange" :totalRows="dailyDataUpload.dailyDataUpload.total"
                    :currentPage="currentPage" />
            </div>
        </div>

        <el-dialog title="导入文件" v-model="dialogVisible" width="30%">
            <!-- 文件上传 -->
            <el-upload class="upload-demo" drag :auto-upload="false" :file-list="fileList"
                :on-change="handleFileChange">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>

            <!-- 底部操作按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="overUpload" class="confirm normal">覆盖导入</el-button>
                <el-button @click="addUpload" class="normal">追加导入</el-button>
                <el-button @click="downloadModel" class="normal">下载模板</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, onBeforeUnmount } from 'vue'
import { renderSortIcon } from '@/utils/sortIcon'
import CommonPlan from '@/components/CommonPlan.vue'
import useDailyDataUpload from '@/store/modules/port/MES/dailyDataUpload'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'
import useProcess from '@/store/modules/metaData/processManage'
import useUserMenu from '@/store/modules/menu'
import { columnConfig } from '@/columnConfig/MES/dailyDataUpload'
const userMenu = useUserMenu()
const dailyDataUpload = useDailyDataUpload()
const process = useProcess()

let currentPage = ref(1)
let currentSize = ref(100)
let currentViewId = ref(null) //当前视图id
let currentViewName = ref('') //当前视图名字
const plan = ref({}) //当前方案各个列的true和false
const tableContainer = ref(null) //点击其他视图或者点击下一页时自动滑动到顶部
const commonPlan = ref(null)
const commonPlanHeight = ref(0)
const tableId = ref(34)
const localCurrentOption = ref([]) //子组件中传过来的currentOption
const currentOrder = ref({}) //当前排序的字段
let column = reactive([]) //所有列名
let viewColumn = reactive([]) //当前视图的所拥有的列名
// 更新 dynamicColumns 计算属性
const dynamicColumns = computed(() => {
    if (currentViewId.value === '-1') {
        // 当 viewId 为 -1 时，使用所有列
        return columnConfig
    } else if (!dailyDataUpload.dailyDataUpload.viewColumn) {
        return []
    }

    return dailyDataUpload.dailyDataUpload.viewColumn
        .map(viewCol => {
            const colConfig = columnConfig.find(c => c.prop === viewCol.voColName)
            if (colConfig) {
                return colConfig
            }
            return null
        })
        .filter(Boolean)
})
// 修改表格选中行的样式
// 这个方法返回一个类名，基于行是否被选中
function tableRowClassName({ row }) {
    // 检查当前行是否在selectedRows中
    const isRowSelected = selectedRows.value.some(
        (selectedRow) => selectedRow.id === row.id
    )
    return isRowSelected ? 'row-highlight' : ''
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
    if (viewColumn.length != 0) {
        const id = viewColumn.find((item) => item.voColName == sortDetails.prop).id //视图列id
        currentOrder.value.id = id
    }
    const colId = column.find((item) => item.voColName == sortDetails.prop).id //全部列id
    currentOrder.value.valueOperator = sortDetails.order
    currentOrder.value.colId = colId
    let param = {
        tableId: tableId.value,
        viewId: currentViewId.value,
        cols: [currentOrder.value]
    }

    // 判断有没有筛选条件，传的参数不一样
    if (localCurrentOption.value) {
        param.cols.push(...localCurrentOption.value)
    }

    // console.log(localCurrentOption.value, 'localCurrentOption.value')
    dailyDataUpload
        .getDailyDataFilter(param, currentPage.value, currentSize.value)
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
    dailyDataUpload
        .getDailyDataFilter(
            {
                tableId: tableId.value,
                viewId: currentViewId.value
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
            viewColumn = dailyDataUpload.dailyDataUpload.viewColumn
            // console.log(viewColumn,'viewColumn')
            if (viewId == '-1') {
                // 当 viewId 为 -1 时，使用所有列
                dailyDataUpload.dailyDataUpload.viewColumn = columnConfig.map(col => ({
                    voColName: col.prop,
                    id: col.id // 假设 columnConfig 中有 id 字段
                }))
            } else {
                plan.value = transformColumns(column, viewColumn)
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
    currentPage.value = 1
    dailyDataUpload
        .getDailyDataFilter(param, currentPage.value, currentSize.value)
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

const formatNumber = (value) => {
    if (value) {
        // 创建一个新的Intl.NumberFormat实例
        const formatter = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0 // 数字最少位数
        })
        // 返回格式化的数字
        return formatter.format(value)
    }
}
function downloadData() {
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
        tableId: tableId.value,
        viewId: currentViewId.value,
        cols: cols
    }
    ElMessageBox.confirm('请选择你要导出的数据', '提示', {
        distinguishCancelAndClose: true,
        confirmButtonText: '当前页',
        cancelButtonText: '全部页',
        type: 'warning'
    })
        .then(() => {
            dailyDataUpload
                .downloadDailyData({
                    type: 3,
                    page: currentPage.value,
                    size: currentSize.value,
                    ...param
                })
                .then((res) => {
                    ElMessage({
                        type: 'success',
                        message: '导出当前页成功'
                    })
                    // console.log(res,'res')
                })
        })
        .catch((action) => {
            if (action === 'cancel') {
                dailyDataUpload
                    .downloadDailyData({
                        type: 4,
                        ...param
                    })
                    .then((res) => {
                        ElMessage({
                            type: 'success',
                            message: '导出全部页成功'
                        })
                    })
            }
        })
}

const dialogVisible = ref(false)
const fileToUpload = ref(null)
const fileList = ref([])
const importType = ref(1)

function handleFileChange(file) {
    // 存储用户选中的文件
    fileToUpload.value = file
}
console.log(fileToUpload.value, 'fileToUpload')

async function addUpload() {
    if (!fileToUpload.value) {
        // console.log('没有选择文件')
        ElMessageBox.alert('请上传文件后导入', '提示', {
            type: 'info',
            confirmButtonText: '好的'
        })
        dialogVisible.value = false
        return
    }

    const uploadData = {
        file: fileToUpload.value,
        type: importType.value // 您可以根据需要添加其他数据
    }
    dailyDataUpload.importloadDailyData(uploadData).then((res) => {
        // console.log(res,'res')
        if (res.code == 200) {
            ElMessageBox.alert('导入成功', '提示', {
                type: 'success',
                confirmButtonText: '好的'
            })
        } else if (res.code == 201) {
            ElMessageBox.alert(res.message, '导入失败', {
                type: 'error',
                confirmButtonText: '好的'
            })
        }
        importType.value = 1
        refresh()
    })

    // 重置文件
    fileList.value = []
    fileToUpload.value = null
    dialogVisible.value = false
}
function overUpload() {
    ElMessageBox.confirm('该操作将会覆盖全部数据，是否执行？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            importType.value = 2 //设置成覆盖类型
            addUpload()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消覆盖导入'
            })
        })
}
function downloadModel() {
    dailyDataUpload.downloadDailyDataUploadTemplate().then((res) => {
        dialogVisible.value = false
    })
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
        tableId: tableId.value,
        viewId: currentViewId.value,
        cols: cols
    }
    dailyDataUpload
        .getDailyDataFilter(param, currentPage.value, currentSize.value)
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

const selectProcessName = ref([])
const selectProductFamily = ref([])
// const selectPackagingMethod = ref([])

const querySearch = (queryString, cb) => {
    const results = queryString
        ? selectProcessName.value.filter(createFilter(queryString))
        : selectProcessName.value
    cb(results)
}

const createFilter = (queryString) => {
    return (item) => {
        return item.value.indexOf(queryString) !== -1
    }
}

let addAble = true //限制每次只能新增一行

const newRow = {
    processName: '',
    orderNumber: '',
    materialCode: '',
    materialName: '',
    totalQuantity: '',
    completedQuantity: '',
    // capacityPsPuPp: '',
    remainingQuantity: '',
    // remainingCapacity: '',
    // 其他必要的字段
    chVersion: '',
    editable: true
}
const selectedRows = ref([]) // 存储选中的行数据

onMounted(() => {
    process
        .getProcessNamePools()
        .then((res) => {
            selectProcessName.value = process.processNames.data.map((item) => {
                return { id: item.id, value: item.processName }
            })
            console.log('点开了工序名称的下拉框')
        })
        .catch((error) => { })
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
const handleSelect = (item, row) => {
    console.log(item, 'item')
    console.log(row, 'row')
    row.processId = item.id
}

// onUnmounted(() => {
//   dailyDataUpload.resetState()
// })

function changeRow(row) {
    row.editable = true
}
function modifyRow() {
    // selectedRows.value[0].editable = true
    if (selectedRows.value.length == 0) {
        ElMessageBox.alert('请选中一行修改', '提示', {
            confirmButtonText: '好的'
        })
    } else {
        selectedRows.value.forEach((row) => {
            row.editable = true
        })
    }
}

const myTable = ref(null)
function addRow() {
    if (addAble) {
        const scrollContainer = tableContainer.value.querySelector(
            '.el-scrollbar__wrap'
        )
        if (scrollContainer) {
            scrollContainer.scrollTop = 0 // 滚动到顶部
        }
        dailyDataUpload.dailyDataUpload.data.unshift({ ...newRow })
        addAble = false
    } else {
        return
    }
}

function saveRow(row) {
    // 这里可以添加保存数据的逻辑，例如将数据发送到后端
    // 修改数据
    //   console.log('修改数据', row)
    if (row.id) {
        dailyDataUpload
            .addOrUpdateDailyData({
                id: row.id,
                processId: row.processId,
                processName: row.processName,
                orderNumber: row.orderNumber,
                materialCode: row.materialCode,
                materialName: row.materialName,
                totalQuantity: row.totalQuantity,
                completedQuantity: row.completedQuantity,
                // capacityPsPuPp: row.capacityPsPuPp,
                remainingQuantity: row.remainingQuantity,
                // remainingCapacity: row.remainingCapacity
            })
            .then((res) => {
                console.log('产能修改成功')
                ElMessage({
                    type: 'success',
                    message: '修改成功'
                })
                refreshContent()
            })
            .catch((error) => {
                ElMessage({
                    type: 'error',
                    message: '修改失败'
                })
                refreshContent()
                console.log(row.id)
                console.log('产能修改失败')
            })
        // console.log('修改工序名')
        row.editable = false
    }
    // 新增数据
    else {
        // console.log(addAble,'@@@')
        dailyDataUpload
            .addOrUpdateDailyData({
                processId: row.processId,
                processName: row.processName,
                orderNumber: row.orderNumber,
                materialCode: row.materialCode,
                materialName: row.materialName,
                totalQuantity: row.totalQuantity,
                completedQuantity: row.completedQuantity,
                // capacityPsPuPp: row.capacityPsPuPp,
                remainingQuantity: row.remainingQuantity,
                // remainingCapacity: row.remainingCapacity
            })
            .then((res) => {
                addAble = true
                if (res.code == 200) {
                    ElMessage({
                        type: 'success',
                        message: '添加成功'
                    })
                    console.log('产能添加成功')
                } else {
                    ElMessageBox.alert('数据不能为空', '添加数据失败', {
                        confirmButtonText: '好'
                    })
                }
                refreshContent()
            })
            .catch((error) => {
                ElMessage({
                    type: 'error',
                    message: '添加失败'
                })
                console.log(error)
                console.log('产能添加失败')
                refreshContent()
            })

        // 序号自动加1
        // row.id = process.processNames.length;
        // 保存成功后可以在这里更新状态或执行其他操作
        row.editable = false // 保存后将行设置为不可编辑状态
        // addAble = true;
    }
}

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
        tableId: tableId.value,
        viewId: currentViewId.value,
        cols: cols
    }

    dailyDataUpload
        .getDailyDataFilter(param, currentPage.value, currentSize.value)
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

function deleteSelectedRows() {
    // 在这里处理删除选中行的逻辑，可以从 selectedRows 中获取选中行的数据
    // 批量删除
    const list = []
    selectedRows.value.forEach((row) => {
        list.push(row.id)
    })
    // console.log(list,'批量删除工序名称')
    if (list.length == 0) {
        ElMessageBox.alert('请选中至少一行删除', '提示', {
            confirmButtonText: '好的'
        })
    } else {
        ElMessageBox.confirm('确定删除这些工序吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
                dailyDataUpload
                    .removeDailyData(list)
                    .then((res) => {
                        console.log('删除产能成功')
                        ElMessage({
                            type: 'success',
                            message: '删除成功'
                        })
                        refreshContent()
                    })
                    .catch((error) => {
                        ElMessage({
                            type: 'error',
                            message: '删除失败'
                        })
                        refreshContent()
                        console.log(error)
                        console.log('批量删除产能失败')
                    })
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消删除'
                })
            })
    }
}
function handleChange(selection) {
    // 更新 selectedRows
    selectedRows.value = selection
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
        tableId: tableId.value,
        viewId: currentViewId.value,
        cols: cols
    }
    dailyDataUpload
        .getDailyDataFilter(param, currentPage.value, currentSize.value)
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

// 一开始进入界面的大刷
function refresh() {
    addAble = true
    currentSize.value = useUserStore().pageSize
    // 获取所有视图
    dailyDataUpload.getViews(tableId.value).then((res) => {
        currentViewId.value = dailyDataUpload.dailyDataUpload.defaultViewId
        currentViewName.value = dailyDataUpload.dailyDataUpload.defaultViewName
        // 获取所有的列
        dailyDataUpload.getCols(tableId.value).then((res) => {
            // 获取到列名和视图列后再赋值给column和viewColumn
            column = dailyDataUpload.dailyDataUpload.column
            viewColumn = dailyDataUpload.dailyDataUpload.viewColumn
            // 如果是“全部”就给plan赋值
            if (currentViewId.value == -1) {
                plan.value = column.reduce((acc, item) => {
                    acc[item.voColName] = true
                    return acc
                }, {})
                // console.log(plan.value, 'plan11')
            } else {
                plan.value = transformColumns(column, viewColumn)
            }
            // 获取拥有的数据和所拥有的列
            dailyDataUpload
                .getDailyDataFilter(
                    { tableId: tableId.value, viewId: currentViewId.value },
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
        })
    })
}
async function fresh() {
    //调用dailyDataUpload的updateDailyData
    await dailyDataUpload.updateDailyData()
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
    /* padding: 8px 0; */
}
</style>

<style scoped>
.container {
    display: flex;
    /* height: 555px; */
    margin: 24px 24px;
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

.dialog-footer {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 1.25rem;
}

.confirm {
    margin-left: 1.25rem;
}

.normal {
    padding: 0.5rem 0.9375rem;
    border: 0.125rem solid rgb(220, 223, 230);
    background-color: #fff;
    margin-left: 0.625rem;
}

span {
    font-size: 14px;
}

.main {
    /* background-color: blue; */
    /* width: 100%; */
    flex: 1;
}

.el-table {
    border: 1px solid #9db9d6;
    /* background-color: red; */
}

.bottom {
    position: fixed;
    bottom: 0;
}
</style>
