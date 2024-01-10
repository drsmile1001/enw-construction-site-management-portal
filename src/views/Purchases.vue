<template>
  <TableView :="tableViewSetting" />
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  type Purchase,
  type CreatePurchaseCommand,
  usePurchaseRepo,
} from "@/stores/PurchaseRepo"
import { NTime } from "naive-ui"
import { parseISO, parse, format } from "date-fns"

const repo = usePurchaseRepo()
const fieldsOptions: DynamicFormItemOption<CreatePurchaseCommand>[] = [
  {
    label: "名稱",
    key: "name",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "名稱必填" },
  },
  {
    label: "單位",
    key: "unit",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "單位必填" },
  },
  {
    label: "本次進場數量",
    key: "amount",
    inputProps: { type: "number" },
    rules: { required: true },
  },
  {
    key: "accumulation",
    label: "累積進場數量",
    inputProps: { type: "number" },
    rules: { required: true },
  },
  {
    label: "供應商",
    key: "supplier",
    inputProps: { type: "text" },
  },
  {
    label: "描述",
    key: "description",
    inputProps: { type: "text" },
  },
]

const tableViewSetting: TableViewProps<
  Purchase,
  CreatePurchaseCommand,
  {},
  {
    range?: [number, number] | null
    supplier?: string
    keyword?: string
  }
> = {
  columns: [
    {
      title: "名稱",
      key: "name",
    },
    {
      title: "供應商",
      key: "supplier",
    },
    {
      title: "單位",
      key: "unit",
    },
    {
      title: "本次進場數量",
      key: "amount",
    },
    {
      title: "累積進場數量",
      key: "accumulation",
    },
    {
      title: "資料更新時間",
      key: "update_time",
      render: (row) => h(NTime, { time: parseISO(row.update_time) }),
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      supplier: query.supplier,
      since: query.range?.[0] ? new Date(query.range[0]) : undefined,
      until: query.range?.[1] ? new Date(query.range[1]) : undefined,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  searchBarPlaceholder: "查詢名稱",
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
      inputProps: { type: "text", inputProps: { placeholder: "名稱" } },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      key: "supplier",
      label: "供應商",
      inputProps: { type: "text" },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      key: "range", //TODO: 抽成共用物件
      label: "起訖",
      inputProps: {
        type: "date",
        dateProps: {
          type: "daterange",
          clearable: true,
        },
      },
      parser: (value) => {
        if (!value) return null
        value
        const result = value
          .split("~")
          .map((p) => parse(p, "yyyy-MM-dd", new Date()).valueOf())
        if (result.length !== 2) throw new Error("日期格式錯誤")
        if (result.some((r) => isNaN(r))) throw new Error("日期格式錯誤")
        return result
      },
      stringify: (value: [number, number] | null) =>
        value
          ? value.map((v) => format(new Date(v), "yyyy-MM-dd")).join("~")
          : "",
    },
  ],
  rowActions: [{ type: "delete" }],
  creator: {
    fields: fieldsOptions,
    modelBuilder: async () => ({
      id: "",
      name: "",
      description: "",
      supplier: "",
      amount: 0,
      unit: "",
      accumulation: 0,
    }),
    method: (model) => repo.create(model),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
