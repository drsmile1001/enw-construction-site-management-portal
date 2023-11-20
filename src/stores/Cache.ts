import { DoubleCheckLock } from "@/utilities/Lock"
import { defineStore } from "pinia"

export class Cache<TId, TValue = string> {
  private lock = new DoubleCheckLock()
  private getCache: () => Map<string, TValue>
  constructor(
    private keyBuilder: (id: TId) => string,
    private valueGetter: (id: TId) => Promise<TValue | undefined>,
    storeId: string = "cache"
  ) {
    const useStore = defineStore(storeId, () => {
      const cache = ref(new Map<string, TValue>())
      return {
        map: cache,
      }
    })
    this.getCache = () => useStore().map
  }

  setCache(id: TId, value: TValue): void {
    const key = this.keyBuilder(id)
    this.getCache().set(key, value)
  }

  //使用此寫法避免解構時，this會變成undefined
  getValue = async (id: TId): Promise<TValue | undefined> => {
    const key = this.keyBuilder(id)
    await this.lock.checkAndRunAsync(
      () => !this.getCache().has(key),
      () =>
        this.valueGetter(id)
          .then((value) => {
            if (value === undefined) {
              this.getCache().delete(key)
              return
            }
            this.getCache().set(key, value)
          })
          .catch(() => this.getCache().delete(key))
    )
    return this.getCache().get(key)!
  }

  getReactiveValue = (id: TId): globalThis.ComputedRef<TValue | undefined> => {
    const value = computed(() => this.getCache().get(this.keyBuilder(id)))
    this.getValue(id)
    return value
  }
}
