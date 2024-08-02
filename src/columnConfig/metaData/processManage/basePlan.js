export const columnConfig = [
    {
      prop: "currentProcessScheme",
      label: "当前工艺方案",
      width: 200,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      slotName: 'currentProcessScheme',
      link:true
    },
    {
      prop: "belongingProcess",
      label: "所属工序",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "productFamily",
      label: "产品族",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    // {
    //   prop: "processNumber",
    //   label: "序号",
    //   width: 60,
    //   sortable: "custom",
    //   sortOrders: ['ascending', 'descending']
    // },
    {
      prop: "processName",
      label: "工序名称",
      width: 200,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "switchTime",
      label: "切换时间(s)",
      width: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      slotName: 'switchTime',
      format:true
    },
    {
      prop: "packagingMethod",
      label: "包装方式",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "standardTime",
      label: "标准工时(s)",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      slotName: 'standardTime',
      format:true
    },
    {
      prop: "maxPersonnel",
      label: "人员Max",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "minPersonnel",
      label: "人员Min",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "employeeName",
      label: "员工姓名",
      width: 90,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "number",
      label: "人数",
      width: 80,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "state",
      label: "状态",
      width: 80,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    }
  ];
  