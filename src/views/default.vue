<template>
    <div class="container">
      
        <div class="box first-box">
            <h4>常用功能</h4>
          <div class="content">
            <!-- 内容1 -->
          </div>
        </div>
        <div class="box second-box">
            <h4>生产计划重大变更履历</h4>
          <div class="content">
            <!-- 内容2 -->
          </div>
        </div>
      

        <div class="box third-box">
            <h4>潜在重大商机同步</h4>
          <div class="content">
            <!-- 内容3 -->
          </div>
        </div>
        <div class="box fourth-box">
            <h4>运营指标分析</h4>
          <div class="content">
            <!-- 内容4 -->
          </div>
        </div>
      
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .container {
    display: grid;
    /* width: calc(100vw - 240px); */
    grid-template-columns:repeat(2,calc(50% - 12px));
    grid-template-rows:repeat(2,calc(50% - 12px));
    padding:24px;
    gap:24px;
    height: calc(100vh - 108px);
    overflow: hidden;
  }
  h4{
    margin: 0;
    color: #0053b5;
  }
  
  .box {
    display: flex;
    /* width: 100%; */
    padding: 24px;
    background-color: #f1f4f6;
    box-sizing: border-box;
    flex-direction:column;
  }
  
  </style>
  