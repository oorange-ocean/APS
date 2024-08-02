export const columnConfig = [
    {
        prop: 'fmaterialCode',
        label: '物料编码',
        width: 200,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: 'fmaterialName',
        label: '物料名称',
        width: 300,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: 'fquantity',
        label: '数量',
        width: 100,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending'],
        format:true
    },
    {
        prop: 'fstartTime',
        label: '开始制作时间',
        width: 200,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: 'frequiredDeliveryTime',
        label: '需入库时间',
        width: 200,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: 'chVersion',
        label: '版本号',
        width: 100,
        sortable: 'custom',
        sortOrders: ['ascending', 'descending']
    }
];
