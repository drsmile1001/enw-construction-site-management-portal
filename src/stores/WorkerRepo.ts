import { type QueryBase, FakeRepo, type Repo } from "@/utilities/repo"

export type Worker = {
  id: string
  site_id: string
  worker_no: string
  contractor_id: string
  name: string
  personal_id: string
  job_title: string
  picture_file: string | null
}

export type WorkerQuery = QueryBase & {
  contractor_id?: string
  job_title?: string
}
export type SetWorkerCommand = Omit<Worker, "site_id" | "id">

export interface WorkerRepo
  extends Repo<Worker, WorkerQuery, SetWorkerCommand, SetWorkerCommand> {}

class FakeWorkerRepo extends FakeRepo<
  Worker,
  WorkerQuery,
  SetWorkerCommand,
  SetWorkerCommand
> {
  queryPredicate(query: WorkerQuery): (item: Worker) => boolean {
    return (item) =>
      (!query.keyword ||
        item.name.includes(query.keyword) ||
        item.personal_id.includes(query.keyword)) &&
      (!query.contractor_id || item.contractor_id === query.contractor_id) &&
      (!query.job_title || item.job_title.includes(query.job_title))
  }
  idPredicate(id: string): (item: Worker) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetWorkerCommand): Worker {
    return {
      site_id: "1",
      id: Math.random().toString(),
      ...command,
    }
  }
}

let workerRepo: WorkerRepo | undefined

export function useWorkerRepo(): WorkerRepo {
  if (!workerRepo) {
    workerRepo = new FakeWorkerRepo()
  }
  return workerRepo
}
