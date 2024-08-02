// purchaseOrderColumnConfig.js
export const columnConfig = [
    {
      prop: "billNo",
      label: "单据编号",
      width: 180,
      sortable: "custom",
      
    },
    {
      prop: "materialId",
      label: "物料编号",
      width: 180,
      sortable: "custom",
      
    },
    {
      prop: "materialName",
      label: "物料名称",
      width: 250,
      sortable: "custom"
    },
    {
      prop: "baseUnitQty",
      label: "剩余数量",
      width: 180,
      sortable: "custom",
      format:true
    },
    {
      prop: "arrivalDate",
      label: "交货日期",
      width: 180,
      sortable: "custom",
      
    },
    {
      prop: "formName",
      label: "表单名称",
      width: 180,
      sortable: "custom",
      
    },
    {
      prop: "chVersion",
      label: "版本号",
      width: 100,
      sortable: "custom"
    }
  ];
  