<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Inventory,
  type SetInventoryCommand,
  useInventoryRepo,
} from "@/stores/MaterialRepo"
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import { NTag, NTime } from "naive-ui"
import { ITEMS_PER_PAGE } from "@/environment"

const repo = useInventoryRepo()
const fieldsOptions: DynamicFormItemOption<SetInventoryCommand>[] = [
  {
    label: "位置",
    key: "location",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "位置必填" },
  },
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
    label: "數量",
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
  {
    label: "危險物標記",
    key: "tags",
    inputProps: {
      type: "select",
      selectProps: {
        options: [
          { label: "危險物", value: "危險物" },
          { label: "易燃物", value: "易燃物" },
          { label: "易爆物", value: "易爆物" },
          { label: "腐蝕性物", value: "腐蝕性物" },
          { label: "有毒物", value: "有毒物" },
          { label: "放射性物", value: "放射性物" },
          { label: "其他", value: "其他" },
        ],
        multiple: true,
      },
    },
  },
]

const tableViewSetting: TableViewProps<
  Inventory,
  SetInventoryCommand,
  SetInventoryCommand,
  {
    keyword?: string
  }
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
      title: "數量",
      key: "amount",
      render: (row) => h("span", {}, `${row.amount} ${row.unit}`),
    },
    {
      title: "供應商",
      key: "supplier",
    },
    {
      title: "危險物標記",
      key: "tags",
      render: (row) =>
        h(
          "div",
          {
            class: "flex gap-2",
          },
          row.tags.map((tag) => h(NTag, {}, () => tag))
        ),
    },
    {
      title: "資料更新時間",
      key: "update_time",
      render: (row) => h(NTime, { time: new Date(row.update_time) }),
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
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
    method: (model) => repo.create(model),
  },
  editor: {
    fields: fieldsOptions,
    modelBuilder: async (item) => item,
    method: (model, item) => repo.update(item.id, model),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
