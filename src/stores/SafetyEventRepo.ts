import { ITEMS_PER_PAGE, env } from "@/environment"
import { type QueryBase, type QueryResult } from "@/utilities/repo"
import { formatISO, parseISO } from "date-fns"
import { buildParms, appKy } from "@/utilities/ky"
import urlJoin from "url-join"

export type SafetyEvent = {
  id: string
  alarm_type: string
  description: string
  content: Record<string, unknown>
  picture_file: {}
  date: string
}

export type SafetyEventQuery = QueryBase & {
  alarm_types?: string[]
  range?: [number, number]
}

export interface SafetyEventRepo {
  query(query: SafetyEventQuery): Promise<QueryResult<SafetyEvent>>
}

class HttpSafetyEventRepo implements SafetyEventRepo {
  api = appKy.extend({
    prefixUrl: urlJoin(
      env.SITE_URL,
      "api/construction-site",
      env.SITE_ID,
      "event"
    ),
  })
  query(query: SafetyEventQuery): Promise<QueryResult<SafetyEvent>> {
    return this.api
      .get("", {
        searchParams: buildParms({
          ...query,
          start: query.range ? formatISO(query.range[0]) : undefined,
          end: query.range ? formatISO(query.range[1]) : undefined,
          range: undefined,
        }),
      })
      .json()
  }
}

class FakeSafetyEventRepo implements SafetyEventRepo {
  latestHours(): Date[] {
    const now = new Date()
    return Array.from(
      { length: 24 },
      (_, i) => new Date(now.getTime() - i * 3600 * 1000)
    )
  }

  data = safetyAlarmSettings
    .flatMap(({ types }) => types)
    .map((type) =>
      this.latestHours().map(
        (time) =>
          <SafetyEvent>{
            id: Math.random().toString(),
            alarm_type: type,
            description: "描述",
            content: {},
            picture_file: { value: null },
            date: time.toISOString(),
          }
      )
    )
    .flat()
  async query(query: SafetyEventQuery): Promise<QueryResult<SafetyEvent>> {
    const filtered = this.data.filter(
      (item) =>
        !query.alarm_types ||
        (query.alarm_types.includes(item.alarm_type) &&
          (!query.range ||
            (query.range![0] <= parseISO(item.date).valueOf() &&
              parseISO(item.date).valueOf() <= query.range![1])))
    )

    return {
      total: filtered.length,
      items: filtered.slice(
        query.skip ?? 0,
        (query.skip ?? 0) + (query.take ?? ITEMS_PER_PAGE)
      ),
    }
  }
}

let safetyEventRepo: SafetyEventRepo

export function useSafetyEventRepo() {
  if (!safetyEventRepo) {
    safetyEventRepo =
      env.SAFETY_EVENT_REPO === "HTTP"
        ? new HttpSafetyEventRepo()
        : new FakeSafetyEventRepo()
  }
  return safetyEventRepo
}

//TODO: 議定要用的 AlarmType
export type SafetyAlarmSetting = {
  id: string
  name: string
  types: string[]
}

export const safetyAlarmSettings: SafetyAlarmSetting[] = [
  {
    id: "env",
    name: "工地環境",
    types: ["工作環境", "環境污染", "重大異常", "熱傷害風險"],
  },
  {
    id: "device",
    name: "設備防護",
    types: ["機箱溫度", "機箱開啟"],
  },
  {
    id: "person",
    name: "人員安全",
    types: [
      "闖入",
      "跌倒",
      "未戴安全帽",
      "危險區域入侵",
      "工地安全帽偵測",
      "物件偵測",
    ],
  },
]
