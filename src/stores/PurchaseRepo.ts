import { env } from "@/environment"
import { buildParms, kyWithBearerToken } from "@/utilities/ky"
import {
  type Repo,
  type QueryBase,
  FakeRepo,
  type QueryResult,
} from "@/utilities/repo"
import { useUserStore } from "./User"

export type Purchase = {
  site_id: string
  id: string
  supplier: string
  unit: string
  accumulation: number
  name: string
  description: string
  amount: number
  update_time: string
}

export type CreatePurchaseCommand = Omit<
  Purchase,
  "site_id" | "id" | "update_time"
>

export interface PurchaseRepo
  extends Repo<Purchase, PurchaseQuery, CreatePurchaseCommand, void> {}

export type PurchaseQuery = QueryBase & {
  since?: Date
  until?: Date
  supplier?: string
  keyword?: string
}

class HttpPurchaseRepo implements PurchaseRepo {
  userStore = useUserStore()
  api = kyWithBearerToken.create({
    prefixUrl: `${
      env.INVENTORY_MANAGER_URL
    }api/construction-site/${this.userStore.getSiteId()}/purchase/`,
  })
  query(query: PurchaseQuery): Promise<QueryResult<Purchase>> {
    return this.api
      .get("", {
        searchParams: buildParms({
          ...query,
          since: query.since ?? new Date(0),
        }),
      })
      .json()
  }
  async get(id: string): Promise<Purchase> {
    const result = await this.query({ ids: [id] })
    return result.items[0]
  }
  async create(command: CreatePurchaseCommand): Promise<void> {
    await this.api.post("", {
      json: {
        items: [command],
        recorder: "",
        purchase_date: new Date().toISOString(),
      },
    })
  }
  update(_id: string, _command: void): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async delete(id: string): Promise<void> {
    await this.api.delete(id)
  }
}

class FakePurchaseRepo extends FakeRepo<
  Purchase,
  PurchaseQuery,
  CreatePurchaseCommand,
  void
> {
  userStore = useUserStore()
  queryPredicate(query: PurchaseQuery): (item: Purchase) => boolean {
    return (item) =>
      (!query.keyword || item.name.includes(query.keyword)) &&
      (!query.supplier || item.supplier.includes(query.supplier))
  }
  idPredicate(id: string): (item: Purchase) => boolean {
    return (item) => item.id === id
  }
  createItem(command: CreatePurchaseCommand): Purchase {
    return {
      site_id: this.userStore.getSiteId(),
      id: Math.random().toString(),
      update_time: new Date().toISOString(),
      ...command,
    }
  }
}

let purchaseRepo: PurchaseRepo | undefined

export function usePurchaseRepo() {
  if (purchaseRepo) return purchaseRepo
  purchaseRepo =
    env.PURCHASE_REPO === "HTTP"
      ? new HttpPurchaseRepo()
      : new FakePurchaseRepo()
  return purchaseRepo
}
