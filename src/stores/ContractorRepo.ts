import { env } from "@/environment"
import { type Repo, type QueryBase, FakeRepo } from "@/utilities/repo"
import { useEntityNameCache } from "@/stores/EntityNameCache"

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
  queryPredicate(query: ContractorQuery): (item: Contractor) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Contractor) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetContractorCommand): Contractor {
    return {
      id: Math.random().toString(),
      site_id: env.SITE_ID,
      ...command,
    }
  }
  updateItem(item: Contractor, command: SetContractorCommand): void {
    Object.assign(item, command)
    const nameCache = useEntityNameCache()
    nameCache.set(`Contractor:${item.id}`, item.name)
  }
}

let contractorRepo: ContractorRepo | undefined

export function useContractorRepo() {
  if (contractorRepo) return contractorRepo
  contractorRepo = new FakeContractorRepo()
  return contractorRepo
}

export function ensureContractorNameCached(id: string): string {
  const nameCache = useEntityNameCache()
  const key = `Contractor:${id}`
  if (nameCache.get(key)) return key
  useContractorRepo()
    .get(id)
    .then((o) => nameCache.set(key, o.name))
  return key
}
