import type { MenuOption } from "naive-ui"
import { defineStore } from "pinia"
import { RouterLink, useRoute, useRouter } from "vue-router"

export const useLayoutController = defineStore("layout", () => {
  const router = useRouter()
  const currentRoute = useRoute()
  const currentScope = computed(
    () =>
      [...currentRoute.matched].reverse().find((o) => o.meta.backToRoute)?.meta
        .backToRoute ?? "MAIN"
  )
  const currentScopeNameGetter = computed(
    () =>
      [...currentRoute.matched].reverse().find((o) => o.meta.getScopeName)?.meta
        .getScopeName
  )
  const scopeName = ref("工地管理")

  watch(
    currentScopeNameGetter,
    async (getter) => {
      if (getter) {
        scopeName.value = await getter(currentRoute.params)
      } else {
        scopeName.value = "工地管理"
      }
    },
    { immediate: true }
  )

  const scopedMenus = computed(() =>
    router.getRoutes().reduce((acc, route) => {
      if (!route.meta.title) return acc
      let scope = "MAIN"
      let mainGroup: string | undefined = undefined
      let subGroup: string | undefined = undefined
      for (const matched of [...router.resolve(route.path).matched].reverse()) {
        mainGroup = mainGroup ?? matched.meta.mainGroup
        subGroup = subGroup ?? matched.meta.subGroup
        if (matched.meta.backToRoute) {
          scope = matched.meta.backToRoute as string
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
    scopeName,
  }
})
