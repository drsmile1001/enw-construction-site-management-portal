import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    title?: string
    mainGroup?: string
    subGroup?: string
    scope?: {
      id: string
      backToRouteName: string
      prefix: string
      name: (
        routeParams: RouteParams
      ) => string | ComputedRef<string | undefined>
      breadcrumbToRouteName: string
    }
    guard?: (routeParams: RouteParams) => Promise<Accessable>
  }
}

export type Accessable = "NOT_FOUND" | "FORBIDDEN" | "OK"
