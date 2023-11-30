<template>
  <div class="container">
    <div class="head">
      <button @click="addRow"><span class="first">新增</span></button>
      <button @click="modifyRow"><span>修改</span></button>
      <button @click="deleteSelectedRows"><span>删除</span></button>
      <button @click="fresh"><span>刷新</span></button>
      <button><span>导入</span></button>
      <button @click="downloadData"><span>导出</span></button>
    </div>
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="useMachine.machine.data"
        border
        :cell-style="{ borderColor: '#9db9d6', textAlign: 'center' }"
        :header-cell-style="{
          borderColor: '#9db9d6',
          background: '#d9e9f8',
          color: '#000',
          textAlign: 'center',
          fontWeight: '500'
        }"
        row-key="id"
        @selection-change="handleChange"
        @row-dblclick="changeRow"
        max-height="calc(100vh - 258px)"
        ref="myTable"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          label=""
          width="35"
          class="one"
        />
        <el-table-column prop="number" label="序号" width="70">
          <!-- <template #default="{ row }">
                <template v-if="row.editable">
                  <el-input v-model="row.fMachineId" @keyup.enter="saveRow(row)" />
                </template>
                <template v-else>
                  {{ row.fMachineId }}
                </template>
              </template> -->
        </el-table-column>
        <el-table-column prop="fMachineName" label="机器名称" width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.fMachineName"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.fMachineName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fProductFamily" label="产品族" width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-autocomplete
                v-model="row.fProductFamily"
                :fetch-suggestions="querySearchProductFamily"
                clearable
                class="inline-input w-50"
                placeholder="Please Input"
                @select="handleSelect"
              />
            </template>
            <template v-else>
              {{ row.fProductFamily }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fProcess" label="工序" width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-autocomplete
                v-model="row.fProcess"
                :fetch-suggestions="querySearch"
                clearable
                class="inline-input w-50"
                placeholder="Please Input"
                @select="(item) => handleSelect(item, row)"
              />
            </template>
            <template v-else>
              {{ row.fProcess }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fMachineConfiguration" label="机器规格">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.fMachineConfiguration"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.fMachineConfiguration }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fWorkshop" label="使用车间" width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.fWorkshop" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.fWorkshop }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="available" label="是否可用" width="60">
        </el-table-column>
        <el-table-column
          prop="unavailableDates"
          label="不可用时间段"
          width="360"
        >
          <template #default="{ row }">
            <template v-if="row.editable">
              <div v-for="date in row.unavailableDates" :key="date">
                {{ date }}
              </div>
              <el-button @click="adjustTime(row)">调整时间</el-button>
            </template>
            <template v-else>
              <!-- {{ row.unavailableDates }} -->
              <div v-for="date in row.unavailableDates" :key="date">
                {{ date }}
              </div>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="useMachine.machine.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="useMachine.machine.total"
        />
      </div>
    </div>
    
    <div class="adjustDate">
      <el-dialog v-model="dialogTableVisible" title="调整日期">
        <div>
          <!-- 显示日期列表 -->
          <div
            v-for="(date, index) in adjustDate"
            :key="index"
            class="date-row"
          >
            <el-date-picker
              v-model="adjustDate[index]"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime1"
              value-format="YYYY-MM-DD HH:mm:ss"
              data-popper-placement="top"
            />
            <el-button @click="removeDate(index)" class="remove"
              >删除</el-button
            >
          </div>
          <!-- 添加日期按钮 -->
          <el-button @click="addDate">添加日期</el-button>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogTableVisible = false" class="cancel"
              >取消</el-button
            >
            <el-button @click="confirmDate">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import processManage from '@/store/modules/metaData/processManage'
import machineManagement from '@/store/modules/metaData/machineManagement'
import { useRoute } from 'vue-router'
import useUserStore from '../../store/modules/user'
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()

let currentPage = ref(1)
let currentSize = ref(20)
const process = processManage()
const useMachine = machineManagement()
const route = useRoute() //用于获取和访问当前路由的信息

const dialogTableVisible = ref(false)
const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0) // '12:00:00'
const currentRow = ref(null)
const adjustDate = ref([])

