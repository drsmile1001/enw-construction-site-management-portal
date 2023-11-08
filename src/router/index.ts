import type { FakeDetailViewProps } from "@/views/FakeDetailView.vue"
import type { FakeTableViewProps } from "@/views/FakeTableView.vue"
import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import { getContractor } from "@/stores/ContractorRepo"

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
        path: "site-basic-info",
        name: "SiteBasicInfo",
        component: () => import("@/views/FakeDetailView.vue"),
        props: () =>
          <FakeDetailViewProps>{
            fields: [
              "工地名稱",
              "工地地址",
              "工地負責人",
              "施工期間",
              "工務室電話",
              "監造單位",
              "施工單位",
              "主辦機關",
              "工地平面圖",
            ],
          },
        meta: {
          mainGroup: "管理設定",
          title: "基本資料",
        },
      },
      {
        path: "site-devices",
        children: [
          {
            path: "",
            name: "SiteDevices",
            component: () => import("@/views/FakeTableView.vue"),
            props: () =>
              <FakeTableViewProps>{
                actions: [
                  { label: "編輯", type: "editor", editorFields: ["設備名稱"] },
                  {
                    label: "點位設定",
                    type: "link",
                    toRouteName: "SiteDevicePoints",
                    toRouteParamName: "deviceId",
                  },
                  { label: "刪除", type: "confirm-delete" },
                ],
                itemName: "Iot 設備",
                topRightActions: [{ label: "新增", type: "modal" }],
              },
            meta: {
              mainGroup: "管理設定",
              title: "Iot 設備清冊",
            },
          },
          {
            path: ":deviceId",
            meta: {
              scope: {
                id: "deviceId",
                backToRouteName: "SiteDevices",
                prefix: "設備",
                nameGetter: async (params) => params.deviceId as string,
              },
            },
            children: [
              {
                path: "",
                redirect: (to) => ({
                  name: "SiteDevicePoints",
                  params: to.params,
                }),
              },
              {
                path: "points",
                name: "SiteDevicePoints",
                component: () => import("@/views/FakeTableView.vue"),
                props: () =>
                  <FakeTableViewProps>{
                    actions: [
                      {
                        label: "編輯",
                        type: "editor",
                        editorFields: ["觸發條件", "模組名稱"],
                      },
                      { label: "刪除" },
                    ],
                    columns: ["ID", "觸發條件"],
                    itemName: "點位",
                    topRightActions: [
                      {
                        label: "新增",
                        type: "editor",
                        editorFields: ["ID", "觸發條件"],
                      },
                    ],
                  },
                meta: {
                  title: "點位設定",
                },
              },
            ],
          },
        ],
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
                nameGetter: async (params) => {
                  const contractor = await getContractor(
                    params.contractorId as string
                  )
                  return contractor.name
                },
              },
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
                children: [
                  {
                    path: "",
                    name: "Workers",
                    component: () => import("@/views/Workers.vue"),
                    props: true,
                    meta: {
                      title: "員工清冊",
                    },
                  },
                ],
              },
              {
                path: "vehicles",
                children: [
                  {
                    path: "",
                    name: "ContractorVehicles",
                    component: () => import("@/views/FakeTableView.vue"),
                    props: () =>
                      <FakeTableViewProps>{
                        actions: [
                          {
                            label: "編輯",
                            type: "editor",
                            editorFields: [
                              "機具類型",
                              "機具名稱",
                              "車牌號碼",
                              "出廠年",
                              "操作人員",
                              "操作人員聯絡電話",
                              "機具供應廠商",
                              "機具供應廠商聯絡人",
                              "機具供應廠商聯絡電話",
                              "機具規格",
                            ],
                          },
                          { label: "刪除", type: "confirm-delete" },
                        ],
                        itemName: "車輛",
                        columns: [
                          "機具類型",
                          "機具名稱",
                          "車牌號碼",
                          "操作人員姓名",
                          "操作人員聯絡電話",
                        ],
                        topRightActions: [
                          {
                            label: "新增",
                            type: "editor",
                            editorFields: [
                              "機具類型",
                              "機具名稱",
                              "車牌號碼",
                              "出廠年",
                              "操作人員",
                              "操作人員聯絡電話",
                              "機具供應廠商",
                              "機具供應廠商聯絡人",
                              "機具供應廠商聯絡電話",
                              "機具規格",
                            ],
                          },
                        ],
                      },
                    meta: {
                      title: "車輛清冊",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "person-attendance",
        children: [
          {
            path: "",
            redirect: { name: "PersonAttendanceDashboard" },
          },
          {
            path: "dashboard",
            name: "PersonAttendanceDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "人員進出",
              title: "今日進出狀況",
            },
          },
          {
            path: "logs",
            name: "PersonAttendanceLogs",
            component: () => import("@/views/FakeTableView.vue"),
            props: () => ({
              actions: [{ label: "詳細", type: "modal" }],
              itemName: "人員進出記錄",
            }),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "人員進出",
              title: "歷史辨識紀錄",
            },
          },
        ],
      },
      {
        path: "vehicle-attendance",
        children: [
          {
            path: "",
            redirect: { name: "VehicleAttendanceDashboard" },
          },
          {
            path: "dashboard",
            name: "VehicleAttendanceDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "車輛進出",
              title: "今日進出狀況",
            },
          },
          {
            path: "logs",
            name: "VehicleAttendanceLogs",
            component: () => import("@/views/FakeTableView.vue"),
            props: () => ({
              actions: [{ label: "詳細", type: "modal" }],
              itemName: "車輛進出記錄",
            }),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "車輛進出",
              title: "歷史辨識紀錄",
            },
          },
        ],
      },
      {
        path: "environmental-monitoring",
        children: [
          {
            path: "",
            redirect: { name: "EnvironmentalMonitoringDashboard" },
          },
          {
            path: "dashboard",
            name: "EnvironmentalMonitoringDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地安全",
              subGroup: "環境檢測",
              title: "環境檢測儀表板",
            },
          },
        ],
      },
      {
        path: "device-safety",
        children: [
          {
            path: "",
            redirect: { name: "EnvironmentalMonitoringDashboard" },
          },
          {
            path: "dashboard",
            name: "DeviceSafetyDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地安全",
              subGroup: "工地設備防護",
              title: "工地設備防護儀表板",
            },
          },
        ],
      },
      {
        path: "danger-zone-contrl",
        children: [
          {
            path: "",
            redirect: { name: "DangerZoneControlDashboard" },
          },
          {
            path: "dashboard",
            name: "DangerZoneControlDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地安全",
              subGroup: "工區人員安全",
              title: "危險區域管制",
            },
          },
        ],
      },
      {
        path: "night-security",
        children: [
          {
            path: "",
            redirect: { name: "NightSecurityDashboard" },
          },
          {
            path: "dashboard",
            name: "NightSecurityDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地安全",
              subGroup: "工區人員安全",
              title: "夜間保全",
            },
          },
        ],
      },
      {
        path: "other-personnel-safety",
        children: [
          {
            path: "",
            redirect: { name: "NightSecurityDashboard" },
          },
          {
            path: "dashboard",
            name: "OtherPersonnelSafetyDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地安全",
              subGroup: "工區人員安全",
              title: "人員安全...",
            },
          },
        ],
      },
      {
        path: "inventories",
        name: "Inventories",
        component: () => import("@/views/Inventories.vue"),
        meta: {
          mainGroup: "工地資材管理",
          title: "資材庫存清冊",
        },
      },
      {
        path: "purchases",
        name: "Purchases",
        component: () => import("@/views/Purchases.vue"),
        meta: {
          mainGroup: "工地資材管理",
          title: "進場記錄",
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
})

export default router
