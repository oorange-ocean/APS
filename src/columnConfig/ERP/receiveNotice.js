import { format } from "echarts";

// receiveNoticeColumnConfig.js
export const columnConfig = [
    {
      prop: "billNo",
      label: "单据编号",
      width: 150,
      sortable: "custom",
      
    },
    {
      prop: "materialId",
      label: "物料编码",
      width: 150,
      sortable: "custom",
      
    },
    {
      prop: "materialName",
      label: "物料名称",
      width: 250,
      sortable: "custom"
    },
    {
      prop: "mustQty",
      label: "实收数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "checkQty",
      label: "检测数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "receiveQty",
      label: "合格数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "csnReceiveBaseQty",
      label: "让步接收数量(基本数量)",
      width: 200,
      sortable: "custom",
      format:true
    },
    {
      prop: "inStockQty",
      label: "入库数量",
      width: 120,
      sortable: "custom",
      format:true
    },
    {
      prop: "chVersion",
      label: "版本号",
      width: 120,
      sortable: "custom"
    }
  ];
  