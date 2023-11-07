export interface Inventory {
  id: string
  name: string
  description: string
  supplier: string
  amount: number
  unit: string
  location: string
  tags: string[]
}

const data: Inventory[] = Array.from(
  { length: 13 },
  (_, i) =>
    <Inventory>{
      id: i.toString(),
      location: `位置 ${i}`,
      name: `名稱 ${i}`,
      unit: `單位 ${i}`,
      amount: 20,
      supplier: `供應商 ${i}`,
      description: `描述 ${i}`,
      tags: [],
    }
)

export async function queryInventory(
  keyword: string,
  skip: number,
  take: number
) {
  const filtered = data.filter(
    (item) => item.name.includes(keyword) || item.location.includes(keyword)
  )
  return {
    items: filtered.slice(skip, skip + take),
    total: filtered.length,
  }
}

export async function createInventory(inventory: Inventory) {
  data.push(JSON.parse(JSON.stringify(inventory)))
}

export async function updateInventory(id: string, inventory: Inventory) {
  const index = data.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  data[index] = JSON.parse(JSON.stringify(inventory))
}

export async function deleteInventory(id: string) {
  const index = data.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  data.splice(index, 1)
}
