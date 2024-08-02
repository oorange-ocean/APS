// columnConfig.js
export const columnConfig = [
    {
      prop: "materialId",
      label: "产品编码",
      width: 110,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
    },
    {
      prop: "materialName",
      label: "产品名称",
      width: 250,
      sortable: "custom"
    },
    {
      prop: "subReqBillNo",
      label: "订单编号",
      width: 150,
      sortable: "custom",
      
    },
    {
      prop: "materialId2",
      label: "子项物料编码",
      width: 130,
      sortable: "custom",
      
    },
    {
      prop: "materialName2",
      label: "子项物料名称",
      width: 230,
      sortable: "custom"
    },
    {
      prop: "materialType",
      label: "子项类型",
      width: 120,
      sortable: "custom",
      
    },
    {
      prop: "mustQty",
      label: "应发数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "pickedQty",
      label: "已领数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "goodReturnQty",
      label: "良品退料数量",
      width: 150,
      sortable: "custom",
      format:true
    },
    {
      prop: "processDefectReturnQty",
      label: "作业不良退料数量",
      width: 160,
      sortable: "custom",
      format:true
    },
    {
      prop: "dzmaterialId",
      label: "定制物料编码",
      width: 150,
      sortable: "custom",
      
    },
    {
      prop: "formName",
      label: "表单名称",
      width: 150,
      sortable: "custom",
      
    },
    {
      prop: "chVersion",
      label: "版本号",
      width: 120,
      sortable: "custom"
    }
  ];
  