function downloadData() {
  ElMessageBox.confirm('请选择你要导出的数据', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '当前页',
    cancelButtonText: '全部页',
    type: 'warning'
  })
    .then(() => {
      useMachine
        .downloadApsMachineTable({
          type: 3,
          page: currentPage.value,
          size: currentSize.value
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
        useMachine
          .downloadApsMachineTable({
            type: 4
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

function adjustTime(row) {
  adjustDate.value = []
  currentRow.value = row // 保存当前行的引用
  let datesArray = []
  for (let date of row.unavailableDates) {
    datesArray = date.split(' to ')
    adjustDate.value.push(datesArray)
  }
  // console.log(adjustDate.value,'adjust')
  dialogTableVisible.value = true
}
function confirmDate() {
  // 判断是否有空的日期
  const hasEmptyValue = adjustDate.value.some(
    (range) => range.includes(null) || range.includes('')
  )
  if (hasEmptyValue) {
    ElMessageBox.alert('请填写所有日期范围', '提示', {
      confirmButtonText: '好的'
    })
    return
  }

  const formattedRanges = adjustDate.value.map((range) => range.join(' to '))
  // console.log(formattedRanges,'form')
  if (currentRow.value) {
    currentRow.value.unavailableDates = formattedRanges
  }
  dialogTableVisible.value = false
}
// 添加日期
function addDate() {
  adjustDate.value.push('')
}
function removeDate(index) {
  adjustDate.value.splice(index, 1)
}

// console.log(useMachine.machine.data,'machine')
function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  useMachine
    .getApsMachineTable(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取機器管理数据成功')
    })
    .catch((error) => {})
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

const handleSelect = (item, row) => {
  console.log(item, 'item')
  console.log(row, 'row')
  row.fProcessId = item.id
}

onMounted(() => {
  process
    .getProcessNamePools()
    .then((res) => {
      selectProcessName.value = process.processNames.data.map((item) => {
        return { id: item.id, value: item.processName }
      })
      console.log('点开了工序名称的下拉框')
    })
    .catch((error) => {})

  process
    .getAllProductFamily()
    .then((res) => {
      selectProductFamily.value = process.productFamily.map((item) => {
        return { value: item }
      })
      console.log(selectProductFamily, '点开了产品族的下拉框')
    })
    .catch((error) => {})
})

console.log(selectProcessName.value, 'processName')

let addAble = true //限制每次只能新增一行

const newRow = {
  fMachineName: '',
  fProductFamily: '',
  fProcess: '',
  fProcessId: '',
  fMachineConfiguration: '',
  fWorkshop: '',
  available: '',
  unavailableDates: '',
  unavailableTime: '',
  editable: true
}
const selectedRows = ref([]) // 存储选中的行数据

// 监控路由，切换页面时自动刷新表格数据
// watch(() => route.path, () => {
//   refresh()
// })

onBeforeMount(() => {
  refresh()
})

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
    useMachine.machine.data.unshift({ ...newRow })
    addAble = false
  } else {
    return
  }
}

function saveRow(row) {
  // 这里可以添加保存数据的逻辑，例如将数据发送到后端
  // 修改数据
  // console.log(row,'row')
  console.log('修改数据', row)
  if (row.id) {
    useMachine
      .addOrUpdateApsMachineTable({
        id: row.id,
        fMachineName: row.fMachineName,
        fProductFamily: row.fProductFamily,
        fProcessId: row.fProcessId,
        fProcess: row.fProcess,
        fMachineConfiguration: row.fMachineConfiguration,
        fWorkshop: row.fWorkshop,
        available: row.available,
        unavailableDates: row.unavailableDates,
        unavailableTime: row.unavailableTime
      })
      .then((res) => {
        console.log('产能修改成功')
      })
      .catch((error) => {
        console.log(row.id)
        console.log('产能修改失败')
      })
    // console.log('修改工序名')
    refresh()
    row.editable = false
  }
  // 新增数据
  else {
    // console.log(addAble,'@@@')
    useMachine
      .addOrUpdateApsMachineTable({
        fMachineName: row.fMachineName,
        fProductFamily: row.fProductFamily,
        fProcess: row.fProcess,
        fProcessId: row.fProcessId,
        fMachineConfiguration: row.fMachineConfiguration,
        fWorkshop: row.fWorkshop,
        available: row.available,
        unavailableDates: row.unavailableDates,
        unavailableTime: row.unavailableTime
      })
      .then((res) => {
        addAble = true
        if (res.code == 200) {
          console.log('产能添加成功')
        } else {
          ElMessageBox.alert('数据不能为空', '添加数据失败', {
            confirmButtonText: '好'
          })
        }
        refresh()
      })
      .catch((error) => {
        console.log(error)
        console.log('产能添加失败')
      })

    // 序号自动加1
    // row.id = process.processNames.length;
    // 保存成功后可以在这里更新状态或执行其他操作
    row.editable = false // 保存后将行设置为不可编辑状态
    // addAble = true;
  }
}

const tableContainer = ref(null)
function handlePages(page) {
  // console.log(page)
  currentPage.value = page
  useMachine
    .getApsMachineTable(page, currentSize.value)
    .then((res) => {
      // 这里的选择器依赖于实际的DOM结构，可能需要调整
      const scrollContainer = tableContainer.value.querySelector(
        '.el-scrollbar__wrap'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = 0 // 滚动到顶部
      }

      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
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
        useMachine
          .deleteApsMachineTable(list)
          .then((res) => {
            console.log('删除产能成功')
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            refresh()
          })
          .catch((error) => {
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

function refresh() {
  addAble = true
  currentSize.value = useUserStore().pageSize
  useMachine
    .getApsMachineTable(currentPage.value, currentSize.value)
    .then((res) => {
      myTable.value.clearSelection()
    })
    .catch((error) => {})
  console.log('查询所有机器管理')
}
function fresh() {
  refresh()
  ElMessage({
    type: "success",
    message: "刷新成功",
  });
}
</script>

<style>
.el-table .el-table__cell {
  padding: 0;
  /* padding: 8px 0; */
}
.el-message-box__btns > .el-button--primary {
  background-color: #409eff;
}
.adjustDate .el-dialog {
  --el-dialog-width: 40%;
  margin-top: 7vh;
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
  margin-top:24px;
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
.el-button {
  margin: 10px 0;
  background-color: #fff;
  border: 1px solid #409eff;
}
.main {
  /* background-color: blue; */
  /* width: 100%; */
  flex: 1;
  margin-top: 20px;
}
.el-table {
  border: 1px solid #9db9d6;
  /* background-color: red; */
}

.example-pagination-block {
  /* margin-bottom: 16px; */
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
}

.date-row {
  display: flex;
  align-items: center;
}
.remove {
  margin-left: 20px;
  /* align-items: center; */
}
.cancel {
  margin-right: 10px;
}
.bottom {
    position: fixed;
    bottom: 0;
}
</style>
