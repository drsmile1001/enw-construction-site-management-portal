import { type Repo, type QueryBase, FakeRepo } from "@/utilities/repo"

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

export type MachineryQuery = QueryBase & { contractor_id?: string }
export type SetMachineryCommand = Omit<Machinery, "site_id" | "id">

export interface MachineryRepo
  extends Repo<
    Machinery,
    MachineryQuery,
    SetMachineryCommand,
    SetMachineryCommand
  > {}

class FakeMachineryRepo extends FakeRepo<
  Machinery,
  MachineryQuery,
  SetMachineryCommand,
  SetMachineryCommand
> {
  queryPredicate(query: MachineryQuery): (item: Machinery) => boolean {
    return (item) =>
      (!query.keyword || item.name.includes(query.keyword)) &&
      (!query.contractor_id || item.contractor_id === query.contractor_id)
  }
  idPredicate(id: string): (item: Machinery) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetMachineryCommand): Machinery {
    return {
      site_id: "1",
      id: Math.random().toString(),
      ...command,
    }
  }
}

let machineryRepo: MachineryRepo | undefined

export function useMachineryRepo() {
  if (machineryRepo) return machineryRepo
  machineryRepo = new FakeMachineryRepo()
  return machineryRepo
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
