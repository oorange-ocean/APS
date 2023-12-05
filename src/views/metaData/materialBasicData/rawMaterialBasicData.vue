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
        :data="rawBasicData.rawMaterialBasic.data"
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
        <el-table-column prop="materialCode" label="物料编码" min-width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.materialCode" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.materialCode }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" min-width="200">
        </el-table-column>
        <el-table-column prop="materialProperty" label="物料属性" min-width="90">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.materialProperty" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.materialProperty }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialGroup" label="物料分组" min-width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.materialGroup"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.materialGroup }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="procurementLeadTime"
          label="采购周期"
          min-width="110"
        >
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.procurementLeadTime"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.procurementLeadTime }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="moq" label="MOQ" min-width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.moq" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.moq }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="mpq" label="MPQ" min-width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.mpq" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.mpq }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="safetyStock" label="安全库存" min-width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.safetyStock" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.safetyStock }}
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
        <Pagination
          :total="rawBasicData.rawMaterialBasic.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="rawBasicData.rawMaterialBasic.total"
        />
      </div>
    </div>
    
    <div class="importData">
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
  </div>
</template>

<script setup>
import { ref, onMounted,onUnmounted  } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'
import useRawBasicData from '@/store/modules/metaData/materialBasicData/rawBasicData'
import useUserMenu from "@/store/modules/menu"
const userMenu = useUserMenu()
const rawBasicData = useRawBasicData()


let currentPage = ref(1)
let currentSize = ref(20)

function downloadData() {
  ElMessageBox.confirm('请选择你要导出的数据', '提示', {
    distinguishCancelAndClose: true,
    confirmButtonText: '当前页',
    cancelButtonText: '全部页',
    type: 'warning'
  })
    .then(() => {
      rawBasicData
        .downloadRawMaterial({
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
        rawBasicData
          .downloadRawMaterial({
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
const dialogVisible = ref(false)
const fileToUpload = ref(null)
const fileList = ref([])
const importType = ref(1)

function handleFileChange(file) {
  // 存储用户选中的文件
  fileToUpload.value = file
}
// console.log(fileToUpload.value, 'fileToUpload')

async function addUpload() {
  if (!fileToUpload.value) {
    // console.log('没有选择文件')
    ElMessageBox.alert('请上传文件后导入', '提示', {
        type: 'info',
        confirmButtonText: '好的'
      })
    // dialogVisible.value = false
    return
  }

  const uploadData = {
    file: fileToUpload.value,
    type: importType.value // 您可以根据需要添加其他数据
  }
  rawBasicData.imporRawMaterial(uploadData).then((res) => {
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
  rawBasicData.rawMaterialTemplate().then(res => {
    dialogVisible.value = false
  })
}




function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  rawBasicData.getRawMaterialBasic(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
}

let addAble = true //限制每次只能新增一行

const newRow = {
  "materialCode": "",
  "materialName": null,
  "materialProperty": "",
  "materialGroup": "",
  "procurementLeadTime": "",
  "moq": "",
  "mpq": "",
  "safetyStock": null,
  "editable": true
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
onUnmounted (() => {
  rawBasicData.resetState()
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
    rawBasicData.rawMaterialBasic.data.unshift({ ...newRow })
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
    rawBasicData.addOrUpdateRawMaterial(
      {
        "id": row.id,
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "materialProperty": row.materialProperty,
        "materialGroup": row.materialGroup,
        "procurementLeadTime": row.procurementLeadTime,
        "moq": row.moq,
        "mpq": row.mpq,
        "safetyStock": row.safetyStock
      }
    )
      .then((res) => {
        refresh()
      })
      .catch((error) => {
        refresh()
      })
    // console.log('修改工序名')
    row.editable = false
  }
  // 新增数据
  else {
    // console.log(addAble,'@@@')
    rawBasicData.addOrUpdateRawMaterial(
      {
        "materialCode": row.materialCode,
        "materialName": row.materialName,
        "materialProperty": row.materialProperty,
        "materialGroup": row.materialGroup,
        "procurementLeadTime": row.procurementLeadTime,
        "moq": row.moq,
        "mpq": row.mpq,
        "safetyStock": row.safetyStock
      }
    )
      .then((res) => {
        addAble = true
        if (res.code == 200) {

        } else {
          ElMessageBox.alert('数据不能为空', '添加数据失败', {
            confirmButtonText: '好'
          })
        }
        refresh()
      })
      .catch((error) => {
        console.log(error)

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
  rawBasicData.getRawMaterialBasic(page, currentSize.value)
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
        rawBasicData.removeRawMaterial(list)
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
  rawBasicData.getRawMaterialBasic(currentPage.value, currentSize.value)
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
