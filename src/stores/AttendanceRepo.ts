import { ITEMS_PER_PAGE, env } from "@/environment"
import { type Worker, useWorkerRepo } from "@/stores/WorkerRepo"
import { buildParms, appKy } from "@/utilities/ky"
import type { QueryResult } from "@/utilities/repo"
import type { Machinery } from "./MachineryRepo"
import urlJoin from "url-join"

export type Attendance = {
  site_id: string
  type: AttendanceType
  content: {} //TODO: 確認出席記錄中內文的型別
  is_attendance: boolean
  resource_id: string
  date: string
  picture_file: {} //TODO: 確認出席記錄中圖片的型別
  worker?: Worker
  machinery?: Machinery
}

export type AttendanceType = "worker" | "machinery"

export type AttendanceQuery = {
  date: Date
}

export interface AttendanceRepo {
  query(
    date: Date,
    page: number,
    type: AttendanceType
  ): Promise<QueryResult<Attendance>>
  getTotalInsite(type: AttendanceType): Promise<number>
}

class HttpAttendanceRepo implements AttendanceRepo {
  api = appKy.extend({
    prefixUrl: urlJoin(env.DOORMAN_URL, "api/construction-site", env.SITE_ID),
  })
  async query(
    date: Date,
    page: number,
    type: AttendanceType
  ): Promise<QueryResult<Attendance>> {
    const records = await this.api
      .get(`${type}/attendance`, {
        searchParams: buildParms({
          date,
        }),
      })
      .json<Attendance[]>()
    return {
      total: records.length,
      items: records.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    }
  }

  async getTotalInsite(type: AttendanceType): Promise<number> {
    return await this.api.get(`${type}/total-insite`).json<number>()
  }
}

class FakeAttendanceRepo implements AttendanceRepo {
  workerRepo = useWorkerRepo()
  async query(date: Date, page: number): Promise<QueryResult<Attendance>> {
    const workers = await this.workerRepo.query({})
    const total = workers.items.map(
      (w) =>
        <Attendance>{
          site_id: env.SITE_ID,
          type: "worker",
          content: {},
          is_attendance: true,
          resource_id: w.id,
          date: date.toISOString(),
          picture_file: {},
          worker: w,
        }
    )
    return {
      total: total.length,
      items: total.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    }
  }
  getTotalInsite(_type: AttendanceType): Promise<number> {
    return Promise.resolve(0)
  }
}

let attendanceRepo: AttendanceRepo | null = null

export function useAttendanceRepo(): AttendanceRepo {
  if (attendanceRepo) return attendanceRepo
  attendanceRepo =
    env.ATTENDANCE_REPO === "HTTP"
      ? new HttpAttendanceRepo()
      : new FakeAttendanceRepo()
  return attendanceRepo
}
