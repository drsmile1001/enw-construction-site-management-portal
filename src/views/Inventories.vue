<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "./templates/TableView.vue"
import {
  type Inventory,
  type SetInventoryCommand,
  queryInventories,
  createInventory,
  updateInventory,
  deleteInventory,
} from "@/stores/MaterialRepo"
import type { FormModalFieldOption } from "@/components/FormModal.vue"
import { NTime } from "naive-ui"

const fieldsOptions: FormModalFieldOption<SetInventoryCommand>[] = [
  {
    label: "位置",
    key: "location",
    type: "text",
    rules: { required: true, trigger: "blur", message: "位置必填" },
  },
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
    label: "數量",
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
  {
    label: "標籤",
    key: "tags",
    type: "text",
  },
]

const tableViewSetting: TableViewProps<
  Inventory,
  SetInventoryCommand,
  SetInventoryCommand
> = {
  columns: [
    {
      title: "位置",
      key: "location",
    },
    {
      title: "名稱",
      key: "name",
    },
    {
      title: "單位",
      key: "unit",
    },
    {
      title: "數量",
      key: "amount",
    },
    {
      title: "供應商",
      key: "supplier",
    },
    {
      title: "資料更新時間",
      key: "update_time",
      render: (row) => h(NTime, { time: new Date(row.update_time) }),
    },
  ],
  rowKey: (row) => row.id,
  queryItems: queryInventories,
  rowActions: [{ type: "editor" }, { type: "delete" }],
  creator: {
    fields: fieldsOptions,
    modelBuilder: async () => ({
      site_id: "SITE_ID",
      id: "",
      location: "",
      name: "",
      unit: "",
      amount: 0,
      supplier: "",
      description: "",
      tags: [],
    }),
    method: createInventory,
  },
  editor: {
    fields: fieldsOptions,
    modelBuilder: async (item) => item,
    method: (model, item) => updateInventory(item.id, model),
  },
  deleteMethod: (item) => deleteInventory(item.id),
}
</script>
