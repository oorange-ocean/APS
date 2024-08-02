// columnConfig.js
export const columnConfig = [
    {
      prop: 'fMachineName',
      label: '机器名称',
      width: 150,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input',
    },
    {
      prop: 'fProductFamily',
      label: '产品族',
      width: 120,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-autocomplete',
    },
    {
      prop: 'fProcess',
      label: '工序名称',
      width: 180,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-autocomplete',
    },
    {
      prop: 'fMachineConfiguration',
      label: '机器规格',
      width: 400,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input',
    },
    {
      prop: 'fWorkshop',
      label: '使用车间',
      width: 120,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input',
    },
    {
      prop: 'available',
      label: '是否可用',
      width: 120,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input',
    },
    {
      prop: 'unavailableDates',
      label: '不可用时间段',
      width: 360,
      sortable: 'custom',
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-button'
    }
  ];
  