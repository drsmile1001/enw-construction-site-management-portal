<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { type Attendance, useAttendanceRepo } from "@/stores/AttendanceRepo"
import { NTime } from "naive-ui"

const repo = useAttendanceRepo()

const tableViewSetting: TableViewProps<
  Attendance,
  {},
  {},
  {
    date?: Date
  }
> = {
  columns: [
    {
      key: "date",
      title: "時間",
      render: (row) => h(NTime, { time: new Date(row.date) }),
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
  rowKey: (row) => row.date,
  queryItems: (query, page) => repo.query(query.date ?? new Date(), page),
  queryFields: [],
}
</script>
