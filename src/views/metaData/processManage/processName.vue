<template>
  <div class="container">
    <div class="head">
      <button @click="addRow"><span class="first">新增</span></button>
      <button @click="modifyRow"><span>修改</span></button>
      <button @click="deleteSelectedRows"><span>删除</span></button>
      <button @click="refresh"><span>刷新</span></button>
      <button @click="dialogVisible = true"><span>导入</span></button>
      <button @click="downloadData"><span>导出</span></button>
    </div>
    <common-plan class="plan" />
    <div class="main" ref="tableContainer">
      <el-table
        :data="process.processNames.data"
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
        ref="myTable"
        max-height="calc(100vh - 258px)"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          label=""
          width="35"
          class="one"
        />
        <el-table-column prop="number" label="序号" width="100" />
        <el-table-column prop="processName" label="工序名称">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.processName" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.processName }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="process.processNames.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="process.processNames.total"
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
import { ref, watch, onBeforeMount } from 'vue'
import CommonPlan from '../../../components/CommonPlan.vue'
import processManage from '../../../store/modules/metaData/processManage'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import { ElMessageBox } from 'element-plus'
import useUserStore from '../../../store/modules/user'
import { getToken } from '../../../utils/auth'
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()

const process = processManage()
const route = useRoute() //用于获取和访问当前路由的信息
const router = useRouter() //用于执行路由导航的操作
let currentPage = ref(1)
let currentSize = ref(20)

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
  process.uploadNameFile(uploadData).then((res) => {
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
  process.proceeNameTemplate().then(res => {
    dialogVisible.value = false
  })
  
}


let addAble = true //限制每次只能新增一行

const newRow = {
  id: '',
  processName: '',
  editable: true // 新增的行默认为可编辑状态
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
    .getProcessNamePoolsPages(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
}
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
const tableContainer = ref(null)
function handlePages(page) {
  currentPage.value = page
  process
    .getProcessNamePoolsPages(page, currentSize.value)
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

function moveUp() {
  const selected = selectedRows.value // Assuming you have stored the selected rows in this.selectedRows
  if (selected.length !== 1) {
    ElMessageBox.alert('请选中一行移动', '提示', {
      confirmButtonText: '好的'
    })
    return
  }
  const index = process.processNames.data.indexOf(selected[0])
  if (index > 0) {
    const temp = process.processNames.data[index - 1]
    process.processNames.data[index - 1] = process.processNames.data[index]
    process.processNames.data[index] = temp
  }
}
function moveDown() {
  const selected = selectedRows.value // Assuming you have stored the selected rows in this.selectedRows
  if (selected.length !== 1) {
    ElMessageBox.alert('请选中一行移动', '提示', {
      confirmButtonText: '好的'
    })
    return
  }
  const index = process.processNames.data.indexOf(selected[0])
  if (index < process.processNames.data.length - 1) {
    const temp = process.processNames.data[index + 1]
    process.processNames.data[index + 1] = process.processNames.data[index]
    process.processNames.data[index] = temp
  }
}

function addRow() {
  if (addAble) {
    const scrollContainer = tableContainer.value.querySelector(
      '.el-scrollbar__wrap'
    )
    if (scrollContainer) {
      scrollContainer.scrollTop = 0 // 滚动到顶部
    }
    process.processNames.data.unshift({ ...newRow })
    addAble = false
  } else {
    return
  }
}

function saveRow(row) {
  // 这里可以添加保存数据的逻辑，例如将数据发送到后端
  // 修改数据
  // console.log('修改数据', row)
  if (row.id) {
    process
      .updateProcessName({ id: row.id, processName: row.processName })
      .then((res) => {
        console.log('工序名修改成功')
      })
      .catch((error) => {
        console.log(row.id)
        console.log('工序名修改失败')
      })
    console.log('修改工序名')
    row.editable = false
  }
  // 新增数据
  else {
    process
      .updateProcessName({ processName: row.processName })
      .then((res) => {
        addAble = true
        console.log('工序添加成功')
        refresh()
      })
      .catch((error) => {
        console.log(error)
        console.log('工序名添加失败')
      })

    // 序号自动加1
    // row.id = process.processNames.length;
    // 保存成功后可以在这里更新状态或执行其他操作
    row.editable = false // 保存后将行设置为不可编辑状态
    // addAble = true;
  }
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
        process
          .deleteProcessName(list)
          .then((res) => {
            console.log('删除工序名成功')
            ElMessage({
              type: 'success',
              message: '删除成功'
            })
            refresh()
          })
          .catch((error) => {
            console.log(error)
            console.log('批量删除工序名失败')
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
function downloadData() {
  ElMessageBox.confirm('请选择你要导出的数据', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '当前页',
    cancelButtonText: '全部页',
    type: 'warning'
  })
    .then(() => {
      process
        .downloadProceeName({
          type: 3,
          page: currentPage.value,
          size: currentSize.value
        })
        .then((res) => {
          ElMessage({
            type: 'success',
            message: '导出当前页成功'
          })
        })
    })
    .catch((action) => {
      if (action === 'cancel') {
        process
          .downloadProceeName({
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

function handleChange(selection) {
  // 更新 selectedRows
  selectedRows.value = selection
}
const myTable = ref(null)
function refresh() {
  currentSize.value = useUserStore().pageSize
  addAble = true
  process
    .getProcessNamePoolsPages(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('查询所有工序名称', res)
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
  // console.log('查询所有工序名称')
}
</script>
<style>
.el-table .el-table__cell {
  padding: 0;
  /* padding: .5rem 0; */
}
.el-dialog__body {
  padding: 1.875rem 1.25rem 1.25rem 1.25rem;
}
.el-dialog {
  /* align-items: center;
  justify-content: center; */
  margin: 0 auto;
  margin-top: 25vh;
}
</style>
<style scoped>
.container {
  display: flex;
  /* height: 34.6875rem; */
  margin: 1.5rem;
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
span {
  font-size: 14px;
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
.main {
  /* background-color: blue; */
  /* width: 100%; */
  flex: 1;
  margin-top: 1.25rem;
}
.el-table {
  border: 0.0625rem solid #9db9d6;
  /* background-color: red; */
}
.example-pagination-block {
  /* margin-bottom: 1rem; */
  margin-top: 0.625rem;
  display: flex;
  flex-direction: row-reverse;
}
.bottom {
    position: fixed;
    bottom: 0;
}
</style>
