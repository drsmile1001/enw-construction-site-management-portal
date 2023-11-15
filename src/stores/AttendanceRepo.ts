import { ITEMS_PER_PAGE, env } from "@/environment"
import { type Worker, useWorkerRepo } from "@/stores/WorkerRepo"
import { buildParms } from "@/utilities/ky"
import type { QueryResult } from "@/utilities/repo"
import ky from "ky"

export type Attendance = {
  site_id: string
  type: "worker"
  content: {} //TODO: 確認出席記錄中內文的型別
  is_attendance: boolean
  resource_id: string
  date: string
  picture_file: {} //TODO: 確認出席記錄中圖片的型別
  worker: Worker
}

export type AttendanceQuery = {
  date: Date
}

export interface AttendanceRepo {
  queryWorkerAttendance(
    date: Date,
    page: number
  ): Promise<QueryResult<Attendance>>
}

class HttpAttendanceRepo implements AttendanceRepo {
  api = ky.create({
    prefixUrl: `${env.DOORMAN_URL}api/construction-site/`,
  })
  async queryWorkerAttendance(
    date: Date,
    page: number
  ): Promise<QueryResult<Attendance>> {
    const records = await this.api
      .get(`${env.SITE_ID}/worker/attendance/`, {
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
  async queryWorkerAttendance(
    date: Date,
    page: number
  ): Promise<QueryResult<Attendance>> {
    const workerRepo = useWorkerRepo()
    const workers = await workerRepo.query({})
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
