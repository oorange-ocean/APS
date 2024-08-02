export const columnConfig = [
    {
      prop: "processNumber",
      label: "序号",
      width: 90
    },
    {
      prop: "belongingProcess",
      label: "所属工序",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-input"
    },
    {
      prop: "productFamily",
      label: "产品族",
      width: 180,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-autocomplete",
      optionsMethod: "querySearchProductFamily",
      clearable: true,
      class: "inline-input w-50"
    },
    {
      prop: "processName",
      label: "工序名称",
      width: 300,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-autocomplete",
      optionsMethod: "querySearch",
      clearable: true,
      class: "inline-input w-50"
    },
    {
      prop: "concurrencyCount",
      label: "并行数量",
      width: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-input"
    },
    {
      prop: "switchTime",
      label: "切换时间(s)",
      width: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-input"
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-select",
      optionsMethod: "getPackagingMethods",
      class: "m-2"
    },
    {
      prop: "standardTime",
      label: "标准工时(s)",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],  
      inputType: "el-input"
    },
    {
      prop: "maxPersonnel",
      label: "人员Max",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-input"
    },
    {
      prop: "minPersonnel",
      label: "人员Min",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: "el-input"
    }
  ];
  