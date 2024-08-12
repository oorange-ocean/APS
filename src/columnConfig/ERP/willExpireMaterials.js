// materialCode
// materialName
// quantity 物料数量
// lot 批号
// type 类型
// expireDate 到期时间
// expireDays 还有多少天过期
// mark 隐藏字段
export const columnConfig = [
    {
        prop: "materialCode",
        label: "物料编码",
        minWidth: 150,
        sortable: "custom",
        
        },
        {
        prop: "materialName",
        label: "物料名称",
        minWidth: 150,
        sortable: "custom"
        },
        {
        prop: "quantity",
        label: "物料数量",
        minWidth: 80,
        sortable: "custom",
        format:true
        },
        {
        prop: "lot",
        label: "批号",
        minWidth: 120,
        sortable: "custom",
        
        },
        {
        prop: "type",
        label: "类型",
        minWidth: 120        
        },
        {
        prop: "expireDate",
        label: "到期时间",
        minWidth: 250,
        sortable: "custom",
        
        },
        {
        prop: "expireDays",
        label: "还有多少天过期",
        minWidth: 120       
        },
        // {
        // prop: "mark",
        // label: "隐藏字段",
        // minWidth: 120,
        // sortable: "custom",
        
        // }
]

export const selectFormConfig = [
    //含voColName和chColName
    {
        voColName: "materialCode",
        chColName: "物料编码",
        id:146,
        colValue:""
    },
    {
        voColName: "materialName",
        chColName: "物料名称",
        id:147,
        colValue:""
    },
    {
        voColName: "lot",
        chColName: "批号",
        colValue:""
    },
    // {
    //     voColName: "type",
    //     chColName: "类型",
    //     colValue:""
    // },
    {
        voColName: "expireDate",
        chColName: "到期时间",
        colValue:""
    },
    // {
    //     voColName: "expireDays",
    //     chColName: "还有多少天过期",
    //     colValue:""
    // },
    {
        voColName: "mark",
        chColName: "是否已过期",
        colValue:""
    },
    {
        voColName: "days",
        chColName: "从今日起第N天",
        colValue:""
    }
]
