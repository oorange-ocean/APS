import router from '@/router' // 导入你的路由配置
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import useUserStore from '@/store/modules/user'
import { defineAsyncComponent } from 'vue'
import useUserMenu from './store/modules/menu'
import { startTimer } from './utils/timerControl'
import UseScheduling from '@/store/modules/scheduling'
import { connectToSSE } from '@/utils/sseService'
import { generateRoutes } from './utils/permission'
import { generateRoutesFromMenu } from './router/index'
// import useUserMenu from './store/modules/menu';

// const userMenu = useUserMenu()
function findMenuItem(menu, name) {
  for (let item of menu) {
    if (item.name === name) {
      return item
    }

    if (item.children) {
      const found = findMenuItem(item.children, name)
      if (found) {
        return found
      }
    }
  }
  return null
}

router.beforeEach((to, from, next) => {
  const token = getToken() // 从 Cookie 中获取令牌
  // const menu = [];
  const menuArray = []

  // 如果存在令牌，说明用户已登录，可以继续访问
  if (token) {
    // console.log(router,'to')
    // 路由变化时，自动添加顶部导航栏
    if (to.name && to.path != '/login' && to.path != '/default') {
      // useUserMenu().selectMenu(to);
      const matchedMenu = findMenuItem(useUserMenu().menu, to.name)
      // console.log(matchedMenu, 'matchedMenu');
      if (matchedMenu) {
        useUserMenu().selectMenu(matchedMenu)
      }
    }
    //  console.log(to,'123')
    // next(); // 继续路由导航
    if (useUserStore().roles.length === 0) {
      // 判断当前用户是否已拉取完user_info信息
      useUserStore()
        .getInfo()
        .then((res) => {
          // 根据roles权限生成可访问的路由表
          useUserMenu().menu.push(...res.data.routers)

          //如果获取的路由为空就生成固定的侧边栏
          if (useUserMenu().menu.length == 0) {
            useUserMenu().menu = [
              {
                name: 'default',
                path: '/default',
                hidden: true,
                component: '/default',
                meta: {
                  title: '默认界面'
                }
              },
              {
                name: 'schedule',
                path: '/schedule',
                hidden: false,
                component: '/schedule',
                alwaysShow: 'true',
                meta: {
                  title: '排程'
                }
              },
              {
                name: 'test4',
                path: '/test4',
                hidden: false,
                // component: "four",
                meta: {
                  title: '甘特图'
                },
                children: [
                  {
                    name: 'gtt1',
                    path: '/gtt1',
                    component: '/system/gtt/product',
                    alwaysShow: 'true',
                    meta: {
                      title: '产品甘特图'
                    }
                  }
                ]
              },
              {
                name: 'permission',
                path: '/test1',
                hidden: false,
                meta: {
                  title: '用户及权限管理'
                },
                children: [
                  {
                    name: 'userManage',
                    path: '/userManage',
                    component: '/system/sysUser/list',
                    meta: {
                      title: '用户管理'
                    }
                  },
                  {
                    name: 'rolesManage',
                    path: '/rolesManage',
                    component: '/system/sysRole/list',
                    meta: {
                      title: '角色管理'
                    }
                  },
                  {
                    name: 'deptManage',
                    path: '/deptManage',
                    component: '/permission/deptManage',
                    meta: {
                      title: '部门管理'
                    }
                  },
                  {
                    name: 'viewRolesManage',
                    path: '/viewRolesManage',
                    component: '/permission/viewRolesManage',
                    meta: {
                      title: '视图列角色管理'
                    }
                  },
                  {
                    name: 'viewInfoManage',
                    path: '/viewInfoManage',
                    component: '/permission/viewInfoManage',
                    meta: {
                      title: '视图列信息管理'
                    }
                  }
                ]
              },
              {
                name: 'testGtt',
                path: '/testGtt',
                hidden: false,
                component: '/test',
                alwaysShow: 'true',
                meta: {
                  title: '测试甘特图'
                }
              },
              {
                name: 'productionPlan',
                path: '/productionPlan',
                hidden: 'false',
                // component: "four",
                meta: {
                  title: '生产计划'
                },
                children: [
                  {
                    name: 'productPlan',
                    path: '/productPlan',
                    component: '/productionPlan/productPlan',
                    alwaysShow: 'true',
                    meta: {
                      title: '成品生产计划'
                    }
                  },
                  {
                    name: 'semiFinishedProducts',
                    path: '/semiFinishedProducts',
                    component: '/productionPlan/semiFinishedProducts',
                    alwaysShow: 'true',
                    meta: {
                      title: '半成品生产计划'
                    }
                  },
                  {
                    name: 'productPlanMaterialShort',
                    path: '/productPlanMaterialShort',
                    component: '/productionPlan/productPlanMaterialShort',
                    alwaysShow: 'true',
                    meta: {
                      title: '成品缺料分析'
                    }
                  },
                  {
                    name: 'sFMaterialShort',
                    path: '/sFMaterialShort',
                    component: '/productionPlan/sFMaterialShort',
                    alwaysShow: 'true',
                    meta: {
                      title: '半成品缺料分析'
                    }
                  }
                ]
              },
              {
                name: 'port',
                path: '/port',
                hidden: false,
                threeChildren: true,
                // component: "four",
                meta: {
                  title: '接口数据'
                },
                children: [
                  {
                    name: 'ERP',
                    path: '/ERP',
                    meta: {
                      title: 'ERP'
                    },
                    children: [
                      {
                        name: 'immediateInventory',
                        path: '/immediateInventory',
                        component: '/port/ERP/immediateInventory',
                        alwaysShow: 'true',
                        meta: {
                          title: '即时库存'
                        }
                      },
                      {
                        name: 'productionMaterial',
                        path: '/productionMaterial',
                        component: '/port/ERP/productionMaterial',
                        alwaysShow: 'true',
                        meta: {
                          title: '用料清单列表'
                        }
                      },
                      {
                        name: 'productionOrder',
                        path: '/productionOrder',
                        component: '/port/ERP/productionOrder',
                        alwaysShow: 'true',
                        meta: {
                          title: '委外/生产订单列表'
                        }
                      },
                      {
                        name: 'purchaseOrder',
                        path: '/purchaseOrder',
                        component: '/port/ERP/purchaseOrder',
                        alwaysShow: 'true',
                        meta: {
                          title: '采购列表'
                        }
                      },
                      {
                        name: 'receiveNotice',
                        path: '/receiveNotice',
                        component: '/port/ERP/receiveNotice',
                        alwaysShow: 'true',
                        meta: {
                          title: '收料通知单列表'
                        }
                      },
                      {
                        name: 'inventoryLock',
                        path: '/inventoryLock',
                        component: '/port/ERP/inventoryLock',
                        alwaysShow: 'true',
                        meta: {
                          title: '库存锁库列表'
                        }
                      },
                      {
                        name: 'materialBom',
                        path: '/materialBom',
                        component: '/port/ERP/materialBom',
                        alwaysShow: 'true',
                        meta: {
                          title: '物料清单列表'
                        }
                      },
                      {
                        name: 'outboundApplication',
                        path: '/outboundApplication',
                        component: '/port/ERP/outboundApplication',
                        alwaysShow: 'true',
                        meta: {
                          title: '出库申请单'
                        }
                      }
                    ]
                  },
                  {
                    name: 'MES',
                    path: '/MES',
                    meta: {
                      title: 'MES'
                    },
                    children: [
                      {
                        name: 'mesUnfinished',
                        path: '/mesUnfinished',
                        component: '/port/MES/mesUnfinished',
                        alwaysShow: 'true',
                        meta: {
                          title: 'MES 未完工'
                        }
                      },
                      {
                        name: 'dailyDataUpload',
                        path: '/dailyDataUpload',
                        component: '/port/MES/dailyDataUpload',
                        alwaysShow: 'true',
                        meta: {
                          title: '日别数据'
                        }
                      }
                    ]
                  },
                  {
                    name: 'FIM',
                    path: '/FIM',
                    meta: {
                      title:'FIM'
                    },
                    children: [
                      {
                        name: 'fimRequest',
                        path: '/fimRequest',
                        component: '/port/FIM/fimRequest',
                        alwaysShow: 'true',
                        meta: {
                          title: 'FIM需求'
                        }
                      },
                      {
                        name: 'fimPriority',
                        path: '/fimPriority',
                        component: '/port/FIM/fimPriority',
                        alwaysShow: 'true',
                        meta: {
                          title: 'FIM优先级'
                        }
                      },
                    ]
                  },
                ]
              },
              {
                name: 'metaData',
                path: '/metaData',
                hidden: false,
                threeChildren: true,
                meta: {
                  title: '主数据管理'
                },
                children: [
                  {
                    name: 'processManage',
                    path: '/processManage',
                    meta: {
                      title: '工序与产能管理'
                    },
                    children: [
                      {
                        name: 'processName',
                        path: '/processName',
                        hidden: false,
                        component: '/metaData/processManage/processName',
                        meta: {
                          title: '工序命名池'
                        }
                      },
                      {
                        name: 'processCapacity',
                        path: '/processCapacity',
                        hidden: false,
                        component: '/metaData/processManage/processCapacity',
                        meta: {
                          title: '工序与产能'
                        }
                      },
                      {
                        name: 'createBasePlan',
                        path: '/createBasePlan',
                        hidden: true,
                        component: '/metaData/processManage/createBasePlan',
                        meta: {
                          title: '创建基础方案'
                        }
                      },
                      {
                        name: 'viewBasePlan',
                        path: '/viewBasePlan',
                        hidden: true,
                        component: '/metaData/processManage/viewBasePlan',
                        meta: {
                          title: '查看基础方案'
                        }
                      },
                      {
                        name: 'moveData',
                        path: '/moveData',
                        hidden: true,
                        component: '/metaData/processManage/moveData',
                        meta: {
                          title: '移动工序'
                        }
                      },
                      {
                        name: 'basePlan',
                        path: '/basePlan',
                        hidden: false,
                        component: '/metaData/processManage/basePlan',
                        meta: {
                          title: '基础工艺方案列表'
                        }
                      },
                      {
                        name: 'lastPlan',
                        path: '/lastPlan',
                        hidden: false,
                        component: '/metaData/processManage/lastPlan',
                        meta: {
                          title: '最终工艺方案'
                        }
                      }
                    ]
                  },
                  {
                    name: 'materialBasicData',
                    path: '/materialBasicData',
                    meta: {
                      title: '物料基础数据'
                    },
                    children: [
                      {
                        name: 'semiFinishedBasicData',
                        path: '/semiFinishedBasicData',
                        hidden: false,
                        component: '/metaData/materialBasicData/semiFinishedBasicData',
                        meta: {
                          title: '半成品基础数据'
                        }
                      },
                      {
                        name: 'finishedProductBasicData',
                        path: '/finishedProductBasicData',
                        hidden: false,
                        component: '/metaData/materialBasicData/finishedProductBasicData',
                        meta: {
                          title: '成品基础数据'
                        }
                      },
                      {
                        name: 'rawMaterialBasicData',
                        path: '/rawMaterialBasicData',
                        hidden: false,
                        component: '/metaData/materialBasicData/rawMaterialBasicData',
                        meta: {
                          title: '原材料基础数据'
                        }
                      },
                    ]
                  },
                  {
                    name: 'attendanceManagement',
                    path: '/attendanceManagement',
                    hidden: false,
                    component: '/metaData/workDate/attendanceManagement',
                    meta: {
                      title: '出勤管理'
                    }
                  },
                  {
                    name: 'machineManagement',
                    path: '/machineManagement',
                    component: '/metaData/machineManagement',
                    meta: {
                      title: '机器管理'
                    }
                  }
                ]
              }
            ]
          }

          // const dynamicRoutes = generateRoutesFromMenu(useUserMenu().menu)
          // console.log(dynamicRoutes,'dynamicRoutes')

          generateRoutes()
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        })
        .catch((err) => {
          console.log('permission代码报错', err)
        })
    } else {
      if (to.path == '/login') {
        next('/default')
      } else if (to.path == '/schedule' && useUserStore().isSchedule == false) {
        useUserStore().isSchedule = true
        console.log('进入排程界面了，向后端发送请求')

        //获取锁
        UseScheduling()
          .getPageLock()
          .then((res) => {
            //获取锁成功的话开启定时器还有通过sse跟后端建立链接
            if (res.code == 200) {
              //跟后端建立链接
              connectToSSE()

              //开启定时器
              startTimer()
            } else {
              ElMessageBox.alert(res.message, '提示', {
                confirmButtonText: '好的'
              })
            }
          })
          .catch((error) => {})
        //后端返回成功加锁的信息之后，再开始定时向后端发送请求
        next()
      } else {
        next()
      }
    }
  } else {
    // 如果没有令牌，并且当前路由不是登录页，就跳转到登录页面
    if (to.path !== '/login') {
      next('/login') // 可以根据你的登录路由路径进行修改
    } else {
      next() // 如果当前路由已经是登录页，则继续路由导航
    }
  }
})
