<template>
  <TableView :="tableViewSetting">
    <template #search-bar="{ search, query }">
      <NInputGroup>
        <NDatePicker
          :value="queryDate(query.date)"
          :first-day-of-week="6"
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
    <template #page-actions="{ query }">
      <NButton @click="() => exportList(query)">列表下載</NButton>
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
import {
  getName as contractorName,
  getReactiveName as reactiveContractorName,
} from "@/stores/ContractorRepo"
import { buildFetcher, exportXlsx } from "@/utilities/sheet"

const props = defineProps<{
  type: AttendanceType
}>()

const repo = useAttendanceRepo()

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
    render: (row) => reactiveContractorName(row.worker!.contractor_id).value,
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
    render: (row) => reactiveContractorName(row.machinery!.contractor_id).value,
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

async function exportList(query: { date?: number }) {
  console.log(query)

  const fetcher = buildFetcher((page) =>
    repo.query(
      new Date(query.date ? query.date : defaultQueryDate),
      page,
      props.type
    )
  )

  await exportXlsx({
    sheet: "出席記錄",
    outputFileName: "出席記錄.xlsx",
    fetcher: fetcher,
    columnOptions: [
      {
        name: "時間",
        selector: (a) => parseISO(a.date),
      },
      {
        name: "進出",
        selector: (a) => (a.is_attendance ? "進" : "出"),
      },
      {
        name: "工種",
        selector: (a) => a.worker?.job_title,
      },
      {
        name: "姓名",
        selector: (a) => a.worker?.name,
      },
      {
        name: "所屬單位",
        selector: (a) =>
          a.worker?.contractor_id
            ? contractorName(a.worker?.contractor_id)
            : "",
      },
    ],
  })
}
</script>
