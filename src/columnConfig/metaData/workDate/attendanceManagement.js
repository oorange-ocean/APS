export const columnConfig = [
    {
      prop: "employeeName",
      label: "员工姓名",
      minWidth: 100,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "date",
      label: "日期",
      minWidth: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "dayOfWeek",
      label: "星期",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "isWorkday",
      label: "是否为工作日",
      width: 180,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    },
    {
      prop: "attendanceTimeRange",
      label: "默认出勤时间",
      width: 150,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "lunchBreakTimeRange",
      label: "午休时间",
      minWidth: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "dinnerTimeRange",
      label: "晚饭时间",
      minWidth: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "morningMeetingTimeRange",
      label: "早会时间",
      width: 120,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "leaveTimeRange",
      label: "请假时间",
      minWidth: 280,
      sortable: "custom",
      sortOrders: ['ascending', 'descending'],
      inputType: 'el-input'
    },
    {
      prop: "effectiveAttendanceTimeRange",
      label: "有效出勤时间",
      minWidth: 280,
      sortable: "custom",
      sortOrders: ['ascending', 'descending']
    }
  ];