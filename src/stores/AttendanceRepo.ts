import { ITEMS_PER_PAGE, env } from "@/environment"
import { type Worker, useWorkerRepo } from "@/stores/WorkerRepo"
import { buildParms, kyWithBearerToken } from "@/utilities/ky"
import type { QueryResult } from "@/utilities/repo"
import type { Machinery } from "./MachineryRepo"
import { useUserStore } from "@/stores/User"
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
}

class HttpAttendanceRepo implements AttendanceRepo {
  userStore = useUserStore()
  api = kyWithBearerToken.extend({
    prefixUrl: urlJoin(
      env.DOORMAN_URL,
      "api/construction-site",
      this.userStore.getSiteId()
    ),
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
}

class FakeAttendanceRepo implements AttendanceRepo {
  userStore = useUserStore()
  workerRepo = useWorkerRepo()
  async query(date: Date, page: number): Promise<QueryResult<Attendance>> {
    const workers = await this.workerRepo.query({})
    const total = workers.items.map(
      (w) =>
        <Attendance>{
          site_id: this.userStore.getSiteId(),
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
