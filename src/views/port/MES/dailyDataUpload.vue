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
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="dailyDataUpload.dailyDataUpload.data"
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
        <el-table-column prop="orderNumber" label="订单编号" width="120">
            <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.orderNumber"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.orderNumber }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialCode" label="物料编码" width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.materialCode"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.materialCode }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" width="280">
        </el-table-column>
        <el-table-column prop="processName" label="工序" width="250">
            <template #default="{ row }">
                <template v-if="row.editable">
                <el-autocomplete
                    v-model="row.processName"
                    :fetch-suggestions="querySearch"
                    clearable
                    class="inline-input w-50"
                    placeholder="Please Input"
                    @select="(item) => handleSelect(item, row)"
                />
                </template>
                <template v-else>
                    {{ row.processName }}
                </template>
          </template>
        </el-table-column>
        <el-table-column prop="totalQuantity" label="总数量">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.totalQuantity"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.totalQuantity }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="completedQuantity" label="完成数量" width="120">
            <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.completedQuantity"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.completedQuantity }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="capacityPsPuPp"
          label="产能（秒/台/人）"
          width="175"
        >
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.capacityPsPuPp"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.capacityPsPuPp }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="remainingQuantity" label="剩余数量" width="180">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.remainingQuantity"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.remainingQuantity }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="remainingCapacity" label="剩余产能" width="180">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.remainingCapacity"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.remainingCapacity }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="dailyDataUpload.dailyDataUpload.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="dailyDataUpload.dailyDataUpload.total"
        />
      </div>
    </div>
    
    <el-dialog title="导入文件" v-model="dialogVisible" width="30%">
      <!-- 文件上传 -->
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :file-list="fileList"
        :on-change="handleFileChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <!-- 底部操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="overUpload" class="confirm normal"
          >覆盖导入</el-button
        >
        <el-button @click="addUpload" class="normal">追加导入</el-button>
        <el-button @click="downloadModel" class="normal"
          >下载模板</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import useDailyDataUpload from '@/store/modules/port/MES/dailyDataUpload'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'
import useProcess from '@/store/modules/metaData/processManage'
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()

let currentPage = ref(1)
let currentSize = ref(100)

const dailyDataUpload = useDailyDataUpload()
const process = useProcess()

const route = useRoute() //用于获取和访问当前路由的信息
const router = useRouter() //用于获取和访问当前路由的信息

function downloadData() {
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
        dailyDataUpload
          .downloadDailyData({
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
  dailyDataUpload.downloadDailyDataUploadTemplate().then(res => {
    dialogVisible.value = false
  })
}

function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  dailyDataUpload.getDailyDataList(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
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


const createFilter = (queryString) => {
  return (item) => {
    return item.value.indexOf(queryString) !== -1
  }
}

let addAble = true //限制每次只能新增一行

const newRow = {
    "processName": "",
    "orderNumber": "",
    "materialCode": "",
    "materialName": "",
    "totalQuantity": "",
    "completedQuantity": "",
    "capacityPsPuPp": "",
    "remainingQuantity": "",
    "remainingCapacity": "",
    // 其他必要的字段
    "chVersion": '',
    "editable": true
}
const selectedRows = ref([]) // 存储选中的行数据


onMounted(() => {
    process
    .getProcessNamePools()
    .then((res) => {
      selectProcessName.value = process.processNames.data.map((item) => {
        return { id: item.id,value: item.processName }
      })
      console.log('点开了工序名称的下拉框')
    })
    .catch((error) => {})
    refresh()
})
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
    dailyDataUpload.addOrUpdateDailyData(
      {
        "id": row.id,
        "processId":row.processId,
        "processName": row.processName,
        "orderNumber": row.orderNumber,
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "totalQuantity": row.totalQuantity,
        "completedQuantity": row.completedQuantity,
        "capacityPsPuPp": row.capacityPsPuPp,
        "remainingQuantity": row.remainingQuantity,
        "remainingCapacity": row.remainingCapacity,
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
    dailyDataUpload.addOrUpdateDailyData(
        {
        "processId":row.processId,
        "processName": row.processName,
        "orderNumber": row.orderNumber,
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "totalQuantity": row.totalQuantity,
        "completedQuantity": row.completedQuantity,
        "capacityPsPuPp": row.capacityPsPuPp,
        "remainingQuantity": row.remainingQuantity,
        "remainingCapacity": row.remainingCapacity,
      }
    )
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
  dailyDataUpload.getDailyDataList(page, currentSize.value)
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
        dailyDataUpload.removeDailyData(list)
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
  dailyDataUpload.getDailyDataList(currentPage.value, currentSize.value)
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
  /* background-color: blue; */
  /* width: 100%; */
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
