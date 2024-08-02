export const columnConfig = [
    {
      prop: "orderNumber",
      label: "订单编号",
      width: 180,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-input"
    },
    {
      prop: "materialCode",
      label: "物料编码",
      width: 180,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-input"
    },
    {
      prop: "materialName",
      label: "物料名称",
      width: 280,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "processName",
      label: "工序名称",
      width: 250,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-autocomplete",
      fetchSuggestions: "querySearch",
      clearable: true,
      placeholder: "Please Input"
    },
    {
      prop: "totalQuantity",
      label: "总数量",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-input",
      format: true
    },
    {
      prop: "completedQuantity",
      label: "完成数量",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-input",
      format: true
    },
    {
      prop: "remainingQuantity",
      label: "剩余数量",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      
      inputType: "el-input",
      format: true
    }
  ];