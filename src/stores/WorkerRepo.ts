import type { QueryBase } from "@/utilities/repo"

export type Worker = {
  id: string
  site_id: string
  worker_no: string
  contractor_id: string
  name: string
  personal_id: string
  job_title: string
  picture_file: string
}

const workers: Worker[] = []

export async function queryWorkers(
  query: QueryBase & { contractor_id?: string }
) {
  const filtered = workers.filter(
    (item) =>
      (query.contractor_id === undefined ||
        item.contractor_id === query.contractor_id) &&
      (query.keyword === undefined ||
        item.name.includes(query.keyword) ||
        item.personal_id.includes(query.keyword))
  )
  return {
    items: filtered.slice(query.skip, (query.skip ?? 0) + (query.take ?? 10)),
    total: filtered.length,
  }
}

export async function getWorker(id: string) {
  const worker = workers.find((item) => item.id === id)
  if (worker === undefined) {
    throw new Error("Not found")
  }
  return worker
}

export type SetWorkerCommand = Omit<Worker, "site_id" | "id">

export async function createWorker(command: SetWorkerCommand) {
  workers.push({
    ...command,
    id: Math.random().toString(),
    site_id: "SIDE_ID",
  })
}

export async function updateWorker(id: string, command: SetWorkerCommand) {
  const index = workers.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  workers[index] = {
    ...command,
    id,
    site_id: "SIDE_ID",
  }
}

export async function deleteWorker(id: string) {
  const index = workers.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error("Not found")
  }
  workers.splice(index, 1)
}
