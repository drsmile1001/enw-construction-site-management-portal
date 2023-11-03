import { ref } from "vue";
import { computed } from "vue";

export class AppCache<T> {
  private cache = ref<Map<string, T>>(new Map());
  private cacheExpireTime: Map<string, number> = new Map();
  private lifeTime: number;
  constructor(lifeTime: number) {
    this.lifeTime = lifeTime;
  }

  get(key: string) {
    const item = this.cache.value.get(key);
    if (!item) return null;
    const expireTime = this.cacheExpireTime.get(key);
    if (!expireTime) return null;
    if (expireTime < Date.now()) return null;
    return item;
  }

  set(key: string, value: T) {
    this.cache.value.set(key, value);
    this.cacheExpireTime.set(key, Date.now() + this.lifeTime);
  }

  delete(key: string) {
    this.cacheExpireTime.set(key, Date.now());
  }

  buildRefItem(key: string) {
    return computed(() => this.get(key));
  }

  entires() {
    return this.cache.value.entries();
  }
}
