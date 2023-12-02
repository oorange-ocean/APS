<template>
  <div class="container">
    <div class="head">
      <button @click="fresh"><span>刷新</span></button>
      <button @click="downloadData"><span>导出</span></button>
    </div>
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="useFimRequest.fimPriority.data"
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
        <el-table-column prop="productionId" label="生产ID" width="90">
        </el-table-column>
        <el-table-column prop="taskSourceId" label="任务来源ID" width="120">
        </el-table-column>
        <el-table-column prop="mterialCode" label="物料编码" width="150">
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" min-width="270">
        </el-table-column>
        
        <el-table-column
          prop="replenishmentQuantity"
          label="需补货数量"
          width="120"
        >
          <template v-slot:default="scope">
            {{ formatNumber(scope.row.replenishmentQuantity) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="expectedStartTime"
          label="预计开始时间"
          width="120"
        >
        </el-table-column>
        <el-table-column prop="requiredDeliveryTime" label="需入库时间" width="120">
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="200">
        </el-table-column>
        <el-table-column prop="containedSalesOrders" label="所包含销售订单" width="250">
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="useFimRequest.fimPriority.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="useFimRequest.fimPriority.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeMount, onMounted,onUnmounted  } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import processManage from '../../../store/modules/metaData/processManage'
import useImmediateInventory from '../../../store/modules/port/ERP/immediateInventory'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'
import useUserMenu from "@/store/modules/menu"
import fimRequest from '@/store/modules/port/FIM/fimRequest'
const userMenu = useUserMenu()
const useFimRequest = fimRequest()

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
function downloadData() {
  ElMessageBox.confirm('请选择你要导出的数据', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '当前页',
    cancelButtonText: '全部页',
    type: 'warning'
  })
    .then(() => {
      useFimRequest
        .downloadFimPriority({
          type: 3,
          page: currentPage.value,
          size: currentSize.value
        })
        .then((res) => {
          if (res.code == 200) {
              ElMessage({
                  type: 'success',
                  message: '导出当前页成功'
              })
          }
          // console.log(res,'res')
        })
    })
    .catch((action) => {
      if (action === 'cancel') {
        useFimRequest
          .downloadFimPriority({
            type: 4
          })
          .then((res) => {
            if (res.code == 200) {
              ElMessage({
                  type: 'success',
                  message: '导出全部页成功'
              })
            }
          })
      }
    })
}

function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  useFimRequest.getFimPriority(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
}


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
})
// onUnmounted (() => {
//   ImmediateInventory.resetState()
// })

function changeRow(row) {
  row.editable = true
}


const myTable = ref(null)

function saveRow(row) {
  // 这里可以添加保存数据的逻辑，例如将数据发送到后端
  // 修改数据
  //   console.log('修改数据', row)
  if (row.id) {
    useFimRequest.addOrUpdateFimRequest(
      {
        "id": row.id,
        "documentNumber": row.documentNumber,
        "creator": row.creator,
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "customerName": row.customerName,
        "salesperson": row.salesperson,
        "quantity": row.quantity,
        "expectedDeliveryDate": row.expectedDeliveryDate,
        "documentType": row.documentType,
      }
    )
      .then((res) => {
        console.log('产能修改成功')
        refresh()
      })
      .catch((error) => {
        refresh()
        console.log(row.id)
        console.log('产能修改失败')
      })
    // console.log('修改工序名')
    row.editable = false
  }
  // 新增数据
  else {
    // console.log(addAble,'@@@')
    useFimRequest.addOrUpdateFimRequest(
      {
        "documentNumber": row.documentNumber,
        "creator": row.creator,
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "customerName": row.customerName,
        "salesperson": row.salesperson,
        "quantity": row.quantity,
        "expectedDeliveryDate": row.expectedDeliveryDate,
        "documentType": row.documentType,
      }
    )
      .then((res) => {
        // addAble = true
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
        refresh()
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
  useFimRequest.getFimPriority(page, currentSize.value)
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

function refresh() {
  // addAble = true
  currentSize.value = useUserStore().pageSize
  useFimRequest.getFimPriority(currentPage.value, currentSize.value)
    .then((res) => {
      if (res.code == 200) {
        
      } else {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好'
        })
      }
      myTable.value.clearSelection()
    })
    .catch((error) => {})
  console.log('查询所有工序产能')
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
  flex: 1;
  margin-top: 20px;
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
