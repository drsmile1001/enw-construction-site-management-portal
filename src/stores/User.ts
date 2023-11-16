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

  userManager.events.addUserLoaded((u) => {
    console.info("addUserLoaded", u)
    user.value = u
  })
  userManager.events.addUserUnloaded(() => {
    user.value = null
  })

  const name = computed(() => user.value?.profile.name)
  const nickName = computed(() => user.value?.profile.nickname)
  const loggedIn = computed(() => !!user.value)
  const tibaClaims = computed(() =>
    !user.value ? {} : (user.value.profile.tiba as Record<string, string[]>)
  )

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
    return user.value
  }

  return {
    loggedIn,
    user,
    name,
    nickName,
    getAccessToken,
    signIn,
    signOut,
    loadUser,
    tibaClaims,
  }
})
