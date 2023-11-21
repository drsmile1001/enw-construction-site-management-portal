import { kyWithBearerToken } from "@/utilities/ky"
import type { Uploadable } from "./FileRepo"
import { useUserStore } from "./User"
import urlJoin from "url-join"
import { env } from "@/environment"

export type Site = {
  name: string
  address: string
  principal: string
  period: {
    start: string
    end: string
  }
  official_phone: string
  blueprint_file: Uploadable
  construction_company: string
  supervision_company: string
  organizer: string
}

export interface SiteRepo {
  get(): Promise<Site>
  update(command: Site): Promise<void>
}

class HttpSiteRepo implements SiteRepo {
  userStore = useUserStore()
  api = kyWithBearerToken.extend({
    prefixUrl: urlJoin(
      env.SITE_URL,
      `api/construction-site/${this.userStore.getSiteId()}`
    ),
  })
  get(): Promise<Site> {
    return this.api.get("").json<Site>()
  }
  update(command: Site): Promise<void> {
    return this.api.put("", { json: command }).json()
  }
}

class FakeSiteRepo implements SiteRepo {
  siteMap = new Map<string, Site>()
  userStore = useUserStore()
  constructor() {
    JSON.parse(localStorage.getItem(this.constructor.name) ?? "[]").forEach(
      ([key, value]: [string, Site]) => {
        this.siteMap.set(key, value)
      }
    )
  }

  private save() {
    localStorage.setItem(
      this.constructor.name,
      JSON.stringify(Array.from(this.siteMap.entries()))
    )
  }

  async get(): Promise<Site> {
    let site = this.siteMap.get(this.userStore.getSiteId())
    if (!site) {
      const id = this.userStore.getSiteId()
      site = {
        name: `${id} 工地`,
        address: "地址",
        principal: "負責人",
        period: {
          start: "2023-11-21T01:24:35.644Z",
          end: "2023-11-21T01:24:35.644Z",
        },
        official_phone: "02-12345678",
        blueprint_file: { value: [] },
        construction_company: "建造公司",
        supervision_company: "監造公司",
        organizer: "主辦單位",
      }
    }
    return site
  }
  async update(command: Site): Promise<void> {
    this.siteMap.set(this.userStore.getSiteId(), { ...command })
    this.save()
  }
}

let siteRepo: SiteRepo
export function useSiteRepo(): SiteRepo {
  if (siteRepo) return siteRepo
  siteRepo = env.SITE_REPO === "HTTP" ? new HttpSiteRepo() : new FakeSiteRepo()
  return siteRepo
}
