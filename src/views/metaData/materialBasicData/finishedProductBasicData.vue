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
        :data="finishedProduct.finishedProduct.data"
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
        <el-table-column prop="materialCode" label="物料编码" min-width="160">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.materialCode" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.materialCode }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物料名称" min-width="290">
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
        <el-table-column prop="productType" label="产品类型" min-width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.productType"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.productType }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="productFamily" label="产品族" min-width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.productFamily"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.productFamily }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="maxAssemblyPersonnel" label="组装人数MAX" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.maxAssemblyPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.maxAssemblyPersonnel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="minAssemblyPersonnel" label="组装人数MIN" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.minAssemblyPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.minAssemblyPersonnel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="maxTestingPersonnel" label="测试人数MAX" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.maxTestingPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.maxTestingPersonnel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="minTestingPersonnel" label="测试人数MIN" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.minTestingPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.minTestingPersonnel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="maxPackagingPersonnel" label="包装人数MAX" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.maxPackagingPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.maxPackagingPersonnel }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="minPackagingPersonnel" label="包装人数MIN" min-width="120">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.minPackagingPersonnel"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.minPackagingPersonnel }}
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
          :total="finishedProduct.finishedProduct.pages"
          @change-page="handlePages"
          @update-size="handleSizeChange"
          :totalRows="finishedProduct.finishedProduct.total"
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
import useFinishedProduct from '@/store/modules/metaData/materialBasicData/finishedProduct'
import useUserMenu from "@/store/modules/menu"

const userMenu = useUserMenu()
const finishedProduct = useFinishedProduct()

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
      finishedProduct
        .downloadFinishedProduct({
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
        finishedProduct
          .downloadFinishedProduct({
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
  finishedProduct.imporFinishedProduct(uploadData).then((res) => {
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
  finishedProduct.finishedProductTemplate().then(res => {
    dialogVisible.value = false
  })
}



function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  finishedProduct.getFinishedProduct(currentPage.value, currentSize.value)
    .then((res) => {
      console.log('获取分页表格数据成功')
    })
    .catch((error) => {})
}

let addAble = true //限制每次只能新增一行

const newRow = {
  "materialCode": "", 
  "materialName": "", 
  "materialProperty": "", 
  "materialGroup": "", 
  "productType": "", 
  "productFamily": "", 
  "packagingMethod": "", 
  "maxAssemblyPersonnel": "", 
  "minAssemblyPersonnel": "", 
  "maxTestingPersonnel": "", 
  "minTestingPersonnel": "", 
  "maxPackagingPersonnel": "", 
  "minPackagingPersonnel": "", 
  "moq": "", 
  "mpq": "", 
  "safetyStock": "",
  "editable": true
}
const selectedRows = ref([]) // 存储选中的行数据

onMounted(() => {
  refresh()
})
onUnmounted (() => {
  finishedProduct.resetState()
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
    finishedProduct.finishedProduct.data.unshift({ ...newRow })
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
    finishedProduct.addOrUpdateFinishedProduct(
      {
        "id": row.id,
        "materialCode": row.materialCode,
        "materialProperty": row.materialProperty,
        "materialGroup": row.materialGroup,
        "productType": row.productType, 
        "productFamily": row.productFamily, 
        "packagingMethod": row.packagingMethod, 
        "maxAssemblyPersonnel": row.maxAssemblyPersonnel, 
        "minAssemblyPersonnel": row.minAssemblyPersonnel, 
        "maxTestingPersonnel": row.maxTestingPersonnel, 
        "minTestingPersonnel": row.minTestingPersonnel,
        "maxPackagingPersonnel": row.maxPackagingPersonnel, 
        "minPackagingPersonnel": row.minPackagingPersonnel,
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
    finishedProduct.addOrUpdateFinishedProduct(
      {
        "materialCode": row.materialCode,
        "materialProperty": row.materialProperty,
        "materialGroup": row.materialGroup,
        "productType": row.productType, 
        "productFamily": row.productFamily, 
        "packagingMethod": row.packagingMethod, 
        "maxAssemblyPersonnel": row.maxAssemblyPersonnel, 
        "minAssemblyPersonnel": row.minAssemblyPersonnel, 
        "maxTestingPersonnel": row.maxTestingPersonnel, 
        "minTestingPersonnel": row.minTestingPersonnel,
        "maxPackagingPersonnel": row.maxPackagingPersonnel, 
        "minPackagingPersonnel": row.minPackagingPersonnel,
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
  finishedProduct.getFinishedProduct(page, currentSize.value)
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
        finishedProduct.removeFinishedProduct(list)
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
  finishedProduct.getFinishedProduct(currentPage.value, currentSize.value)
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
