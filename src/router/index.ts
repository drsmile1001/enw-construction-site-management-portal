import type { FakeDetailViewProps } from "@/views/FakeDetailView.vue"
import type { FakeTableViewProps } from "@/views/FakeTableView.vue"
import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router"

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
              backToRoute: "SiteDevices",
              getScopeName: async (p) => {
                return `${p.deviceId} 設備`
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
        path: "vendors",
        children: [
          {
            path: "",
            name: "Vendors",
            component: () => import("@/views/Venders.vue"),
            meta: {
              mainGroup: "管理設定",
              title: "廠商清冊",
            },
          },
          {
            path: ":vendorId",
            meta: {
              backToRoute: "Vendors",
              getScopeName: async (p) => {
                return `${p.vendorId} 廠商`
              },
            },
            children: [
              {
                path: "",
                redirect: (to) => ({
                  name: "SiteVendorBasicInfo",
                  params: to.params,
                }),
              },
              {
                path: "basic-info",
                name: "SiteVendorBasicInfo",
                component: () => import("@/views/FakeDetailView.vue"),
                props: () =>
                  <FakeDetailViewProps>{
                    fields: [
                      "廠商統編",
                      "廠商類別",
                      "代表人姓名",
                      "登記地址",
                      "營業地址",
                      "核准設立日期",
                      "最後核准變更日期",
                      "廠商電話",
                      "廠商傳真(選填)",
                      "廠商電子信箱",
                      "業務聯絡人姓名",
                      "聯絡人手機",
                      "聯絡人電子信箱",
                    ],
                  },
                meta: {
                  mainGroup: "公司資料",
                  title: "基本資料",
                },
              },
              {
                path: "remittances",
                name: "SiteVendorRemittances",
                component: () => import("@/views/FakeTableView.vue"),
                props: () => ({
                  actions: [{ label: "編輯", type: "modal" }],
                  itemName: "匯款資料",
                }),
                meta: {
                  mainGroup: "公司資料",
                  title: "匯款資料",
                },
              },
              {
                path: "documents",
                name: "SiteVendorDocuments",
                component: () => import("@/views/FakeTableView.vue"),
                props: () => ({
                  actions: [{ label: "編輯", type: "modal" }],
                  itemName: "文件",
                }),
                meta: {
                  mainGroup: "公司資料",
                  title: "作證文件",
                },
              },
              {
                path: "employees",
                children: [
                  {
                    path: "",
                    name: "VendorEmployees",
                    component: () => import("@/views/FakeTableView.vue"),
                    props: () =>
                      <FakeTableViewProps>{
                        actions: [
                          {
                            label: "詳細頁",
                            type: "link",
                            toRouteName: "VendorEmployeeBasicInfo",
                            toRouteParamName: "employeeId",
                          },
                          {
                            label: "刪除",
                            type: "modal",
                          },
                        ],
                        itemName: "員工",
                        columns: ["工號", "姓名", "職稱", "照片"],
                        topRightActions: [{ label: "新增", type: "modal" }],
                      },
                    meta: {
                      title: "員工清冊",
                    },
                  },
                  {
                    path: ":employeeId",
                    meta: {
                      backToRoute: "VendorEmployees",
                      getScopeName: async (p) => {
                        return `${p.vendorId} 廠商： ${p.employeeId} 員工`
                      },
                    },
                    children: [
                      {
                        path: "",
                        redirect: (to) => ({
                          name: "VendorEmployeeBasicInfo",
                          params: to.params,
                        }),
                      },
                      {
                        path: "basic-info",
                        name: "VendorEmployeeBasicInfo",
                        component: () => import("@/views/FakeDetailView.vue"),
                        meta: {
                          title: "個人資訊",
                        },
                        props: () =>
                          <FakeDetailViewProps>{
                            fields: [
                              "姓名",
                              "身份註記(無、原住民、外籍人士)",
                              "身分證字號",
                              "工號",
                              "出生日期(西元)",
                              "性別(選單)",
                              "戶籍地址",
                              "通訊地址(可同戶籍)",
                              "行動電話",
                              "電子信箱",
                              "其它連絡電話",
                              "最高學歷",
                              "血型",
                              "緊急聯絡人",
                              "緊急連絡人電話",
                              "投保公司",
                              "勞(公)保證號",
                              "投保日期(西元)",
                              "最後異動紀錄",
                            ],
                          },
                      },
                      {
                        path: "experience",
                        name: "VendorEmployeeExperience",
                        props: () =>
                          <FakeTableViewProps>{
                            actions: [
                              { label: "編輯", type: "modal" },
                              { label: "刪除" },
                            ],
                            itemName: "經歷",
                            columns: ["工作經歷", "工作內容", "工作期間"],
                          },
                        component: () => import("@/views/FakeTableView.vue"),
                        meta: {
                          title: "經歷",
                        },
                      },
                      {
                        path: "certificate",
                        name: "VendorEmployeeCertificate",
                        props: () => ({
                          actions: [{ label: "編輯", type: "modal" }],
                          itemName: "證照",
                        }),
                        component: () => import("@/views/FakeTableView.vue"),
                        meta: {
                          title: "證照",
                        },
                      },
                    ],
                  },
                ],
              },
              {
                path: "vehicles",
                children: [
                  {
                    path: "",
                    name: "VendorVehicles",
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
