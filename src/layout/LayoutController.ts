import type { MenuOption } from "naive-ui"
import { defineStore } from "pinia"
import { RouterLink, useRoute } from "vue-router"
import { routeRecords } from "@/router"
import type { RouteRecordRaw } from "vue-router"

export const useLayoutController = defineStore("layout", () => {
  const currentRoute = useRoute()
  const currentScope = computed(
    () =>
      [...currentRoute.matched].reverse().find((o) => !!o.meta.scope)?.meta
        .scope?.backToRouteName ?? "MAIN"
  )
  const scopeNameMap = ref(new Map<string, string>([["MAIN", "工地管理"]]))
  //TODO: 處理異動名稱後的問題

  const currentScopes = computed(() =>
    [...currentRoute.matched]
      .filter((o) => !!o.meta.scope)
      .map((o) => o.meta.scope)
  )

  const currentScopeName = computed(() => {
    const name = ["工地管理"]
    let key = "MAIN"
    for (const scope of currentScopes.value) {
      if (!scope) break
      key = `${key}:${scope.backToRouteName}:${scope.id}:${
        currentRoute.params[scope.id]
      }`
      if (scopeNameMap.value.has(key)) name.push(scopeNameMap.value.get(key)!)
      else {
        scope.nameGetter(currentRoute.params).then((name) => {
          scopeNameMap.value.set(key, `${scope.prefix} ${name}`)
        })
        break
      }
    }
    return name
  })

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
    currentScopes,
    scopeNameMap,
    currentScopeName,
  }
})
