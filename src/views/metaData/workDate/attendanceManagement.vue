<template>
  <div class="container">
    <div class="head">
      <button @click="addRow"><span class="first">新增</span></button>
      <button @click="modifyRow"><span>修改</span></button>
      <button @click="deleteSelectedRows"><span>删除</span></button>
      <button @click="fresh"><span>刷新</span></button>
    </div>
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="attendanceManagement.attendance.data"
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
        <el-table-column prop="id" label="序号" width="70">
        </el-table-column>
        <el-table-column prop="employeeName" label="员工姓名" min-width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.employeeName"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.employeeName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" min-width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.date"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.date }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="dayOfWeek" label="星期" width="120">
        </el-table-column>
        <el-table-column prop="isWorkday" label="是否为工作日">
        </el-table-column>
        <el-table-column prop="attendanceTimeRange" label="默认出勤时间" width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.attendanceTimeRange" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.attendanceTimeRange }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="lunchBreakTimeRange" label="午休时间" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.lunchBreakTimeRange" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.lunchBreakTimeRange }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="dinnerTimeRange"
          label="晚饭时间"
          min-width="120"
        >
        <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.dinnerTimeRange" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.dinnerTimeRange }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="morningMeetingTimeRange" label="早会时间" width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.morningMeetingTimeRange" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.morningMeetingTimeRange }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="leaveTimeRange" label="请假时间" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.leaveTimeRange" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.leaveTimeRange }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="effectiveAttendanceTimeRange" label="有效出勤时间" min-width="120">
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="attendanceManagement.attendance.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="attendanceManagement.attendance.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import useAttendanceManagement from '@/store/modules/metaData/attendanceManagement'
import useUserStore from '@/store/modules/user'
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()
const attendanceManagement = useAttendanceManagement()

let currentPage = ref(1)
let currentSize = ref(20)


// console.log(useMachine.machine.data,'machine')
function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  attendanceManagement
    .getAllPage(currentPage.value, currentSize.value)
    .then((res) => {
    })
    .catch((error) => {})
}


let addAble = true //限制每次只能新增一行

const newRow = {
  "employeeName": "", 
  "date": "", 
  "dayOfWeek": "", 
  "isWorkday": "", 
  "attendanceTimeRange": "", 
  "lunchBreakTimeRange": "", 
  "dinnerTimeRange": "", 
  "morningMeetingTimeRange": "", 
  "leaveTimeRange": "", 
  "effectiveAttendanceTimeRange": "",
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
    attendanceManagement.attendance.data.unshift({ ...newRow })
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
    attendanceManagement
      .addOrUpdate({
        "id": row.id,
        "employeeName": row.employeeName, 
        "date": row.date, 
        "dayOfWeek": row.dayOfWeek, 
        "isWorkday": row.isWorkday, 
        "attendanceTimeRange": row.attendanceTimeRange, 
        "lunchBreakTimeRange": row.lunchBreakTimeRange, 
        "dinnerTimeRange": row.dinnerTimeRange, 
        "morningMeetingTimeRange": row.morningMeetingTimeRange, 
        "leaveTimeRange": row.leaveTimeRange, 
        "effectiveAttendanceTimeRange": row.effectiveAttendanceTimeRange
      })
      .then((res) => {
        refresh()
        console.log('产能修改成功')
      })
      .catch((error) => {
        console.log(row.id)
        console.log('产能修改失败')
      })
    // console.log('修改工序名')
    
    row.editable = false
  }
  // 新增数据
  else {
    // console.log(addAble,'@@@')
    attendanceManagement
      .addOrUpdate({
        "employeeName": row.employeeName, 
        "date": row.date, 
        "dayOfWeek": row.dayOfWeek, 
        "isWorkday": row.isWorkday, 
        "attendanceTimeRange": row.attendanceTimeRange, 
        "lunchBreakTimeRange": row.lunchBreakTimeRange, 
        "dinnerTimeRange": row.dinnerTimeRange, 
        "morningMeetingTimeRange": row.morningMeetingTimeRange, 
        "leaveTimeRange": row.leaveTimeRange, 
        "effectiveAttendanceTimeRange": row.effectiveAttendanceTimeRange
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
  attendanceManagement
    .getAllPage(page, currentSize.value)
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
        attendanceManagement
          .remove(list)
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
  attendanceManagement
    .getAllPage(currentPage.value, currentSize.value)
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
.adjustConfirm{
  margin-right: 10px;  
}
.bottom {
    position: fixed;
    bottom: 0;
}
</style>
