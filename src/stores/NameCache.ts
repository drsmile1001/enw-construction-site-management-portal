import { defineStore } from "pinia"

export const useNameCache = defineStore("name-cache", () => {
  //XXX: 目前假設了使用者登出後，會立刻跳轉到登入頁，導致 cache 自動清空。如果不離開本網站，需要補上清空 cache。
  const map = ref(new Map<string, string>())
  const get = (key: string) => map.value.get(key)
  const set = (key: string, value: string) => map.value.set(key, value)
  const caching = new Set<string>()
  function ensureCached(key: string, valueGetter: () => Promise<string>) {
    if (map.value.has(key)) return
    if (caching.has(key)) return
    caching.add(key)
    valueGetter().then((value) => {
      map.value.set(key, value)
      caching.delete(key)
    })
  }
  return {
    get,
    set,
    ensureCached,
    map,
  }
})
