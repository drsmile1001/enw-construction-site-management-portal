<template>
  <TableView
    :columns="columns"
    :row-key="rowKey"
    :query-items="queryInventory"
    :creator="creatorOption"
    :editor="editorOption"
    :row-actions="rowActions"
    :delete-method="deleteMethod"
  >
  </TableView>
</template>

<script setup lang="ts">
import type { TableColumns } from "naive-ui/es/data-table/src/interface"
import TableView, {
  type CreatorOptions,
  type EditorOptions,
  type RowActionOptions,
} from "./templates/TableView.vue"
import {
  type Inventory,
  queryInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from "@/stores/InventoryRepo"
import type { FormModalFieldOption } from "@/components/FormModal.vue"

const columns: TableColumns<Inventory> = [
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
]

const rowKey = (row: Inventory) => row.id
const rowActions: RowActionOptions<Inventory>[] = [
  { type: "editor" },
  { type: "delete" },
]

const fieldsOptions: FormModalFieldOption<Inventory>[] = [
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
    rules: { required: true, trigger: "blur", message: "名稱必填" },
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

const creatorOption: CreatorOptions<Inventory> = {
  fields: fieldsOptions,
  modelBuilder: async () => ({
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
}

const editorOption: EditorOptions<Inventory> = {
  fields: fieldsOptions,
  modelBuilder: async (item) => item,
  method: (item) => updateInventory(item.id, item),
}

function deleteMethod(item: Inventory) {
  return deleteInventory(item.id)
}
</script>
