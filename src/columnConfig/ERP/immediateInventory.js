// columnConfig.js
export const columnConfig = [
    {
        prop: "materialId",
        label: "物料编码",
        width: 160,
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
        prop: "stockName",
        label: "仓库名称",
        width: 150,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: "baseQty",
        label: "库存量(基本单位)",
        width: 180,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true
    },
    {
        prop: "avbQty",
        label: "可用量(主单位)",
        width: 180,
        sortable: "custom",
        sortOrders: ['ascending', 'descending'],
        format: true

    },
    {
        prop: "lot",
        label: "批号",
        width: 130,
        sortable: "custom",
        sortOrders: ['ascending', 'descending']
    },
    {
        prop: "expiryDate",
        label: "有效期至",
        width: 180,
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
