export type Contractor = {
  id: string
  site_id: string
  tax_number: string
  name: string
  principal: string
  phone: string
  email: string
}

const contractors: Contractor[] = Array.from(
  { length: 13 },
  (_, i) =>
    <Contractor>{
      id: i.toString(),
      site_id: "SIDE_ID",
      tax_number: `統一編號 ${i}`,
      name: `名稱 ${i}`,
      principal: `負責人 ${i}`,
      phone: `0987654321`,
      email: `單位 ${i}`,
    }
)

export async function queryContractors(
  keyword: string,
  skip: number,
  take: number
) {
  const filtered = contractors.filter((item) => item.name.includes(keyword))
  return {
    items: filtered.slice(skip, skip + take),
    total: filtered.length,
  }
}

export async function getContractor(id: string) {
  const index = contractors.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  return contractors[index]
}

export type CreateContractorCommand = Omit<Contractor, "site_id" | "id">

export async function createContractor(command: CreateContractorCommand) {
  const contractor = <Contractor>{
    site_id: "SIDE_ID",
    id: (contractors.length + 1).toString(),
    ...command,
  }
  contractors.push(contractor)
}

export type UpdateContractorCommand = Omit<Contractor, "site_id" | "id">

export async function updateContractor(
  id: string,
  command: UpdateContractorCommand
) {
  const index = contractors.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  contractors[index] = {
    ...contractors[index],
    ...command,
  }
}

export async function deleteContractor(id: string) {
  const index = contractors.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  contractors.splice(index, 1)
}
