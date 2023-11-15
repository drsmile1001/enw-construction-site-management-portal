<template>
  <TableView :="tableViewSetting">
    <template #search-bar="{ search, query }">
      <NInputGroup>
        <NDatePicker
          :value="queryDate ?? query.date ?? defaultQueryDate"
          @update:value="(v) => (queryDate = v)"
        />
        <NButton
          type="primary"
          @click="
            () =>
              search({
                date: queryDate,
              })
          "
          >搜尋</NButton
        >
      </NInputGroup>
    </template>
  </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { type Attendance, useAttendanceRepo } from "@/stores/AttendanceRepo"
import { NTime } from "naive-ui"
import { startOfDay, parseISO } from "date-fns"

const repo = useAttendanceRepo()

const defaultQueryDate = startOfDay(new Date()).valueOf()
const queryDate = ref<number>()

const tableViewSetting: TableViewProps<
  Attendance,
  {},
  {},
  {
    date?: number
  }
> = {
  columns: [
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
      title: "人員",
      key: "worker",
      render: (row) => row.worker.name,
    },
    {
      title: "照片",
      key: "picture_file",
      render: (_row) => "TODO",
    },
  ],
  rowKey: (row) => row.date.valueOf(),
  queryItems: (query, page) =>
    repo.queryWorkerAttendance(
      new Date(query.date ? query.date : defaultQueryDate),
      page
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
