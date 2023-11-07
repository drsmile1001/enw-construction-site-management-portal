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

const inventories: Inventory[] = Array.from(
  { length: 13 },
  (_, i) =>
    <Inventory>{
      site_id: "SIDE_ID",
      id: i.toString(),
      location: `位置 ${i}`,
      name: `名稱 ${i}`,
      unit: `單位 ${i}`,
      amount: 20,
      supplier: `供應商 ${i}`,
      description: `描述 ${i}`,
      tags: ["aa", "bb"],
      update_time: new Date().toISOString(),
    }
)

export async function queryInventories(
  keyword: string,
  skip: number,
  take: number
) {
  const filtered = inventories.filter(
    (item) => item.name.includes(keyword) || item.location.includes(keyword)
  )
  return {
    items: filtered.slice(skip, skip + take),
    total: filtered.length,
  }
}

export type SetInventoryCommand = Omit<
  Inventory,
  "site_id" | "id" | "update_time"
>

export async function createInventory(command: SetInventoryCommand) {
  const inventory: Inventory = {
    site_id: "SIDE_ID",
    id: (inventories.length + 1).toString(),
    update_time: new Date().toISOString(),
    ...command,
  }
  inventories.push(inventory)
}

export async function updateInventory(
  id: string,
  command: SetInventoryCommand
) {
  const index = inventories.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  inventories[index] = {
    ...inventories[index],
    ...command,
    update_time: new Date().toISOString(),
  }
}

export async function deleteInventory(id: string) {
  const index = inventories.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  inventories.splice(index, 1)
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

const purchases: Purchase[] = Array.from(
  { length: 13 },
  (_, i) =>
    <Purchase>{
      site_id: "SIDE_ID",
      id: i.toString(),
      name: `名稱 ${i}`,
      description: `描述 ${i}`,
      supplier: `供應商 ${i}`,
      amount: 20,
      unit: `單位 ${i}`,
      accumulation: 20,
      update_time: new Date().toISOString(),
    }
)

export async function queryPurchases(
  keyword: string,
  skip: number,
  take: number
) {
  const filtered = purchases.filter((item) => item.name.includes(keyword))
  return {
    items: filtered.slice(skip, skip + take),
    total: filtered.length,
  }
}

export type SetPurchaseCommand = Omit<
  Purchase,
  "site_id" | "id" | "update_time"
>

export async function createPurchase(command: SetPurchaseCommand) {
  const purchase = <Purchase>{
    site_id: "SIDE_ID",
    id: (purchases.length + 1).toString(),
    update_time: new Date().toISOString(),
    ...command,
  }
  purchases.push(purchase)
}

export async function deletePurchase(id: string) {
  const index = purchases.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  purchases.splice(index, 1)
}
