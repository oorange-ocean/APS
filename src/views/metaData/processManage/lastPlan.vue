<template>
  <common-plan class="plan" />
  <div class="container">
    <div class="head">
      <button @click="refresh"><span class="first">刷新</span></button>
      <button><span>导出</span></button>
    </div>
    <div class="main" ref="tableContainer">
      <el-table
        :data="process.lastPlanList.data"
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
        height="63vh"
      >
        <!-- <el-table-column type="selection" :reserve-selection="true" label="" width="35" class="one"/> -->
        <el-table-column
          prop="productFamily"
          label="产品族"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="currentProcessScheme"
          label="当前工艺方案"
          width="250"
        >
          <template v-slot:default="scope">
            <a @click="handleLinkClick(scope.row)">{{
              scope.row.currentProcessScheme
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="optimalProcessPlan"
          label="最优工艺方案"
          width="250"
        >
          <template v-slot:default="scope">
            <a @click="handleOptimalPlan(scope.row)">{{
              scope.row.optimalProcessPlan
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="经济批量" width="90">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.orderNumber" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.orderNumber }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="number"
          label="人数"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="productionLineBalanceRate"
          label="产线平衡率"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="completionTime"
          label="完成时间(h)"
          width="120"
        ></el-table-column>

        <el-table-column
          prop="releasableStaffCount"
          label="可以释放人数"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="totalReleaseTime"
          label="释放总时间(h)"
        ></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <!-- <div class="example-pagination-block">
        <el-pagination layout="prev, pager, next" :total=process.lastPlanList.totalPages*10 @current-change="handlePages"/>
      </div> -->
      <Pagination
        :total="process.lastPlanList.totalPages"
        @change-page="handlePages"
        @update-size="handleSizeChange"
        :totalRows="process.lastPlanList.total"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import processManage from '../../../store/modules/metaData/processManage'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '../../../store/modules/user'

const process = processManage()
const route = useRoute() //用于获取和访问当前路由的信息
const router = useRouter()
const newRow = [
  {
    productFamily: '',
    currentProcessScheme: '',
    optimalProcessPlan: '',
    orderNumber: '',
    number: '',
    productionLineBalanceRate: '',
    completionTime: '',
    requiredProductionStaff: '',
    averageOutputPerPerson: '',
    releasableStaffCount: '',
    totalReleaseTime: '',
    editable: true
  }
]
function changeRow(row) {
  row.editable = true
}
let currentPage = ref(1)
let currentSize = ref(20)

function handleLinkClick(row) {
  process
    .getProcessSchemeById(row.id)
    .then((res) => {})
    .catch((error) => {})
  // console.log(row,'@@')
  router.push({ path: '/viewBasePlan' })
}

function refresh() {
  currentSize.value = useUserStore().pageSize
  process
    .getProcessSchemeManagement(currentPage.value, currentSize.value)
    .then((res) => {
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
      console.log('查询所有最终工序列表')
    })
    .catch((error) => {})
}
function handleOptimalPlan(row) {
  process
    .getProcessSchemeById(row.optimalId)
    .then((res) => {
      router.push({ path: '/viewBasePlan' })
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

function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  process
    .getProcessSchemeManagement(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
}
const tableContainer = ref(null)
function handlePages(page) {
  // console.log(page)
  currentPage.value = page
  process
    .getProcessSchemeManagement(page, currentSize.value)
    .then((res) => {
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

function handleChange(selection) {
  // 更新 selectedRows
  selectedRows.value = selection
}
function saveRow(row) {
  process
    .updateProcessSchemeManagement(row)
    .then((res) => {
      console.log('更改最终工艺方案成功')
      refresh()
    })
    .catch((error) => {})
  row.editable = false
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
  margin: 24px 32px;
  flex-direction: column;
  /* background-color: red; */
}
.plan {
  flex-direction: row-reverse;
}
.head {
  height: 60px;
  width: 100%;
  background-color: #f1f4f6;
}
button {
  border: none;
  background-color: #f1f4f6;
  padding: 0;
  line-height: 60px;
  padding: 0 30px;
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
  font-size: 15px;
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
</style>
