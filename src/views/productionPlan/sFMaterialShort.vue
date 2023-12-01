<template>
  <div class="container">
    <div class="main">
      <el-table
        :data="production.sFMaterialShort.data"
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
        @row-dblclick="changeRow"
        max-height="calc(100vh - 115px)"
      >
        <el-table-column
          prop="ftaskId"
          label="任务号"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="fparentCode"
          label="父物料编码"
          width="185"
        ></el-table-column>
        <el-table-column
          prop="fparentName"
          label="父物料名称"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="fprocess"
          label="工序"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="fsemiCode"
          label="半成品编码"
          width="130"
        ></el-table-column>
        <el-table-column prop="fsemiName" label="半成品名称" width="300"></el-table-column>
        <el-table-column
          prop="fsemiQty"
          label="半成品所需数量"
          width="90"
        >
        <template v-slot:default="scope">
          {{ formatNumber(scope.row.fsemiQty) }}
        </template>
      </el-table-column>
        <el-table-column
          prop="fsubCode"
          label="子物料编码"
          width="130"
        ></el-table-column>
        <el-table-column
          prop="fsubQty"
          label="子物料所需数量"
          width="90"
        >
        <template v-slot:default="scope">
          {{ formatNumber(scope.row.fsubQty) }}
        </template>
      </el-table-column>
        <el-table-column
          prop="fsubDeliveryTime"
          label="子物料有货时间"
          width="120"
        ></el-table-column>
      </el-table>
        <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
          <Pagination
            :total="production.sFMaterialShort.pages"
            @change-page="handlePages"
            @update-size="handleSizeChange"
            :totalRows="production.sFMaterialShort.total"
          />
        </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productionPlan from '../../store/modules/productionPlan'
import useUserStore from '@/store/modules/user';
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()

let currentPage = ref(1)
let currentSize = ref(20)

const formatNumber = (value) => {
    if (value) {
      // 创建一个新的Intl.NumberFormat实例
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,  // 数字最少位数
      });
      // 返回格式化的数字
      return formatter.format(value);
    }
};
function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  production
    .getSemiFinishedGoodsMaterialShortageAnalysis(
      currentPage.value,
      currentSize.value
    )
    .then((res) => {
      if (res.code == 201) {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好的'
        })
      }
      console.log('获取半成品计划数据成功')
    })
    .catch((error) => {})
}

const production = productionPlan()
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

function refresh() {
  currentSize.value = useUserStore().pageSize
  production
    .getSemiFinishedGoodsMaterialShortageAnalysis(
      currentPage.value,
      currentSize.value
    )
    .then((res) => {
      if (res.code == 201) {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好的'
        })
      }
      console.log('查询产品计划列表')
    })
    .catch((error) => {})
}

// 监控路由，切换页面时自动刷新表格数据
// watch(() => route.path, () => {
//   refresh()
// })

onBeforeMount(() => {
  refresh()
})

function handlePages(page) {
  currentPage.value = page
  production
    .getSemiFinishedGoodsMaterialShortageAnalysis(page, currentSize.value)
    .then((res) => {
      if (res.code == 201) {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好的'
        })
      }
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
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
  /* margin-top: 20px; */
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
.bottom {
    position: fixed;
    bottom: 0;
}
</style>
