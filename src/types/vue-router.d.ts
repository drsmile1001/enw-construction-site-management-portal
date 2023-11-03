import "vue-router"
import { Role } from "@/stores/user"

declare module "vue-router" {
  interface RouteMeta {
    title?: string
    mainGroup?: string
    subGroup?: string
    backToRoute?: string
    getScopeName?: (routeParams: RouteParams) => Promise<string>
    roles?: Role[]
  }
}
