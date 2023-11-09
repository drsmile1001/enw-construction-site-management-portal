import type { QueryBase } from "@/utilities/repo"

export type Machinery = {
  site_id: string
  id: string
  license_no: string
  contractor_id: string
  name: string
  machine_type: string
  driver: string
  driver_phone: string
}

const machineries: Machinery[] = []

export async function queryMachineries(
  query: QueryBase & { contractor_id?: string }
) {
  const filtered = machineries.filter(
    (item) =>
      (query.contractor_id === undefined ||
        item.contractor_id === query.contractor_id) &&
      (query.keyword === undefined ||
        item.name.includes(query.keyword) ||
        item.license_no.includes(query.keyword))
  )
  return {
    items: filtered.slice(query.skip, (query.skip ?? 0) + (query.take ?? 10)),
    total: filtered.length,
  }
}

export async function getMachinery(id: string) {
  const machinery = machineries.find((item) => item.id === id)
  if (machinery === undefined) {
    throw new Error("Not found")
  }
  return machinery
}

export type SetMachineryCommand = Omit<Machinery, "site_id" | "id">

export async function createMachinery(command: SetMachineryCommand) {
  machineries.push({
    ...command,
    id: Math.random().toString(),
    site_id: "SIDE_ID",
  })
}

export async function updateMachinery(
  id: string,
  command: SetMachineryCommand
) {
  const index = machineries.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  machineries[index] = {
    ...command,
    id,
    site_id: "SIDE_ID",
  }
}

export async function deleteMachinery(id: string) {
  const index = machineries.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  machineries.splice(index, 1)
}

export const machineryTypes = [
  "挖土機",
  "裝載機",
  "推土機",
  "起重機",
  "傾卸車",
  "堆高機",
  "平地機",
  "拖拉機",
  "壓路機",
  "挖掘機",
  "輪式裝載機",
  "塔式起重機",
  "打樁機",
  "鋪路機",
  "混凝土泵",
  "混凝土攪拌車",
  "卡車起重機",
  "履帶起重機",
  "卡車式起重機",
  "高空作業平台",
  "卡車",
  "拖車",
  "公車",
  "汽車",
  "摩托車",
  "其他",
] as const
