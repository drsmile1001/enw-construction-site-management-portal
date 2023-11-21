import { ITEMS_PER_PAGE } from "@/environment"
import { type QueryBase, type QueryResult } from "@/utilities/repo"
import type { Uploadable } from "./FileRepo"
import { parseISO } from "date-fns"

export type SafetyEvent = {
  id: string
  alarm_type: string
  description: string
  content: Record<string, unknown>
  picture_file: Uploadable
  time: string
}

export type SafetyEventQuery = QueryBase & {
  alarm_type?: string[]
  range?: [Date, Date]
}

export interface SafetyEventRepo {
  query(query: SafetyEventQuery): Promise<QueryResult<SafetyEvent>>
}

class FakeSafetyEventRepo implements SafetyEventRepo {
  latestHours(): Date[] {
    const now = new Date()
    return Array.from(
      { length: 24 },
      (_, i) => new Date(now.getTime() - i * 3600 * 1000)
    )
  }

  data = safetyAlarmTypes
    .map(({ id }) =>
      this.latestHours().map(
        (time) =>
          <SafetyEvent>{
            id: Math.random().toString(),
            alarm_type: id,
            description: "描述",
            content: {},
            picture_file: { value: null },
            time: time.toISOString(),
          }
      )
    )
    .flat()
  async query(query: SafetyEventQuery): Promise<QueryResult<SafetyEvent>> {
    const filtered = this.data.filter(
      (item) =>
        !query.alarm_type ||
        (query.alarm_type.includes(item.alarm_type) &&
          (!query.range ||
            (query.range![0] <= parseISO(item.time) &&
              parseISO(item.time) <= query.range![1])))
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
    safetyEventRepo = new FakeSafetyEventRepo()
  }
  return safetyEventRepo
}

export type SafetyAlarmType = {
  id: string
  name: string
  category: string
}

const safetyAlarmSetting: [[string, string], [string, string][]][] = [
  [
    ["env", "工地環境"],
    [
      ["ID1", "工作環境"],
      ["ID2", "環境污染"],
      ["ID3", "重大異常"],
    ],
  ],
  [
    ["device", "設備防護"],
    [
      ["ID4", "機箱溫度"],
      ["ID5", "機箱開啟"],
    ],
  ],
  [
    ["person", "人員安全"],
    [
      ["ID6", "危險區域管制"],
      ["ID7", "夜間保全"],
      ["ID8", "人員安全警戒"],
    ],
  ],
]
export const safetyAlarmTypes: SafetyAlarmType[] = safetyAlarmSetting.flatMap(
  ([[category], items]) => items.map(([id, name]) => ({ id, name, category }))
)

export const safetyAlarmCategories = safetyAlarmSetting.map(
  ([category]) => category
)
