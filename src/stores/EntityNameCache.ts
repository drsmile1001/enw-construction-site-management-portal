import { defineStore } from "pinia"

export const useEntityNameCache = defineStore("entityNameCache", () => {
  const map = ref(new Map<string, string>())
  const get = (key: string) => map.value.get(key)
  const set = (key: string, value: string) => map.value.set(key, value)
  return {
    get,
    set,
  }
})
