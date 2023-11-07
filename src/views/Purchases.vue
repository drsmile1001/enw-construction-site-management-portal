<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "./templates/TableView.vue"
import {
  type Purchase,
  queryPurchases,
  createPurchase,
  deletePurchase,
  type SetPurchaseCommand,
} from "@/stores/MaterialRepo"
import type { FormModalFieldOption } from "@/components/FormModal.vue"
import { NTime } from "naive-ui"

const fieldsOptions: FormModalFieldOption<SetPurchaseCommand>[] = [
  {
    label: "名稱",
    key: "name",
    type: "text",
    rules: { required: true, trigger: "blur", message: "名稱必填" },
  },
  {
    label: "單位",
    key: "unit",
    type: "text",
    rules: { required: true, trigger: "blur", message: "單位必填" },
  },
  {
    label: "本次進場數量",
    key: "amount",
    type: "number",
    rules: { required: true },
  },
  {
    label: "供應商",
    key: "supplier",
    type: "text",
  },
  {
    label: "描述",
    key: "description",
    type: "text",
  },
]

const tableViewSetting: TableViewProps<Purchase, SetPurchaseCommand, any> = {
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
  queryItems: queryPurchases,
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
    method: createPurchase,
  },
  deleteMethod: (item) => deletePurchase(item.id),
}
</script>
