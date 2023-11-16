import { UserManager } from "oidc-client-ts"
import { oidcSettings } from "@/stores/User"

const manager = new UserManager(oidcSettings)

async function load() {
  try {
    const user = await manager.signinRedirectCallback()
    console.debug("signinRedirectCallback", user)
    history.replaceState({}, "", (user.state as string | null) ?? "../")
    window.location.href = (user.state as string | null) ?? "../"
  } catch (error) {
    document.body.innerText = "登入失敗，請關掉瀏覽器後重新登入。"
  }
}

load()

export {}
