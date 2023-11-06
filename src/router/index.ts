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
        meta: {
          mainGroup: "管理設定",
          subGroup: "工地設定",
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
            props: () => ({
              actions: [
                { label: "編輯", type: "modal" },
                {
                  label: "點位設定",
                  type: "link",
                  toRouteName: "SiteDevicePoints",
                  toRouteParamName: "deviceId",
                },
              ],
              itemName: "Iot 設備",
            }),
            meta: {
              mainGroup: "管理設定",
              subGroup: "工地設定",
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
                props: () => ({
                  actions: [{ label: "編輯", type: "modal" }],
                  itemName: "點位",
                }),
                meta: {
                  title: "點位設定",
                },
              },
            ],
          },
        ],
      },
      {
        path: "site-abnormal-categories",
        name: "SiteAbnormalCategories",
        component: () => import("@/views/FakeTableView.vue"),
        props: () => ({
          actions: [{ label: "編輯", type: "modal" }],
          itemName: "異常分類",
        }),
        meta: {
          mainGroup: "管理設定",
          subGroup: "工地設定",
          title: "異常分類",
        },
      },
      {
        path: "site-vendors",
        children: [
          {
            path: "",
            name: "SiteVendors",
            component: () => import("@/views/FakeTableView.vue"),
            props: () => ({
              actions: [
                {
                  label: "詳細頁",
                  type: "link",
                  toRouteName: "SiteVendorBasicInfo",
                  toRouteParamName: "vendorId",
                },
              ],
              itemName: "廠商",
            }),
            meta: {
              mainGroup: "管理設定",
              subGroup: "廠商設定",
              title: "廠商清冊",
            },
          },
          {
            path: ":vendorId",
            meta: {
              backToRoute: "SiteVendors",
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
                path: "members",
                children: [
                  {
                    path: "",
                    name: "VendorMembers",
                    component: () => import("@/views/FakeTableView.vue"),
                    props: () => ({
                      actions: [
                        {
                          label: "詳細頁",
                          type: "link",
                          toRouteName: "VendorMemberBasicInfo",
                          toRouteParamName: "memberId",
                        },
                      ],
                      itemName: "員工",
                    }),
                    meta: {
                      title: "員工清冊",
                    },
                  },
                  {
                    path: ":memberId",
                    meta: {
                      backToRoute: "VendorMembers",
                      getScopeName: async (p) => {
                        return `${p.vendorId} 廠商： ${p.memberId} 員工`
                      },
                    },
                    children: [
                      {
                        path: "",
                        redirect: (to) => ({
                          name: "VendorMemberBasicInfo",
                          params: to.params,
                        }),
                      },
                      {
                        path: "basic-info",
                        name: "VendorMemberBasicInfo",
                        component: () => import("@/views/FakeDetailView.vue"),
                        meta: {
                          title: "個人資訊",
                        },
                      },
                      {
                        path: "certificate",
                        name: "VendorMemberCertificate",
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
                    props: () => ({
                      actions: [{ label: "編輯", type: "modal" }],
                      itemName: "車輛",
                    }),
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
        path: "site-vendor-labels",
        name: "SiteVendorLabels",
        component: () => import("@/views/FakeTableView.vue"),
        props: () => ({
          actions: [{ label: "編輯", type: "modal" }],
          itemName: "廠商標籤",
        }),
        meta: {
          mainGroup: "管理設定",
          subGroup: "廠商設定",
          title: "廠商標籤",
        },
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
          {
            path: "abnormal-logs",
            name: "PersonAttendanceAbnormalLogs",
            component: () => import("@/views/FakeTableView.vue"),
            props: () => ({
              actions: [{ label: "詳細", type: "modal" }],
              itemName: "人員進出異常記錄",
            }),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "人員進出",
              title: "異常紀錄",
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
          {
            path: "abnormal-logs",
            name: "VehicleAttendanceAbnormalLogs",
            component: () => import("@/views/FakeTableView.vue"),
            props: () => ({
              actions: [{ label: "詳細", type: "modal" }],
              itemName: "車輛進出異常記錄",
            }),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "車輛進出",
              title: "異常紀錄",
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
        component: () => import("@/views/FakeTableView.vue"),
        props: () => ({
          actions: [{ label: "編輯", type: "modal" }],
          itemName: "資材",
        }),
        meta: {
          mainGroup: "工地資材管理",
          title: "資材庫存清冊",
        },
      },
      {
        path: "purchases",
        name: "Purchases",
        component: () => import("@/views/FakeTableView.vue"),
        props: () => ({
          actions: [{ label: "編輯", type: "modal" }],
          itemName: "進場記錄",
        }),
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
