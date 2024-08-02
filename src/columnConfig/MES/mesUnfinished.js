function extractColumnConfig() {
    const columns = [
      {
        prop: "productionOrderNumber",
        label: "生产订单编号",
        width: 150,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "materialCode",
        label: "物料编码",
        width: 130,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "materialName",
        label: "物料名称",
        width: 300,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "totalNumber",
        label: "订单总数",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true
      },
      {
        prop: "burnInCompletionQuantity",
        label: "本次完成数",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true
      },
      {
        prop: "burnQualifiedCount",
        label: "合格数",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true
      },
      {
        prop: "unBurnQualifiedCount",
        label: "不合格数",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true
      },
      {
        prop: "burnFixtureNumber",
        label: "工装编号",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "burnFixtureId",
        label: "机器ID",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "process",
        label: "工序名称",
        width: 150,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "workpiece",
        label: "工件",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      },
      {
        prop: "chVersion",
        label: "版本号",
        width: 120,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
      }
    ];
  
    return columns;
  }
  
  export const columnConfig = extractColumnConfig();