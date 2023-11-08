import type { MenuOption } from "naive-ui"
import { defineStore } from "pinia"
import { RouterLink, useRoute, useRouter } from "vue-router"

export const useLayoutController = defineStore("layout", () => {
  const router = useRouter()
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

  const scopedMenus = computed(() =>
    router.getRoutes().reduce((acc, route) => {
      if (!route.meta.title) return acc
      let scope = "MAIN"
      let mainGroup: string | undefined = undefined
      let subGroup: string | undefined = undefined
      for (const matched of [...router.resolve(route.path).matched].reverse()) {
        mainGroup = mainGroup ?? matched.meta.mainGroup
        subGroup = subGroup ?? matched.meta.subGroup
        if (matched.meta.scope) {
          scope = matched.meta.scope.backToRouteName
          break
        }
      }

      let scopeMenus = acc.get(scope)

      if (scopeMenus === undefined) {
        scopeMenus = []
        if (scope !== "MAIN") {
          scopeMenus.push({
            label: () =>
              h(
                RouterLink,
                {
                  to: {
                    name: scope,
                    params: currentRoute.params,
                  },
                },
                { default: () => "📄 回到列表" }
              ),
            key: scope,
          })
        }
      }

      let menuContainer = scopeMenus
      if (mainGroup) {
        let mainGroupMenu = menuContainer.find((o) => o.key === mainGroup)
        if (!mainGroupMenu) {
          mainGroupMenu = {
            label: mainGroup,
            key: mainGroup,
            children: [] as MenuOption[],
          }
          scopeMenus.push(mainGroupMenu)
        }
        menuContainer = mainGroupMenu.children as MenuOption[]
      }

      if (subGroup) {
        let subGroupMenu = menuContainer.find((o) => o.key === subGroup)
        if (!subGroupMenu) {
          subGroupMenu = {
            type: "group",
            label: subGroup,
            key: subGroup,
            children: [] as MenuOption[],
          }
          menuContainer.push(subGroupMenu)
        }
        menuContainer = subGroupMenu.children as MenuOption[]
      }

      menuContainer.push({
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: route.name,
              },
            },
            { default: () => route.meta.title }
          ),
        key: route.name as string,
      })
      acc.set(scope, scopeMenus)
      return acc
    }, new Map<string, MenuOption[]>())
  )
  const currentMenu = computed(
    () => scopedMenus.value.get(currentScope.value) ?? []
  )

  return {
    currentMenu,
    currentScopes,
    scopeNameMap,
    currentScopeName,
  }
})
