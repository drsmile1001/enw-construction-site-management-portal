<template>
  <TableView :="tableViewSetting" />
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { NTime } from "naive-ui"
import { parseISO, parse, format } from "date-fns"
import {
  useSafetyEventRepo,
  type SafetyEvent,
  safetyAlarmSettings,
} from "@/stores/SafetyEventRepo"
import { ITEMS_PER_PAGE } from "@/environment"

const props = defineProps<{
  category: string
}>()

const repo = useSafetyEventRepo()
const baseAlarmTypes = safetyAlarmSettings.find(
  (s) => s.id === props.category
)!.types

const tableViewSetting: TableViewProps<
  SafetyEvent,
  {},
  {},
  {
    keyword?: string
    range?: [number, number]
    alarm_type?: string[]
  }
> = {
  columns: [
    {
      key: "date",
      title: "時間",
      render: (row) => h(NTime, { time: parseISO(row.date) }),
    },
    {
      key: "alarm_type",
      title: "類型",
    },
    {
      key: "description",
      title: "描述",
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      alarm_types: baseAlarmTypes.filter(
        (t) => query.alarm_type?.includes(t) ?? true
      ),
      range: query.range,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  searchBarPlaceholder: "查詢描述",
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
      inputProps: { type: "text", inputProps: { placeholder: "描述" } },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      key: "range", //TODO: 抽成共用物件
      label: "起訖",
      inputProps: {
        type: "date",
        dateProps: {
          type: "datetimerange",
          clearable: true,
        },
      },
      parser: (value) => {
        if (!value) return null
        value
        const result = value
          .split("~")
          .map((p) => parse(p, "yyyyMMddHHmm", new Date()).valueOf())
        if (result.length !== 2) throw new Error("時間格式錯誤")
        if (result.some((r) => isNaN(r))) throw new Error("時間格式錯誤")
        return result
      },
      stringify: (value: [number, number] | null) =>
        value
          ? value.map((v) => format(new Date(v), "yyyyMMddHHmm")).join("~")
          : "",
    },
  ],
}
</script>
