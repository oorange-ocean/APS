<template>
    <div class="container">
      <div class="head">
        <button @click="addRow"><span class="first">新增</span></button>
        <button @click="modifyRow"><span>修改</span></button>
        <button @click="deleteSelectedRows"><span>删除</span></button>
        <button @click="fresh"><span>刷新</span></button>
        <button @click="downloadData"><span>导出</span></button>
      </div>
      <common-plan class="plan" />
      <div class="main" ref="tableContainer">
        <el-table
          :data="ImmediateInventory.outsourcedOrder.data"
          border
          :cell-style="{ borderColor: '#9db9d6', textAlign: 'center' }"
          :header-cell-style="{
            borderColor: '#9db9d6',
            background: '#d9e9f8',
            color: '#000',
            textAlign: 'center',
            fontWeight: '500',
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
          <el-table-column prop="billNo" label="单据编码" width="120">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.billNo"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ row.billNo }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="billType"
            label="单据类型"
            width="120"
          >
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.billType"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ row.billType }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="materialId" label="物料编码" width="130">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.materialId"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ row.materialId }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="materialName" label="物料名称">
          </el-table-column>
          <el-table-column
            prop="qty"
            label="数量"
            width="80"
          >
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.qty"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ formatNumber(row.qty) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="业务状态" width="90">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input v-model="row.status" @keyup.enter="saveRow(row)" />
              </template>
              <template v-else>
                {{ row.status }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="pickMtrlStatus" label="领料状态" width="90">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.pickMtrlStatus"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ row.pickMtrlStatus }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="stockInQty" label="入库数量" width="90">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.stockInQty"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ formatNumber(row.stockInQty) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="bomId" label="BOM版本" width="150">
            <template #default="{ row }">
              <template v-if="row.editable">
                <el-input
                  v-model="row.bomId"
                  @keyup.enter="saveRow(row)"
                />
              </template>
              <template v-else>
                {{ row.bomId }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="chVersion"
            label="版本号"
            width="85"
          ></el-table-column>
        </el-table>
        <div class="bottom" :style="{ width: userMenu.isCollapse ? 'calc(100vw - 50px)' : 'calc(100vw - 250px)' }">
          <Pagination
            :total="ImmediateInventory.outsourcedOrder.pages"
            @change-page="handlePages"
            @update-size="handleSizeChange"
            :totalRows="ImmediateInventory.outsourcedOrder.total"
          />
        </div>
      </div>
      
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onUnmounted , onMounted } from "vue";
  import CommonPlan from "@/components/CommonPlan.vue";
  import processManage from "../../../store/modules/metaData/processManage";
  import useImmediateInventory from "../../../store/modules/port/ERP/immediateInventory";
  import { useRoute, useRouter } from "vue-router";
  import Pagination from "@/components/Pagination.vue";
  import useUserStore from "@/store/modules/user";
  import useUserMenu from "@/store/modules/menu"
  const userMenu = useUserMenu()
  
  let currentPage = ref(1);
  let currentSize = ref(20);
  
  const process = processManage();
  const ImmediateInventory = useImmediateInventory();
  const route = useRoute(); //用于获取和访问当前路由的信息
  const router = useRouter(); //用于获取和访问当前路由的信息


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
      ImmediateInventory
        .downloadSchemeManagement({
          type: 3,
          page: currentPage.value,
          size: currentSize.value
        },4)
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
          },4)
          .then((res) => {
            ElMessage({
              type: 'success',
              message: '导出全部页成功'
            })
          })
      }
    })
}
  
  function handleSizeChange(newSize) {
    currentSize.value = newSize;
    // console.log(currentSize.value,'currentSize')
    ImmediateInventory.getAllPage(currentPage.value, currentSize.value, 4)
      .then((res) => {
        console.log("获取分页表格数据成功");
      })
      .catch((error) => {});
  }
  
  const selectProcessName = ref([]);
  const selectProductFamily = ref([]);
  // const selectPackagingMethod = ref([])
  
  const querySearch = (queryString, cb) => {
    const results = queryString
      ? selectProcessName.value.filter(createFilter(queryString))
      : selectProcessName.value;
    cb(results);
  };
  const querySearchProductFamily = (queryString, cb) => {
    const results = queryString
      ? selectProductFamily.value.filter(createFilter(queryString))
      : selectProductFamily.value;
    cb(results);
  };
  
  const createFilter = (queryString) => {
    return (item) => {
      return item.value.indexOf(queryString) !== -1;
    };
  };
  
  let addAble = true; //限制每次只能新增一行
  
  const newRow = {
        "billNo": "",
        "billType": "",
        "materialId": "",
        "materialName": "",
        "qty": "",
        "status": "",
        "pickMtrlStatus": "",
        "stockInQty": "",
        "bomId": "",
        "chVersion": "",
        "editable": true,
  };
  const selectedRows = ref([]); // 存储选中的行数据
  
  // 监控路由，切换页面时自动刷新表格数据
  // watch(
  //   () => route.path,
  //   () => {
  //     refresh();
  //   }
  // );
  
  onMounted(() => {
    refresh();
  });
  onUnmounted (() => {
  ImmediateInventory.resetState()
})
  
  function changeRow(row) {
    row.editable = true;
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
  
  const myTable = ref(null);
  function addRow() {
    if (addAble) {
      const scrollContainer = tableContainer.value.querySelector(
      '.el-scrollbar__wrap'
    )
    if (scrollContainer) {
      scrollContainer.scrollTop = 0 // 滚动到顶部
    }
      ImmediateInventory.outsourcedOrder.data.unshift({ ...newRow });
      addAble = false;
    } else {
      return;
    }
  }
  
  function saveRow(row) {
    // 这里可以添加保存数据的逻辑，例如将数据发送到后端
    // 修改数据
    //   console.log('修改数据', row)
    if (row.id) {
      ImmediateInventory.update
        ({
        "id":row.id,
        "billNo": row.billNo,
        "billType": row.billType,
        "materialId": row.materialId,
        "materialName": row.materialName,
        "qty": row.qty,
        "status": row.status,
        "pickMtrlStatus": row.pickMtrlStatus,
        "stockInQty": row.stockInQty,
        "bomId": row.bomId
        },4)
        .then((res) => {
          console.log("产能修改成功");
          refresh()
        })
        .catch((error) => {
          refresh();
          console.log(row.id);
          console.log("产能修改失败");
        });
      // console.log('修改工序名')
      row.editable = false;
    }
    // 新增数据
    else {
      // console.log(addAble,'@@@')
      ImmediateInventory
        .add({
            "billNo": row.billNo,
            "billType": row.billType,
            "materialId": row.materialId,
            "materialName": row.materialName,
            "qty": row.qty,
            "status": row.status,
            "pickMtrlStatus": row.pickMtrlStatus,
            "stockInQty": row.stockInQty,
            "bomId": row.bomId
        },4)
        .then((res) => {
          addAble = true;
          if (res.code == 200) {
            console.log("产能添加成功");
          } else {
            ElMessageBox.alert("数据不能为空", "添加数据失败", {
              confirmButtonText: "好",
            });
          }
          refresh();
        })
        .catch((error) => {
          console.log(error);
          console.log("产能添加失败");
          refresh();
        });
  
      // 序号自动加1
      // row.id = process.processNames.length;
      // 保存成功后可以在这里更新状态或执行其他操作
      row.editable = false; // 保存后将行设置为不可编辑状态
      // addAble = true;
    }
  }
  const tableContainer = ref(null)
  function handlePages(page) {
    // console.log(page)
    currentPage.value = page;
    ImmediateInventory.getAllPage(page, currentSize.value, 4)
      .then((res) => {
        const scrollContainer = tableContainer.value.querySelector(
      '.el-scrollbar__wrap'
    )
    if (scrollContainer) {
      scrollContainer.scrollTop = 0 // 滚动到顶部
    }
        console.log("获取分页表格数据成功");
      })
      .catch((error) => {});
  }
  function deleteSelectedRows() {
    // 在这里处理删除选中行的逻辑，可以从 selectedRows 中获取选中行的数据
    // 批量删除
    const list = [];
    selectedRows.value.forEach((row) => {
      list.push(row.id);
    });
    // console.log(list,'批量删除工序名称')
    if (list.length == 0) {
        ElMessageBox.alert('请选中至少一行删除', '提示', {
          confirmButtonText: '好的'
        })
      } else { 
          ElMessageBox.confirm("确定删除这些工序吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          ImmediateInventory
            .deleteData(list,4)
            .then((res) => {
              console.log("删除产能成功");
              ElMessage({
                type: "success",
                message: "删除成功",
              });
              refresh();
            })
            .catch((error) => {
              console.log(error);
              console.log("批量删除产能失败");
            });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消删除",
          });
        });
      }
    
  }
  function handleChange(selection) {
    // 更新 selectedRows
    selectedRows.value = selection;
  }
  
  function refresh() {
    addAble = true;
    currentSize.value = useUserStore().pageSize
    ImmediateInventory.getAllPage(currentPage.value, currentSize.value, 4)
      .then((res) => {
        if (res.code == 200) {
      } else {
        ElMessageBox.alert(res.message, "提示", {
            confirmButtonText: "好",
          });
      }
        myTable.value.clearSelection()
      })
      .catch((error) => {});
    console.log("查询所有工序产能");
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
  