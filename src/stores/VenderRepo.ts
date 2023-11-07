export type Vender = {
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

export type CreateVenderCommand = Omit<Vender, "site_id">

export async function createVender(command: CreateVenderCommand) {
  const vender = <Vender>{
    site_id: "SIDE_ID",
    id: (venders.length + 1).toString(),
    ...command,
  }
  venders.push(vender)
}

export type UpdateVenderCommand = Omit<Vender, "site_id" | "tax_number">

export async function updateVender(
  tax_number: string,
  command: UpdateVenderCommand
) {
  const index = venders.findIndex((item) => item.tax_number === tax_number)
  if (index === -1) {
    throw new Error("Not found")
  }
  venders[index] = {
    ...venders[index],
    ...command,
  }
}

export async function deleteVender(tax_number: string) {
  const index = venders.findIndex((item) => item.tax_number === tax_number)
  if (index === -1) {
    throw new Error("Not found")
  }
  venders.splice(index, 1)
}
