import "vue-router";
import { Role } from "@/stores/user";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    mainTab?: string;
    subTab?: string;
    roles?: Role[];
  }
}
