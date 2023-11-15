import "vue-router"
import { Role } from "@/stores/user"

declare module "vue-router" {
  interface RouteMeta {
    title?: string
    mainGroup?: string
    subGroup?: string
    scope?: {
      id: string
      backToRouteName: string
      prefix: string
      entityNameKey: (routeParams: RouteParams) => string
      breadcrumbToRouteName: string
    }
    roles?: Role[]
  }
}
