export const columnConfig = [
    {
      prop: "productFamily",
      label: "产品族",
      width: 170,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "currentProcessScheme",
      label: "当前工艺方案",
      width: 250,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      link: true
    },
    {
      prop: "optimalProcessPlan",
      label: "最优工艺方案",
      width: 250,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      link: true
    },
    {
      prop: "orderNumber",
      label: "经济批量",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      format:true
    },
    {
      prop: "number",
      label: "人数",
      width: 90,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "productionLineBalanceRate",
      label: "产线平衡率",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "completionTime",
      label: "完成时间(h)",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "releasableStaffCount",
      label: "可以释放人数",
      width: 130,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "totalReleaseTime",
      label: "释放总时间(h)",
      width: 200,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    }
  ];
  