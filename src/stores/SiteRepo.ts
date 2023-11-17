import type { Uploadable } from "./FileRepo"
import { useUserStore } from "./User"

export type Site = {
  id: string
  name: string
  address: string
  principal: string
  period: [string, string]
  official_phone: string
  blueprint_file: Uploadable
  construction_company: string
  supervision_company: string
  organizer: string
}

export type UpdateSiteCommand = Omit<Site, "id">

export interface SiteRepo {
  get(): Promise<Site>
  update(command: UpdateSiteCommand): Promise<void>
}

class FakeSiteRepo implements SiteRepo {
  siteMap = new Map<string, Site>()
  userStore = useUserStore()
  constructor() {
    JSON.parse(localStorage.getItem(this.constructor.name) ?? "[]").forEach(
      (item: Site) => {
        this.siteMap.set(item.id, item)
      }
    )
  }

  private save() {
    localStorage.setItem(
      this.constructor.name,
      JSON.stringify(Array.from(this.siteMap.values()))
    )
  }

  async get(): Promise<Site> {
    let site = this.siteMap.get(this.userStore.getSiteId())
    if (!site) {
      const id = this.userStore.getSiteId()
      site = {
        id,
        name: `${id} 工地`,
        address: "地址",
        principal: "負責人",
        period: ["2021-01-01", "2021-12-31"],
        official_phone: "02-12345678",
        blueprint_file: { value: [] },
        construction_company: "建造公司",
        supervision_company: "監造公司",
        organizer: "主辦單位",
      }
    }
    return site
  }
  async update(command: UpdateSiteCommand): Promise<void> {
    const site = this.get()
    const id = this.userStore.getSiteId()
    const newSite = { ...site, ...command, id }
    this.siteMap.set(this.userStore.getSiteId(), newSite)
    this.save()
  }
}

export function useSiteRepo(): SiteRepo {
  return new FakeSiteRepo()
}
