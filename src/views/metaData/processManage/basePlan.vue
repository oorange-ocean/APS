<template>
  <div class="container">
    <div class="head">
      <button @click="addRow"><span class="first">新增</span></button>
      <button @click="deleteSelectedRows"><span>删除</span></button>
      <button @click="refresh"><span>刷新</span></button>
      <button><span>导出</span></button>
    </div>
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="process.basePlanList.data"
        :cell-class-name="getRowClassName"
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
        max-height="calc(100vh - 258px)"
        @selection-change="handleChange"
        ref="myTable"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          label=""
          width="35"
          class="one"
        />
        <el-table-column
          prop="currentProcessScheme"
          label="当前工艺方案"
          width="200"
        >
          <template v-slot:default="scope">
            <a @click="handleLinkClick(scope.row)">{{
              scope.row.currentProcessScheme
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="belongingProcess"
          label="所属工序"
          width="60"
        ></el-table-column>
        <el-table-column
          prop="productFamily"
          label="产品族"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="processNumber"
          label="序号"
          width="60"
        ></el-table-column>
        <el-table-column prop="processName" label="工序名称"></el-table-column>
        <el-table-column prop="switchTime" label="切换时间(s)" width="100">
          <template v-slot:default="scope">
            {{ formatNumber(scope.row.switchTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="packagingMethod"
          label="包装方式"
          width="90"
        ></el-table-column>
        <el-table-column prop="standardTime" label="标准工时" width="90">
          <template v-slot:default="scope">
            {{ formatNumber(scope.row.standardTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="maxPersonnel" label="人员Max" width="85">
        </el-table-column>
        <el-table-column
          prop="minPersonnel"
          label="人员Min"
          width="85"
        ></el-table-column>
        <el-table-column
          prop="employeeName"
          label="员工姓名"
          width="90"
        ></el-table-column>
        <el-table-column
          prop="number"
          label="人数"
          width="80"
        ></el-table-column>
        <el-table-column prop="state" label="状态" width="80"></el-table-column>
      </el-table>
      <div
        class="bottom"
        :style="{
          width: userMenu.isCollapse
            ? 'calc(100vw - 50px)'
            : 'calc(100vw - 250px)'
        }"
      >
        <Pagination
          :total="process.basePlanList.totalPages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="process.basePlanList.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import processManage from '../../../store/modules/metaData/processManage'
import { useRoute, useRouter } from 'vue-router'
import useUserMenu from '../../../store/modules/menu'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '../../../store/modules/user'
const userMenu = useUserMenu()

let currentPage = ref(1)
let currentSize = ref(20)

const process = processManage()
const route = useRoute() //用于获取和访问当前路由的信息
const router = useRouter()

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
function getRowClassName({ row, column, rowIndex, columnIndex }) {
  // console.log(row, 'row');
  if (column.property === 'employeeName') {
    if (row.employeeName === '员工1') {
      return 'name1'
    } else if (row.employeeName === '员工2') {
      return 'name2'
    } else if (row.employeeName === '员工3') {
      return 'name3'
    } else if (row.employeeName === '员工4') {
      return 'name4'
    } else if (row.employeeName === '员工5') {
      return 'name5'
    } else if (row.employeeName === '员工6') {
      return 'name6'
    } else if (row.employeeName === '员工7') {
      return 'name7'
    } else if (row.employeeName === '员工8') {
      return 'name8'
    } else if (row.employeeName === '员工9') {
      return 'name9'
    } else if (row.employeeName === '员工10') {
      return 'name10'
    }
  }
}
function handleLinkClick(row) {
  process
    .getProcessSchemeById(row.id)
    .then((res) => {})
    .catch((error) => {})
  console.log(row, '@@')
  router.push({ path: '/viewBasePlan' })
}

function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  process
    .getProcessScheme(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取基础工艺方案列表数据成功')
    })
    .catch((error) => {})
}

const selectedRows = ref([]) // 存储选中的行数据

// 监控路由，切换页面时自动刷新表格数据
// watch(() => route.path, () => {
//   refresh()
// })

onBeforeMount(() => {
  refresh()
})

function addRow() {
  process.createBasePlan.Edited = false
  router.push({ path: '/createBasePlan' })
}

const tableContainer = ref(null)
function handlePages(page) {
  currentPage.value = page
  // console.log(currentPage.value,'handlePages')
  process
    .getProcessScheme(page, currentSize.value)
    .then((res) => {
      const scrollContainer = tableContainer.value.querySelector(
        '.el-scrollbar__wrap'
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = 0 // 滚动到顶部
      }
      // console.log('获取分页表格数据成功')
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
  if (list.length == 0) {
    ElMessageBox.alert('请选中至少一行删除', '提示', {
      confirmButtonText: '好的'
    })
  } else {
    ElMessageBox.confirm('确定删除这些工序方案吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        process
          .deleteProcessScheme(list)
          .then((res) => {
            console.log('删除基础工艺方案成功')
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            refresh()
          })
          .catch((error) => {
            console.log(error)
            console.log('批量删除基础工艺方案失败')
          })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除'
        })
      })
  }

  // console.log(list,'批量删除工序名称')
}
function handleChange(selection) {
  // 更新 selectedRows
  selectedRows.value = selection
}
const myTable = ref(null)
function refresh() {
  currentSize.value = useUserStore().pageSize
  process
    .getProcessScheme(currentPage.value, currentSize.value)
    .then((res) => {
      // console.log(currentPage.value, 'refresh')
      if (res.code == 200) {
        ElMessage({
          type: 'success',
          message: '刷新成功'
        })
      } else {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好'
        })
      }
      myTable.value.clearSelection()
    })
    .catch((error) => {})
  console.log('查询所有基础工序列表')
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
a {
  color: #0053b5;
}
a:hover {
  cursor: pointer;
  text-decoration: underline;
}
span {
  font-size: 14px;
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

::v-deep .name1 {
  background-color: #ffc0cb; /* 某种颜色 */
}

::v-deep .name2 {
  background-color: #add8e6; /* 另一种颜色 */
}
::v-deep .name3 {
  background-color: #ffa500; /* 某种颜色 */
}

::v-deep .name4 {
  background-color: yellow; /* 另一种颜色 */
}
::v-deep .name5 {
  background-color: #e6e6fa; /* 另一种颜色 */
}
::v-deep .name6 {
  background-color: #ffffe0; /* 另一种颜色 */
}
::v-deep .name7 {
  background-color: #d3d3d3; /* 另一种颜色 */
}
::v-deep .name8 {
  background-color: #fafad2; /* 另一种颜色 */
}
::v-deep .name9 {
  background-color: #ffd1dc; /* 另一种颜色 */
}
::v-deep .name10 {
  background-color: #f5fffa; /* 另一种颜色 */
}
.bottom {
  position: fixed;
  bottom: 0;
}
</style>
