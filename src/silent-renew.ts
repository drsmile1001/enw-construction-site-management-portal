import { UserManager } from "oidc-client-ts"
import { oidcSettings } from "@/stores/User"

new UserManager(oidcSettings).signinSilentCallback()

export {}
