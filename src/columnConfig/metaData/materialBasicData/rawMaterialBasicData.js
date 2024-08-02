export const columnConfig = [
    {
      prop: "materialCode",
      label: "物料编码",
      minWidth: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      vIf: "plan.materialCode",
    },
    {
      prop: "materialName",
      label: "物料名称",
      minWidth: 200,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "materialProperty",
      label: "物料属性",
      minWidth: 90,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "materialGroup",
      label: "物料分组",
      minWidth: 110,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "procurementLeadTime",
      label: "采购周期",
      minWidth: 110,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "moq",
      label: "MOQ",
      minWidth: 100,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "mpq",
      label: "MPQ",
      minWidth: 100,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
    },
    {
      prop: "safetyStock",
      label: "安全库存",
      minWidth: 100,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],      
    }
  ];
  