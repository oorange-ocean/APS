<template>
  <div class="container">
    <el-row class="one">
        <el-button round class="white">
            <el-icon><Plus/></el-icon>
            <span>创建方案</span>
        </el-button>

        <el-button round class="white">
            <el-icon><Select/></el-icon>
            <span>保存</span>
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
  </div>
</template>

<script setup>


</script>

<style scoped lang="less">
.container{
    display: flex;
    height: 60px;
    background-color: #f1f4f6;
    margin: 24px 32px; 
    box-sizing: border-box;
    flex-direction: row-reverse;
    .one{
        height: 60px;
        align-items: center;
        margin-right: 40px;
        .white{
            color: #00417b;
        }
    }
    .el-button{
        margin-right: 18px;
    }
    .blue{
        background-color: #1D89E9;
    }
}

</style>