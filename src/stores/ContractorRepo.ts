import { type Repo, type QueryBase, FakeRepo } from "@/utilities/repo"
import { Cache } from "@/stores/Cache"
import type { Accessable } from "@/types/vue-router"
import { useUserStore } from "./User"

export type Contractor = {
  id: string
  site_id: string
  tax_number: string
  name: string
  principal: string
  phone: string
  email: string
}

export type SetContractorCommand = Omit<Contractor, "site_id" | "id">
export type ContractorQuery = QueryBase

export interface ContractorRepo
  extends Repo<
    Contractor,
    ContractorQuery,
    SetContractorCommand,
    SetContractorCommand
  > {}

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
      site_id: this.userStore.getSiteId(),
      ...command,
    }
  }
  updateItem(item: Contractor, command: SetContractorCommand): void {
    Object.assign(item, command)
    nameCache.setCache(item.id, item.name)
  }
}

let contractorRepo: ContractorRepo | undefined

export function useContractorRepo() {
  if (contractorRepo) return contractorRepo
  contractorRepo = new FakeContractorRepo()
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
  const userStore = useUserStore()
  try {
    const item = await repo.get(id)
    if (item.site_id !== userStore.getSiteId()) return "FORBIDDEN"
    return "OK"
  } catch (error) {
    return "NOT_FOUND"
  }
}
