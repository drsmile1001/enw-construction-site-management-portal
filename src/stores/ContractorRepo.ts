import {
  type Repo,
  type QueryBase,
  FakeRepo,
  type QueryResult,
} from "@/utilities/repo"
import { Cache } from "@/stores/Cache"
import type { Accessable } from "@/types/vue-router"
import { useUserStore } from "./User"
import { buildParms, kyWithBearerToken } from "@/utilities/ky"
import urlJoin from "url-join"
import { env } from "@/environment"

export type Contractor = {
  id: string
  tax_number: string
  name: string
  principal: string
  phone: string
  email: string
}

export type SetContractorCommand = Omit<Contractor, "id">
export type ContractorQuery = QueryBase & {
  tax_number?: string
}

export interface ContractorRepo
  extends Repo<
    Contractor,
    ContractorQuery,
    SetContractorCommand,
    SetContractorCommand
  > {}

class HttpContractorRepo implements ContractorRepo {
  userStore = useUserStore()
  api = kyWithBearerToken.extend({
    prefixUrl: urlJoin(
      env.SITE_URL,
      `api/construction-site`,
      this.userStore.getSiteId(),
      "contractor"
    ),
  })
  query(query: QueryBase): Promise<QueryResult<Contractor>> {
    return this.api
      .get("", {
        searchParams: buildParms(query),
      })
      .json()
  }
  async get(id: string): Promise<Contractor> {
    const result = await this.query({ ids: [id] })
    return result.items[0]
  }
  async create(command: SetContractorCommand): Promise<void> {
    await this.api.post("", {
      json: {
        items: [command],
        recorder: "recorder",
      },
    })
  }
  async update(id: string, command: SetContractorCommand): Promise<void> {
    await this.api.put(id, {
      json: command,
    })
  }
  async delete(id: string): Promise<void> {
    await this.api.delete(id)
  }
}

class FakeContractorRepo extends FakeRepo<
  Contractor,
  ContractorQuery,
  SetContractorCommand,
  SetContractorCommand
> {
  userStore = useUserStore()
  queryPredicate(query: ContractorQuery): (item: Contractor) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Contractor) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetContractorCommand): Contractor {
    return {
      id: Math.random().toString(),
      ...command,
    }
  }
  updateItem(item: Contractor, command: SetContractorCommand): void {
    Object.assign(item, command)
    nameCache.setCache(item.id, item.name)
  }
}

let contractorRepo: ContractorRepo

export function useContractorRepo() {
  if (contractorRepo) return contractorRepo
  contractorRepo =
    env.CONTRACTOR_REPO === "HTTP"
      ? new HttpContractorRepo()
      : new FakeContractorRepo()
  return contractorRepo
}

const nameCache = new Cache(
  (id: string) => `Contractor:${id}`,
  async (id) => {
    const repo = useContractorRepo()
    const item = await repo.get(id)
    return item.name
  },
  "contractorName"
)

export const { getValue: getName, getReactiveValue: getReactiveName } =
  nameCache

export async function checkContractorAccessable(
  id: string
): Promise<Accessable> {
  const repo = useContractorRepo()
  try {
    await repo.get(id)
    return "OK"
  } catch (error) {
    return "NOT_FOUND"
  }
}
