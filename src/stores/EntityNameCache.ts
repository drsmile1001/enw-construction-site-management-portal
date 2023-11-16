import { defineStore } from "pinia"

export const useEntityNameCache = defineStore("entityNameCache", () => {
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
