<template>
  <TableView :="tableViewSetting">
    <template #search-bar="{ search, query }">
      <NInputGroup>
        <NDatePicker
          :value="queryDate(query.date)"
          @update:value="(v) => (newQueryDate = v)"
        />
        <NButton
          type="primary"
          @click="
            () =>
              search({
                date: queryDate(query.date),
              })
          "
          >搜尋</NButton
        >
      </NInputGroup>
    </template>
  </TableView>
</template>

<script setup lang="ts">
import TableView, {
  type TableViewColumn,
  type TableViewProps,
} from "@/components/TableView.vue"
import {
  type Attendance,
  useAttendanceRepo,
  type AttendanceType,
} from "@/stores/AttendanceRepo"
import { NTime } from "naive-ui"
import { startOfDay, parseISO } from "date-fns"
import { useEntityNameCache } from "@/stores/EntityNameCache"
import { ensureContractorNameCached } from "@/stores/ContractorRepo"

const props = defineProps<{
  type: AttendanceType
}>()

const repo = useAttendanceRepo()
const nameCache = useEntityNameCache()

const defaultQueryDate = startOfDay(new Date()).valueOf()
const newQueryDate = ref<number>()
function queryDate(parsedQueryDate: number | undefined) {
  return newQueryDate.value ?? parsedQueryDate ?? defaultQueryDate
}

const workerColumns: TableViewColumn<Attendance>[] = [
  {
    key: "date",
    title: "時間",
    render: (row) => h(NTime, { time: parseISO(row.date) }),
  },
  {
    title: "進出",
    key: "is_attendance",
    render: (row) => (row.is_attendance ? "進" : "出"),
  },
  {
    title: "工種",
    key: "worker_job_title" as keyof Attendance,
    render: (row) => row.worker!.job_title,
  },
  {
    title: "姓名",
    key: "worker_name" as keyof Attendance,
    render: (row) => row.worker!.name,
  },
  {
    title: "服裝檢查",
    key: "content",
    render: (row) => JSON.stringify(row.content),
  },
  {
    title: "所屬單位",
    key: "worker_contractor_id" as keyof Attendance,
    render: (row) =>
      nameCache.get(ensureContractorNameCached(row.worker!.contractor_id)) ??
      "-",
  },
]

const machineryColumns: TableViewColumn<Attendance>[] = [
  {
    key: "date",
    title: "時間",
    render: (row) => h(NTime, { time: parseISO(row.date) }),
  },
  {
    title: "進出",
    key: "is_attendance",
    render: (row) => (row.is_attendance ? "進" : "出"),
  },
  {
    title: "類型",
    key: "machinery_machine_type" as keyof Attendance,
    render: (row) => row.machinery!.machine_type,
  },
  {
    title: "車牌號碼",
    key: "machinery_license_no" as keyof Attendance,
    render: (row) => row.machinery!.license_no,
  },
  {
    title: "所屬單位",
    key: "machinery_contractor_id" as keyof Attendance,
    render: (row) =>
      nameCache.get(ensureContractorNameCached(row.machinery!.contractor_id)) ??
      "-",
  },
]

const tableViewSetting: TableViewProps<
  Attendance,
  {},
  {},
  {
    date?: number
  }
> = {
  columns: props.type === "worker" ? workerColumns : machineryColumns,
  rowKey: (row) => row.date.valueOf(),
  queryItems: (query, page) =>
    repo.query(
      new Date(query.date ? query.date : defaultQueryDate),
      page,
      props.type
    ),
  queryFields: [
    {
      key: "date",
      label: "時間",
      inputProps: {
        type: "text",
      },
      parser: (value) => Number(value),
      stringify: (value) => (value as number).toString(),
    },
  ],
}
</script>
