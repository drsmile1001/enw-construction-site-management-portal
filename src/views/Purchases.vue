<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Purchase,
  type SetPurchaseCommand,
  usePurchaseRepo,
} from "@/stores/MaterialRepo"
import { NTime } from "naive-ui"

const repo = usePurchaseRepo()
const fieldsOptions: DynamicFormItemOption<SetPurchaseCommand>[] = [
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

const tableViewSetting: TableViewProps<Purchase, SetPurchaseCommand, {}> = {
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
      render: (row) => h(NTime, { time: new Date(row.update_time) }),
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (keyword, skip, take) =>
    repo.query({
      keyword,
      skip,
      take,
    }),
  rowActions: [{ type: "delete" }],
  creator: {
    fields: fieldsOptions,
    modelBuilder: async () => ({
      site_id: "SITE_ID",
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
