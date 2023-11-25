<template>
    <div class="container">
      <div class="column">
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
      </div>
      <div class="column">
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
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .container {
    display: flex;
    /* gap: 16px; */
  }
  h4{
    margin: 0;
    color: #0053b5;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 80%;
  }
  
  .box {
    /* border: 1px solid #ccc; */
    padding: 16px;
    /* width: 590px; */
    /* width: 38.6vw; */
    width: 90%;
    /* min-height: 269px; 根据需要调整高度 */
    /* min-height: 17.5vw; */
    min-height: 37.5vh;
    margin: 24px;
    background-color: #f1f4f6;
  }
  
  .first-box {
    /* background-color: #e6f7ff; 示例背景颜色 */
  }
  
  .second-box {
    /* background-color: red; 示例背景颜色 */
  }
  .first-box,.second-box{
    margin-right: 0;
  }
  .first-box,.third-box{
    margin-bottom: 0;
  }
  .third-box {
    /* background-color: #d9f7be; 示例背景颜色 */
  }
  
  .fourth-box {
    /* background-color: #fffbe6; 示例背景颜色 */
  }
  
  .content {
    /* 可以添加更多样式来定制内容的展示方式 */
  }
  </style>
  