import { computed, ref } from "vue"
import { defineStore } from "pinia"
import {
  UserManager,
  User,
  Log,
  type UserManagerSettings,
  WebStorageStateStore,
} from "oidc-client-ts"
import urlJoin from "url-join"
import { env } from "../environment"

Log.setLevel(Log.INFO)
Log.setLogger(console)

export const oidcSettings: UserManagerSettings = {
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  authority: env.AUTHORITY,
  client_id: env.CLIENT_ID,
  redirect_uri: urlJoin(env.HOST, "callback.html"),
  silent_redirect_uri: urlJoin(env.HOST, "silent-renew.html"),
  scope: "openid offline_access",
  post_logout_redirect_uri: env.HOST,
}

export const useUserStore = defineStore("user", () => {
  const userManager = new UserManager(oidcSettings)
  const user = ref<User | null>(null)

  //XXX: 目前設計成一個 site 只有一個使用者，所以 siteid 是使用者的屬性。同時網站設計成必須登入才能使用，所以這裡 siteid 一定會有值。
  let siteId: string | undefined
  userManager.events.addUserLoaded((u) => {
    user.value = u
  })
  userManager.events.addUserUnloaded(() => {
    user.value = null
    siteId = undefined
  })
  function getSiteId() {
    if (!siteId) throw new Error("siteId is not set")
    return siteId
  }

  const loggedIn = computed(() => !!user.value)

  function signIn(path?: string) {
    return userManager.signinRedirect({
      state: path,
    })
  }

  async function getAccessToken() {
    const u = await userManager.getUser()
    return u?.access_token
  }

  function signOut() {
    return userManager.signoutRedirect()
  }

  async function loadUser() {
    if (user.value) return user.value
    user.value = await userManager.getUser()
    siteId = user.value?.profile.SITE_ID as string | undefined
    return user.value
  }

  return {
    loggedIn,
    user,
    getAccessToken,
    signIn,
    signOut,
    loadUser,
    getSiteId,
  }
})
