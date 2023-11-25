<template>
    <div class="container">
      <div class="main">
            <el-table :data="production.productPlan.data" border 
            :cell-style="{borderColor:'#9db9d6',textAlign:'center'}" 
            :header-cell-style="{borderColor:'#9db9d6',background:'#d9e9f8',color:'#000',textAlign:'center',fontWeight:'500'}"
            row-key="id"
            @row-dblclick="changeRow"
            height="84vh"
            >
              <el-table-column prop="ftaskId" label="任务号" width="70"></el-table-column>
              <el-table-column prop="ftaskSourceId" label="任务来源" width="150">
              </el-table-column>
              <el-table-column prop="fmaterialCode" label="物料编号" width="185">
              </el-table-column>
              <el-table-column prop="fmaterialName" label="物料名称" width="290">
              </el-table-column>
              <el-table-column prop="ftotalQuantity" label="总数量" width="70"></el-table-column>
              <el-table-column prop="fcompletedQuantity" label="完成数量" width="150"></el-table-column>
              <el-table-column prop="factualStartTime" label="实际开始时间" width="180"></el-table-column>
              
              <el-table-column prop="factualCompletionTime" label="实际完成时间" width="130"></el-table-column>
              <el-table-column prop="frequiredDeliveryTime" label="需入库时间" width="120"></el-table-column>
              <el-table-column prop="fonTimeCompletion" label="是否按时完成" width="120"></el-table-column>
              <el-table-column prop="fdelayDays" label="延期天数" width="90"></el-table-column>
              <el-table-column prop="fpriority" label="优先级" width="140"></el-table-column>
              <el-table-column prop="funfinishedReason" label="未完成原因" width="400"></el-table-column>
              <el-table-column prop="frelatedOrders" label="所包含订单" width="400"></el-table-column>
              <!-- <el-table-column prop="version" label="版本号"></el-table-column> -->
              
            </el-table>
      </div>
      <div class="bottom">
        <Pagination 
         :total="production.productPlan.pages" 
         @change-page="handlePages"
         @update-size="handleSizeChange"
         :totalRows="production.productPlan.total"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import {ref,watch,onBeforeMount} from 'vue'
  import { useRoute,useRouter } from 'vue-router';
  import productionPlan from '../../store/modules/productionPlan';
  import useUserStore from '@/store/modules/user';

let currentPage = ref(1)
let currentSize = ref(20)
function handleSizeChange(newSize) {
  currentSize.value = newSize
  // console.log(currentSize.value,'currentSize')
    production.getProductionPlan(currentPage.value, currentSize.value).then(res => {
      if (res.code == 201) {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好的',
        })
      }
      console.log('获取成品計劃数据成功')
  }).catch(error => {
    
  })
}

  const production = productionPlan()
  const route = useRoute();     //用于获取和访问当前路由的信息
  const router = useRouter();    
  const newRow= [
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
                      editable:true
                  }
              ]
  function changeRow(row) {
      row.editable=true
  }
  
  
  function refresh() {
    currentSize.value = useUserStore().pageSize
      production.getProductionPlan(currentPage.value, currentSize.value).then(res => {
        if (res.code == 201) {
        ElMessageBox.alert(res.message, '提示', {
          confirmButtonText: '好的',
        })
      }
      console.log('查询产品计划列表')
    }).catch(error => {
      
    })
  }
  const selectedRows = ref([]); // 存储选中的行数据
    
    // 监控路由，切换页面时自动刷新表格数据
    // watch(() => route.path, () => {
    //   refresh()
    // })
    
    onBeforeMount(() => {
      refresh()
    })

  function handlePages(page) {
    currentPage.value = page
      production.getProductionPlan(page, currentSize.value).then(res => {
        if (res.code == 201) {
          ElMessageBox.alert(res.message, '提示', {
            confirmButtonText: '好的',
          })
        }
        console.log('获取分页表格数据成功')
    }).catch(error => {
      
    })
  }
  
  </script>
  
  <style>
    .el-table .el-table__cell{
          padding: 0;
          /* padding: 8px 0; */
    }
    
  </style>
  
  <style scoped>
  
  .container{
        display: flex;
        /* height: 555px; */
        margin: 24px 32px;
        flex-direction: column;
        /* background-color: red; */
      }
      .plan{
        flex-direction: row-reverse;
      }
      .head{
        height: 60px;
        width: 100%;
        background-color: #f1f4f6;
      }
      button{
        border: none;
        background-color: #f1f4f6;
        padding: 0;
        line-height: 60px;
        padding: 0 30px;
      }
      button:hover{
        background-color: #0053b5;
        cursor: pointer;
        color: #fff;
      }
      a{
        color: #0053b5;
      }
      a:hover{
        cursor: pointer;
        text-decoration: underline;
      }
      span{
        font-size: 15px;
      }
      .main{
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
  </style>