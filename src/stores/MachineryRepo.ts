import { env } from "@/environment"
import { buildParms, kyWithBearerToken } from "@/utilities/ky"
import {
  type Repo,
  type QueryBase,
  FakeRepo,
  type QueryResult,
} from "@/utilities/repo"
import { useUserStore } from "./User"

export type Machinery = {
  site_id: string
  id: string
  contractor_id: string
  license_no: string
  name: string
  machine_type: string
  driver: string
  driver_phone: string
}

export type MachineryQuery = QueryBase & {
  license_no?: string
  contractor_id?: string
  name?: string
  machine_type?: string
  driver?: string
}

export type CreateMachineryCommand = Omit<Machinery, "site_id" | "id">
export type UpdateMachineryCommand = Omit<
  CreateMachineryCommand,
  "contractor_id"
>

export interface MachineryRepo
  extends Repo<
    Machinery,
    MachineryQuery,
    CreateMachineryCommand,
    UpdateMachineryCommand
  > {}

class HttpMachineryRepo implements MachineryRepo {
  userStore = useUserStore()
  api = computed(() =>
    kyWithBearerToken.extend({
      prefixUrl: `${
        env.DOORMAN_URL
      }api/construction-site/${this.userStore.getSiteId()}/machinery/`,
    })
  )
  async query(query: MachineryQuery): Promise<QueryResult<Machinery>> {
    return this.api.value
      .get("", {
        searchParams: buildParms(query),
      })
      .json()
  }
  async get(id: string): Promise<Machinery> {
    const result = await this.query({ ids: [id] })
    return result.items[0]
  }
  async create(command: CreateMachineryCommand): Promise<void> {
    await this.api.value.post("", {
      json: {
        items: [
          {
            ...command,
            job_title: "", //TODO: 待後端修正後移除
          },
        ],
        recorder: "",
      },
    })
  }
  async update(id: string, command: UpdateMachineryCommand): Promise<void> {
    await this.api.value.patch(id, {
      json: command,
      searchParams: {
        editor: "",
      },
    })
  }
  async delete(id: string): Promise<void> {
    await this.api.value.delete(id, {
      searchParams: {
        editor: "",
      },
    })
  }
}

class FakeMachineryRepo extends FakeRepo<
  Machinery,
  MachineryQuery,
  CreateMachineryCommand,
  UpdateMachineryCommand
> {
  userStore = useUserStore()
  queryPredicate(query: MachineryQuery): (item: Machinery) => boolean {
    return (item) =>
      (!query.keyword || item.name.includes(query.keyword)) &&
      (!query.contractor_id || item.contractor_id === query.contractor_id) &&
      (!query.machine_type || item.machine_type === query.machine_type)
  }
  idPredicate(id: string): (item: Machinery) => boolean {
    return (item) => item.id === id
  }
  createItem(command: CreateMachineryCommand): Machinery {
    return {
      site_id: this.userStore.getSiteId(),
      id: Math.random().toString(),
      ...command,
    }
  }
}

let machineryRepo: MachineryRepo | undefined

export function useMachineryRepo() {
  if (machineryRepo) return machineryRepo
  machineryRepo =
    env.MACHINERY_REPO === "HTTP"
      ? new HttpMachineryRepo()
      : new FakeMachineryRepo()
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
