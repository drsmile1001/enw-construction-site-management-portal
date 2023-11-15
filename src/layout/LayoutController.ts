import type { MenuOption } from "naive-ui"
import { defineStore } from "pinia"
import { RouterLink, useRoute } from "vue-router"
import { routeRecords } from "@/router"
import type { RouteRecordRaw } from "vue-router"

export type BreadcrumbItem = {
  label: string
  toRouteName: string
  entityNameKey?: string
}

export const useLayoutController = defineStore("layout", () => {
  const currentRoute = useRoute()
  const currentScope = computed(
    () =>
      [...currentRoute.matched].reverse().find((o) => !!o.meta.scope)?.meta
        .scope?.backToRouteName ?? "MAIN"
  )
  const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
    {
      label: "工地管理",
      toRouteName: "SiteBasicInfo",
    },
    ...[...currentRoute.matched]
      .filter((o) => o.meta.scope)
      .map(
        (o) =>
          <BreadcrumbItem>{
            label: o.meta.scope!.prefix,
            toRouteName: o.meta.scope!.breadcrumbToRouteName,
            entityNameKey: o.meta.scope!.entityNameKey(currentRoute.params),
          }
      ),
  ])

  const backToListLabel = (scope: string) => () =>
    h(
      RouterLink,
      {
        to: {
          name: scope,
          params: currentRoute.params,
        },
      },
      { default: () => "📄 回到列表" }
    )

  const menus: Array<{ key: string; menu: MenuOption[] }> = [
    {
      key: "MAIN",
      menu: [],
    },
  ]

  function buildMenu(records: RouteRecordRaw[], scope: string) {
    let menu = menus.find((o) => o.key === scope)?.menu
    if (!menu) {
      menu = [
        {
          label: backToListLabel(scope),
          key: scope,
        },
      ]
      menus.push({
        key: scope,
        menu,
      })
    }

    for (const record of records) {
      if (record.meta?.scope && record.children) {
        buildMenu(record.children, record.meta.scope.backToRouteName)
        continue
      }
      if (record.children) {
        buildMenu(record.children, scope)
        continue
      }

      if (!record.meta?.title) continue

      const { title, mainGroup, subGroup } = record.meta
      let linkContainer = menu

      if (mainGroup) {
        let mainGroupLinkContainer = linkContainer.find(
          (o) => o.key === mainGroup
        )
        if (!mainGroupLinkContainer) {
          mainGroupLinkContainer = {
            label: mainGroup,
            key: mainGroup,
            children: [] as MenuOption[],
          }
          linkContainer.push(mainGroupLinkContainer)
        }
        linkContainer = mainGroupLinkContainer.children as MenuOption[]
      }

      if (subGroup) {
        let subGroupMenu = linkContainer.find((o) => o.key === subGroup)
        if (!subGroupMenu) {
          subGroupMenu = {
            type: "group",
            label: subGroup,
            key: subGroup,
            children: [] as MenuOption[],
          }
          linkContainer.push(subGroupMenu)
        }
        linkContainer = subGroupMenu.children as MenuOption[]
      }

      linkContainer.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: record.name as string,
              },
            },
            { default: () => title }
          ),
        key: record.name as string,
      })
    }
  }

  buildMenu(routeRecords, "MAIN")

  const currentMenu = computed(
    () => menus.find(({ key }) => key === currentScope.value)?.menu ?? []
  )

  return {
    currentMenu,
    breadcrumbItems,
  }
})
