<template>
  <div class="container plan">
    <el-row class="one">
        <el-button round class="white" @click="dialogVisible=true">
            <el-icon><Plus/></el-icon>
            <span>创建方案</span>
        </el-button>

        <el-button round class="white">
            <el-icon><Check /></el-icon>
            <span>保存方案</span>
        </el-button>

        <el-button type="primary" round class="blue">
            <el-icon><Plus/></el-icon>
            <span>新增筛选</span>
        </el-button>

        <el-button type="primary" round class="blue">
            <el-icon><Search /></el-icon>
            <span>搜索</span>
        </el-button>
    </el-row>
    <div class="head">
        <!-- <button><span class="first">方案一</span></button>
        <button><span>方案二</span></button> -->
    </div>

    <div class="addScheme">
      <el-dialog title="创建方案" v-model="dialogVisible" width="22%">
        当前方案：<input type="text" placeholder="请输入方案名称">
        <div class="selectAll">
            <h3>默认显示列：</h3>
            <el-checkbox 
                :indeterminate="indeterminate"
                v-model="isAll"
                @change="handleSelectAll"
                >全选</el-checkbox>
        </div>
        <div class="selectContent">
            <el-checkbox-group v-model="selectedColumns">
                <el-checkbox
                    v-for="columnName in columnNames"
                    :key="columnName"
                    :label="columnName">
                    {{ columnName }}
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <!-- 底部操作按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false" class="confirm normal"
            >确定</el-button
          >
          <el-button @click="dialogVisible=false" class="normal">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch,computed } from 'vue';
const dialogVisible = ref(false)

const props = defineProps({
  columnNames: Array
});
// 定义一个响应式引用来保存选中的列
const selectedColumns = ref([]);
const isAll = ref(false)
const indeterminate = computed(() => {
  return selectedColumns.value.length > 0 && selectedColumns.value.length < props.columnNames.length
})

// 处理全选按钮的点击
const handleSelectAll = (isChecked) => {
  if (isChecked) {
    selectedColumns.value = [...props.columnNames];
  } else {
    selectedColumns.value = [];
  }
};

console.log(props.columnNames,'columnNames')

</script>

<style>
    .plan>.el-row{
            flex-wrap: nowrap;
    }
    .addScheme .el-dialog{
        --el-dialog-padding-primary:0;
        padding: 24px 24px;
        border-radius: 12px;
    }
</style>
<style scoped lang="less">
.container{
    display: flex;
    height: 3rem;
    background-color: #f1f4f6;
    // margin: 24px 32px;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    .one{
        height: 3rem;
        align-items: center;
        margin-right: 2.5rem;
        .white{
            color: #00417b;
        }
        
    }
    .el-button{
        margin-right: 5px;
    }
    .blue{
        background-color: #1D89E9;
    }
    .head {
        height: 48px;
        width: 100%;
        background-color: #f1f4f6;
    }    
        .head button {
            border: none;
            background-color: #f1f4f6;
            padding: 0;
            line-height: 48px;
            padding: 0 25px;
            }
        .head button:hover {
            background-color: #0053b5;
            cursor: pointer;
            color: #fff;
        }
    .selectAll{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    h3{
        margin: 0;
        font-size: 14px;
        font-weight: 400;
    }
    .addScheme input{
        border: none;
        outline: none; // 去除选中状态边框
        background-color: rgba(0, 0, 0, 0);// 透明背景
    }
    .addScheme input::-webkit-input-placeholder {
          /* placeholder颜色  */
         color: #aab2bd;
         /* placeholder字体大小  */
         font-size: 12px;         /* placeholder位置  */
        text-align: left;
    }
    .dialog-footer {
        display: flex;
        // flex-direction: row-reverse;
        justify-content: center;
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
    .el-checkbox-group{
        display: grid;
        grid-template-columns:1fr 1fr;
        row-gap: 0px;
        column-gap: 5px;

    }
}

</style>