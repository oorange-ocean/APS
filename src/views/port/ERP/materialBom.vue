<template>
  <common-plan class="plan" />
  <div class="container">
    <div class="head">
      <button @click="addRow"><span class="first">新增</span></button>
      <button @click="modifyRow"><span>修改</span></button>
      <button @click="deleteSelectedRows"><span>删除</span></button>
      <button @click="refresh"><span>刷新</span></button>
      <button @click="dialogVisible = true"><span>导入</span></button>
      <button @click="downloadData"><span>导出</span></button>
    </div>
    <div class="main" ref="tableContainer">
      <el-table
        :data="ImmediateInventory.materialBom.data"
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
        height="62vh"
        ref="myTable"
      >
        <el-table-column
          type="selection"
          :reserve-selection="true"
          label=""
          width="35"
          class="one"
        />
        <el-table-column prop="materialId" label="父项物料编码" width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.materialId" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.materialId }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="父项物料名称" width="270">
        </el-table-column>
        <el-table-column prop="documentStatus" label="数据状态" width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.documentStatus"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.documentStatus }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="materialIdChild"
          label="子项物料编码"
          width="110"
        >
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.materialIdChild"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.materialIdChild }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="materialNameChild"
          label="子项物料名称"
          width="235"
        >
        </el-table-column>
        <el-table-column prop="numerator" label="用量：分子" width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.numerator" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.numerator }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="denominator" label="用量：分母" width="100">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.denominator" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.denominator }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="fixScrapQtyLot" label="固定损耗" width="90">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.fixScrapQtyLot"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.fixScrapQtyLot }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="scrapRate" label="变动损耗率%" width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.scrapRate" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.scrapRate }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="materialType" label="子项类型" width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.materialType"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.materialType }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="replaceType" label="替代方案" width="110">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.replaceType" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.replaceType }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="replaceGroupBop" label="项次" width="80">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input
                v-model="row.replaceGroupBop"
                @keyup.enter="saveRow(row)"
              />
            </template>
            <template v-else>
              {{ row.replaceGroupBop }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="process" label="工序" width="80">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.process" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.process }}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="bomVersion" label="BOM版本" width="150">
          <template #default="{ row }">
            <template v-if="row.editable">
              <el-input v-model="row.bomVersion" @keyup.enter="saveRow(row)" />
            </template>
            <template v-else>
              {{ row.bomVersion }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="chVersion"
          label="版本号"
          width="100"
        ></el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <Pagination
        :total="ImmediateInventory.materialBom.pages"
        @change-page="handlePages"
        @update-size="handleSizeChange"
        :totalRows="ImmediateInventory.materialBom.total"
      />
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
import { ref, watch, onBeforeMount, onMounted,onUnmounted  } from 'vue'
import CommonPlan from '@/components/CommonPlan.vue'
import processManage from '../../../store/modules/metaData/processManage'
import useImmediateInventory from '../../../store/modules/port/ERP/immediateInventory'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import useUserStore from '@/store/modules/user'


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
      ImmediateInventory
        .downloadSchemeManagement({
          type: 3,
          page: currentPage.value,
          size: currentSize.value
        },10)
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
        ImmediateInventory
          .downloadSchemeManagement({
            type: 4
          },10)
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
  ImmediateInventory.importInterfaceData(uploadData,10).then((res) => {
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
  ImmediateInventory.downloadInterfaceTemplate(10,).then(res => {
    dialogVisible.value = false
  })
}

const process = processManage()
const ImmediateInventory = useImmediateInventory()
const route = useRoute() //用于获取和访问当前路由的信息
const router = useRouter() //用于获取和访问当前路由的信息

function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
  ImmediateInventory.getAllPage(currentPage.value, currentSize.value, 10)
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

let addAble = true //限制每次只能新增一行

const newRow = {
  materialId: '',
  materialName: '',
  documentStatus: '',
  materialIdChild: '',
  materialNameChild: '',
  numerator: '',
  denominator: '',
  fixScrapQtyLot: '',
  scrapRate: '',
  materialType: '',
  replaceType: '',
  replaceGroupBop: '',
  process: '',
  bomVersion: '',
  chVersion: '',
  editable: true
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
  ImmediateInventory.resetState()
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
    ImmediateInventory.materialBom.data.unshift({ ...newRow })
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
    ImmediateInventory.update(
      {
        id: row.id,
        materialId: row.materialId,
        materialName: row.materialName,
        documentStatus: row.documentStatus,
        materialIdChild: row.materialIdChild,
        materialNameChild: row.materialNameChild,
        numerator: row.numerator,
        denominator: row.denominator,
        fixScrapQtyLot: row.fixScrapQtyLot,
        scrapRate: row.scrapRate,
        materialType: row.materialType,
        replaceType: row.replaceType,
        replaceGroupBop: row.replaceGroupBop,
        process: row.process,
        bomVersion: row.bomVersion
      },
      10
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
    ImmediateInventory.add(
      {
        materialId: row.materialId,
        materialName: row.materialName,
        documentStatus: row.documentStatus,
        materialIdChild: row.materialIdChild,
        materialNameChild: row.materialNameChild,
        numerator: row.numerator,
        denominator: row.denominator,
        fixScrapQtyLot: row.fixScrapQtyLot,
        scrapRate: row.scrapRate,
        materialType: row.materialType,
        replaceType: row.replaceType,
        replaceGroupBop: row.replaceGroupBop,
        process: row.process,
        bomVersion: row.bomVersion
      },
      10
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
  ImmediateInventory.getAllPage(page, currentSize.value, 10)
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
        ImmediateInventory.deleteData(list, 10)
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
  ImmediateInventory.getAllPage(currentPage.value, currentSize.value, 10)
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
      myTable.value.clearSelection()
    })
    .catch((error) => {})
  console.log('查询所有工序产能')
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
</style>
