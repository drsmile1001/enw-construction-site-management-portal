import { env } from "@/environment"
import { buildParms } from "@/utilities/ky"
import {
  type QueryBase,
  FakeRepo,
  type Repo,
  type QueryResult,
} from "@/utilities/repo"
import ky from "ky"
import type { Uploadable } from "./FileRepo"

export type Worker = {
  id: string
  site_id: string
  worker_no: string
  contractor_id: string
  name: string
  personal_id: string
  job_title: string
  picture_file: Uploadable
}

export type WorkerQuery = QueryBase & {
  worker_no?: string
  contractor_id?: string
  name?: string
  job_title?: string
}
export type CreateWorkerCommand = Omit<Worker, "site_id" | "id">
export type UpdateWorkerCommand = Pick<
  Worker,
  "worker_no" | "name" | "job_title"
>

export interface WorkerRepo
  extends Repo<Worker, WorkerQuery, CreateWorkerCommand, UpdateWorkerCommand> {}

class HttpWorkerRepo implements WorkerRepo {
  api = ky.create({
    prefixUrl: `${env.DOORMAN_URL}api/construction-site/${env.SITE_ID}/worker/`,
  })
  query(query: WorkerQuery): Promise<QueryResult<Worker>> {
    return this.api
      .get("", {
        searchParams: buildParms(query),
      })
      .json()
  }
  async get(id: string): Promise<Worker> {
    const result = await this.query({ ids: [id] })
    return result.items[0]
  }
  async create(command: CreateWorkerCommand): Promise<void> {
    await this.api.post("", {
      json: {
        items: [command],
        recorder: "",
      },
    })
  }
  async update(id: string, command: UpdateWorkerCommand): Promise<void> {
    await this.api.patch(id, {
      json: command,
      searchParams: {
        editor: "",
      },
    })
  }
  async delete(id: string): Promise<void> {
    await this.api.delete(id, {
      searchParams: {
        editor: "",
      },
    })
  }
}

class FakeWorkerRepo extends FakeRepo<
  Worker,
  WorkerQuery,
  CreateWorkerCommand,
  UpdateWorkerCommand
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
  createItem(command: CreateWorkerCommand): Worker {
    return {
      site_id: env.SITE_ID,
      id: Math.random().toString(),
      ...command,
    }
  }
}

let workerRepo: WorkerRepo | undefined

export function useWorkerRepo(): WorkerRepo {
  if (!workerRepo) {
    workerRepo =
      env.WORKER_REPO === "HTTP" ? new HttpWorkerRepo() : new FakeWorkerRepo()
  }
  return workerRepo
}
