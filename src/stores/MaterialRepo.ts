import { type Repo, type QueryBase, FakeRepo } from "@/utilities/repo"

export type Inventory = {
  site_id: string
  id: string
  name: string
  description: string
  supplier: string
  amount: number
  unit: string
  location: string
  tags: string[]
  update_time: string
}

export type SetInventoryCommand = Omit<
  Inventory,
  "site_id" | "id" | "update_time"
>

export interface InventoryRepo
  extends Repo<
    Inventory,
    QueryBase,
    SetInventoryCommand,
    SetInventoryCommand
  > {}

class FakeInventoryRepo extends FakeRepo<
  Inventory,
  QueryBase,
  SetInventoryCommand,
  SetInventoryCommand
> {
  queryPredicate(query: QueryBase): (item: Inventory) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Inventory) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetInventoryCommand): Inventory {
    return {
      site_id: "1",
      id: Math.random().toString(),
      update_time: new Date().toISOString(),
      ...command,
    }
  }
  updateItem(item: Inventory, command: SetInventoryCommand): void {
    Object.assign(item, command)
    item.update_time = new Date().toISOString()
  }
}

let inventoryRepo: InventoryRepo | undefined

export function useInventoryRepo() {
  if (inventoryRepo) return inventoryRepo
  inventoryRepo = new FakeInventoryRepo()
  console.log(inventoryRepo)
  return inventoryRepo
}

export type Purchase = {
  site_id: string
  id: string
  name: string
  description: string
  supplier: string
  amount: number
  unit: string
  accumulation: number
  update_time: string
}

export type SetPurchaseCommand = Omit<
  Purchase,
  "site_id" | "id" | "update_time"
>

export interface PurchaseRepo
  extends Repo<Purchase, QueryBase, SetPurchaseCommand, void> {}

class FakePurchaseRepo extends FakeRepo<
  Purchase,
  QueryBase,
  SetPurchaseCommand,
  void
> {
  queryPredicate(query: QueryBase): (item: Purchase) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Purchase) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetPurchaseCommand): Purchase {
    return {
      site_id: "1",
      id: Math.random().toString(),
      update_time: new Date().toISOString(),
      ...command,
    }
  }
}

let purchaseRepo: PurchaseRepo | undefined

export function usePurchaseRepo() {
  if (purchaseRepo) return purchaseRepo
  purchaseRepo = new FakePurchaseRepo()
  console.log(purchaseRepo)
  return purchaseRepo
}
