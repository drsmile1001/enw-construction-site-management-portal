import { ITEMS_PER_PAGE, env } from "@/environment"
import { type Worker, useWorkerRepo } from "@/stores/WorkerRepo"
import type { QueryResult } from "@/utilities/repo"

export type Attendance = {
  site_id: string
  type: "worker"
  content: {}
  is_attendance: boolean
  resource_id: string
  date: string
  picture_file: {}
  worker: Worker
}

export type AttendanceQuery = {
  date: string
}

export interface AttendanceRepo {
  query(date: Date, page: number): Promise<QueryResult<Attendance>>
}

class FakeAttendanceRepo implements AttendanceRepo {
  async query(date: Date, page: number): Promise<QueryResult<Attendance>> {
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
  attendanceRepo = new FakeAttendanceRepo()
  return attendanceRepo
}
