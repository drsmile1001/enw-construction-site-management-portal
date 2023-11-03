import { type RouteRecordRaw, createRouter, createWebHistory } from "vue-router"

export const routeRecords: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layout/AppLayout.vue"),
    children: [
      {
        path: "",
        redirect: "site-basic-info",
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
        path: "site-vendors/:vendorId",
        children: [
          {
            path: "",
            redirect: "basic-info",
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
            path: "members/:memberId",
            children: [
              {
                path: "",
                redirect: "basic-info",
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
            meta: {
              backToRoute: "VendorMembers",
              getScopeName: async (p) => {
                return `${p.vendorId} 廠商： ${p.memberId} 員工`
              },
            },
          },
        ],
        meta: {
          backToRoute: "SiteVendors",
          getScopeName: async (p) => {
            return `${p.vendorId} 廠商`
          },
        },
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
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
})

export default router
