import {
  checkContractorAccessable,
  getReactiveName as contractorName,
} from "@/stores/ContractorRepo"
import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import { safetyAlarmSettings } from "@/stores/SafetyEventRepo"

export const routeRecords: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/AppLayout.vue"),
    children: [
      {
        path: "",
        redirect: { name: "SiteBasicInfo" },
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: "儀表板",
        },
      },
      {
        path: "site-basic-info",
        name: "SiteBasicInfo",
        component: () => import("@/views/SiteBasicInfo.vue"),
        meta: {
          mainGroup: "管理設定",
          title: "基本資料",
        },
      },
      {
        path: "contractors",
        children: [
          {
            path: "",
            name: "Contractors",
            component: () => import("@/views/Contractors.vue"),
            meta: {
              mainGroup: "管理設定",
              subGroup: "廠商管理",
              title: "廠商清冊",
            },
          },
          {
            path: ":contractorId",
            meta: {
              scope: {
                id: "contractorId",
                backToRouteName: "Contractors",
                prefix: "廠商",
                name: (params) => contractorName(params.contractorId as string),
                breadcrumbToRouteName: "SiteContractorBasicInfo",
              },
              guard: (params) =>
                checkContractorAccessable(params.contractorId as string),
            },
            children: [
              {
                path: "",
                redirect: (to) => ({
                  name: "SiteContractorBasicInfo",
                  params: to.params,
                }),
              },
              {
                path: "basic-info",
                name: "SiteContractorBasicInfo",
                component: () => import("@/views/ContractorBasicInfo.vue"),
                props: true,
                meta: {
                  title: "基本資料",
                },
              },
              {
                path: "workers",
                name: "Workers",
                component: () => import("@/views/Workers.vue"),
                props: true,
                meta: {
                  mainGroup: "員工管理",
                  title: "員工清冊",
                },
              },
              {
                path: "workers-importer",
                name: "WorkersImporter",
                component: () => import("@/views/WorkersImporter.vue"),
                props: true,
                meta: {
                  mainGroup: "員工管理",
                  title: "員工清冊匯入",
                },
              },
              {
                path: "machineries",
                name: "Machineries",
                component: () => import("@/views/Machineries.vue"),
                props: true,
                meta: {
                  mainGroup: "車輛管理",
                  title: "車輛清冊",
                },
              },
              {
                path: "machineries-importer",
                name: "MachineriesImporter",
                component: () => import("@/views/MachineriesImporter.vue"),
                props: true,
                meta: {
                  mainGroup: "車輛管理",
                  title: "車輛清冊匯入",
                },
              },
            ],
          },
        ],
      },
      {
        path: "contractors-importer",
        name: "ContractorsImporter",
        component: () => import("@/views/ContractorsImporter.vue"),
        meta: {
          mainGroup: "管理設定",
          subGroup: "廠商管理",
          title: "廠商清冊匯入",
        },
      },
      {
        path: "doorman",
        children: [
          {
            path: "",
            redirect: { name: "DoormanWorkerAttendances" },
          },
          {
            path: "worker-attendances",
            name: "DoormanWorkerAttendances",
            component: () => import("@/views/Attendances.vue"),
            props: () => ({
              type: "worker",
            }),
            meta: {
              mainGroup: "工地進出管理",
              title: "人員辨識紀錄",
            },
          },
          {
            path: "machinery-attendances",
            name: "DoormanMachineryAttendances",
            component: () => import("@/views/Attendances.vue"),
            props: () => ({
              type: "machinery",
            }),
            meta: {
              mainGroup: "工地進出管理",
              title: "車輛辨識紀錄",
            },
          },
        ],
      },
      ...safetyAlarmSettings.map(({ id, name }) => ({
        path: `safety-${id}`,
        name: `Safety${id}Events`,
        component: () => import("@/views/SafetyEvents.vue"),
        props: () => ({ category: id }),
        meta: {
          mainGroup: "工地安全",
          title: `${name}警示`,
        },
      })),
      {
        path: "inventories",
        name: "Inventories",
        component: () => import("@/views/Inventories.vue"),
        meta: {
          mainGroup: "工地資材管理",
          subGroup: "資材庫存管理",
          title: "資材庫存清冊",
        },
      },
      {
        path: "inventories-importer",
        name: "InventoriesImporter",
        component: () => import("@/views/InventoriesImporter.vue"),
        meta: {
          mainGroup: "工地資材管理",
          subGroup: "資材庫存管理",
          title: "資材庫存清冊匯入",
        },
      },
      {
        path: "purchases",
        name: "Purchases",
        component: () => import("@/views/Purchases.vue"),
        meta: {
          mainGroup: "工地資材管理",
          subGroup: "物料進場管理",
          title: "進場記錄",
        },
      },
      {
        path: "purchases-importer",
        name: "PurchasesImporter",
        component: () => import("@/views/PurchasesImporter.vue"),
        meta: {
          mainGroup: "工地資材管理",
          subGroup: "物料進場管理",
          title: "進場記錄匯入",
        },
      },
      ...(!import.meta.env.PROD
        ? [
            {
              path: "lab",
              name: "Lab",
              component: () => import("@/views/Lab.vue"),
              meta: {
                title: "實驗室",
              },
            },
          ]
        : []),
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        props: (r) => ({ path: r.query.path, status: "404" }),
        component: () => import("@/views/ResultView.vue"),
      },
      {
        path: "/forbidden",
        name: "Forbidden",
        props: (r) => ({ path: r.query.path, status: "403" }),
        component: () => import("@/views/ResultView.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeRecords,
})

router.beforeEach(async (to, _from, next) => {
  for (const matched of to.matched) {
    if (!matched.meta.guard) continue
    const result = await matched.meta.guard(to.params)
    if (result === "NOT_FOUND") {
      next({ name: "NotFound", query: { path: to.path } })
      return
    }
    if (result === "FORBIDDEN") {
      next(false)
      return
    }
  }
  next()
})

export default router
