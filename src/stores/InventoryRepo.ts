import { env } from "@/environment"
import { buildParms, appKy } from "@/utilities/ky"
import {
  type Repo,
  type QueryBase,
  FakeRepo,
  type QueryResult,
} from "@/utilities/repo"
import urlJoin from "url-join"

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

export type InventoryQuery = QueryBase & {
  location?: string
  supplier?: string
  tags?: string[]
}

export type ModifyInventoryCommand = Omit<
  Inventory,
  "site_id" | "id" | "update_time"
>

export interface InventoryRepo
  extends Repo<
    Inventory,
    InventoryQuery,
    ModifyInventoryCommand,
    ModifyInventoryCommand
  > {}

class HttpInventoryRepo implements InventoryRepo {
  api = appKy.extend({
    prefixUrl: urlJoin(
      env.INVENTORY_MANAGER_URL,
      "api/construction-site",
      env.SITE_ID,
      "inventory"
    ),
  })
  query(query: InventoryQuery): Promise<QueryResult<Inventory>> {
    return this.api
      .get("", {
        searchParams: buildParms(query),
      })
      .json()
  }
  async get(id: string): Promise<Inventory> {
    const result = await this.query({ ids: [id] })
    return result.items[0]
  }
  async create(command: ModifyInventoryCommand): Promise<void> {
    await this.api.post("", {
      json: {
        items: [command],
        recorder: "",
      },
    })
  }
  async update(id: string, command: ModifyInventoryCommand): Promise<void> {
    await this.api.patch(id, {
      json: {
        editor: "",
        ...command,
      },
    })
  }
  delete(_id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}

class FakeInventoryRepo extends FakeRepo<
  Inventory,
  InventoryQuery,
  ModifyInventoryCommand,
  ModifyInventoryCommand
> {
  queryPredicate(query: QueryBase): (item: Inventory) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Inventory) => boolean {
    return (item) => item.id === id
  }
  createItem(command: ModifyInventoryCommand): Inventory {
    return {
      site_id: env.SITE_ID,
      id: Math.random().toString(),
      update_time: new Date().toISOString(),
      ...command,
    }
  }
  updateItem(item: Inventory, command: ModifyInventoryCommand): void {
    Object.assign(item, command)
    item.update_time = new Date().toISOString()
  }
}

let inventoryRepo: InventoryRepo | undefined

export function useInventoryRepo() {
  if (inventoryRepo) return inventoryRepo
  inventoryRepo =
    env.INVENTORY_REPO === "HTTP"
      ? new HttpInventoryRepo()
      : new FakeInventoryRepo()
  return inventoryRepo
}

export const dangerTags = [
  "氧化性固體",
  "易燃固體",
  "發火性液體",
  "發火性固體",
  "禁水性物質",
  "易燃液體",
  "可燃液體",
  "自反應物質",
  "有機過氧化物",
  "氧化性液體",
]
