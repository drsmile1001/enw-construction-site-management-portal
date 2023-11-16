import { ensureContractorNameCached } from "@/stores/ContractorRepo"
import { ensureDeviceNameCached } from "@/stores/DeviceRepo"
import type { FakeDetailViewProps } from "@/views/FakeDetailView.vue"
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
        path: "devices",
        children: [
          {
            path: "",
            name: "Devices",
            component: () => import("@/views/Devices.vue"),
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
                backToRouteName: "Devices",
                prefix: "設備",
                entityNameKey: (params) =>
                  ensureDeviceNameCached(params.deviceId as string),
                breadcrumbToRouteName: "DevicePoints",
              },
            },
            children: [
              {
                path: "",
                redirect: (to) => ({
                  name: "DevicePoints",
                  params: to.params,
                }),
              },
              {
                path: "points",
                name: "DevicePoints",
                component: () => import("@/views/DevicePoints.vue"),
                props: true,
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
                entityNameKey: (params) =>
                  ensureContractorNameCached(params.contractorId as string),
                breadcrumbToRouteName: "SiteContractorBasicInfo",
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
                path: "machineries",
                children: [
                  {
                    path: "",
                    name: "Machineries",
                    component: () => import("@/views/Machineries.vue"),
                    props: true,
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
        path: "worker-attendance",
        children: [
          {
            path: "",
            redirect: { name: "WorkerAttendanceDashboard" },
          },
          {
            path: "dashboard",
            name: "WorkerAttendanceDashboard",
            component: () => import("@/views/FakeDetailView.vue"),
            meta: {
              mainGroup: "工地進出管理",
              subGroup: "人員進出",
              title: "今日進出狀況",
            },
          },
          {
            path: "logs",
            name: "WorkerAttendanceLogs",
            component: () => import("@/views/WorkerAttendance.vue"),
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
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
})

export default router
