export type Vender = {
  id: string
  site_id: string
  tax_number: string
  name: string
  principal: string
  phone: string
  email: string
}

const venders: Vender[] = Array.from(
  { length: 13 },
  (_, i) =>
    <Vender>{
      id: i.toString(),
      site_id: "SIDE_ID",
      tax_number: `統一編號 ${i}`,
      name: `名稱 ${i}`,
      principal: `負責人 ${i}`,
      phone: `0987654321`,
      email: `單位 ${i}`,
    }
)

export async function queryVenders(
  keyword: string,
  skip: number,
  take: number
) {
  const filtered = venders.filter((item) => item.name.includes(keyword))
  return {
    items: filtered.slice(skip, skip + take),
    total: filtered.length,
  }
}

export async function getVender(id: string) {
  const index = venders.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  return venders[index]
}

export type CreateVenderCommand = Omit<Vender, "site_id" | "id">

export async function createVender(command: CreateVenderCommand) {
  const vender = <Vender>{
    site_id: "SIDE_ID",
    id: (venders.length + 1).toString(),
    ...command,
  }
  venders.push(vender)
}

export type UpdateVenderCommand = Omit<Vender, "site_id" | "id">

export async function updateVender(id: string, command: UpdateVenderCommand) {
  const index = venders.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  venders[index] = {
    ...venders[index],
    ...command,
  }
}

export async function deleteVender(id: string) {
  const index = venders.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  venders.splice(index, 1)
}