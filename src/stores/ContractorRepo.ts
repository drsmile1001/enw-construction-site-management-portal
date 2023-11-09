import { type Repo, type QueryBase, FakeRepo } from "@/utilities/repo"

export type Contractor = {
  id: string
  site_id: string
  tax_number: string
  name: string
  principal: string
  phone: string
  email: string
}

export interface ContractorRepo
  extends Repo<
    Contractor,
    QueryBase,
    SetContractorCommand,
    SetContractorCommand
  > {}

export type SetContractorCommand = Omit<Contractor, "site_id" | "id">

class FakeContractorRepo extends FakeRepo<
  Contractor,
  QueryBase,
  SetContractorCommand,
  SetContractorCommand
> {
  queryPredicate(query: QueryBase): (item: Contractor) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Contractor) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetContractorCommand): Contractor {
    return {
      id: Math.random().toString(),
      site_id: "1",
      ...command,
    }
  }
}

let contractorRepo: ContractorRepo | undefined

export function useContractorRepo() {
  if (contractorRepo) return contractorRepo
  contractorRepo = new FakeContractorRepo()
  return contractorRepo
}
