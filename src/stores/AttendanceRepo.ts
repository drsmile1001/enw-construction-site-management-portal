import { type Worker, useWorkerRepo } from "@/stores/WorkerRepo"

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
  get(date: Date): Promise<Attendance[]>
}

class FakeAttendanceRepo implements AttendanceRepo {
  async get(date: Date): Promise<Attendance[]> {
    const workerRepo = useWorkerRepo()
    const workers = await workerRepo.query({})
    return workers.items.map(
      (w) =>
        <Attendance>{
          site_id: "1",
          type: "worker",
          content: {},
          is_attendance: true,
          resource_id: w.id,
          date: date.toISOString(),
          picture_file: {},
          worker: w,
        }
    )
  }
}

let attendanceRepo: AttendanceRepo | null = null

export function useAttendanceRepo(): AttendanceRepo {
  if (attendanceRepo) return attendanceRepo
  attendanceRepo = new FakeAttendanceRepo()
  return attendanceRepo
}
