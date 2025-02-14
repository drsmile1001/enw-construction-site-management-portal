<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Inventory,
  type ModifyInventoryCommand,
  useInventoryRepo,
  dangerTags,
} from "@/stores/InventoryRepo"
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import { NTag, NTime } from "naive-ui"
import { ITEMS_PER_PAGE } from "@/environment"
import { parseISO } from "date-fns"

const repo = useInventoryRepo()
const fieldsOptions: DynamicFormItemOption<ModifyInventoryCommand>[] = [
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
        options: dangerTags.map((tag) => ({ label: tag, value: tag })),
        multiple: true,
      },
    },
  },
]

const tableViewSetting: TableViewProps<
  Inventory,
  ModifyInventoryCommand,
  ModifyInventoryCommand,
  {
    keyword?: string
    location?: string
    supplier?: string
    tags?: string[]
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
      render: (row) => h(NTime, { time: parseISO(row.update_time) }),
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      location: query.location,
      supplier: query.supplier,
      tags: query.tags,
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
      key: "location",
      label: "位置",
      inputProps: { type: "text" },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      label: "危險物標記",
      key: "tags",
      inputProps: {
        type: "select",
        selectProps: {
          options: dangerTags.map((tag) => ({ label: tag, value: tag })),
          multiple: true,
        },
      },
      parser: (value) => (value ? value.split(",") : null),
      stringify: (value: string[] | null) => (value ? value.join(",") : ""),
    },
  ],
  rowActions: [{ type: "editor" }],
  creator: {
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
    method: (model) => repo.create(model),
  },
  editor: {
    fields: fieldsOptions,
    modelBuilder: async (item) => repo.get(item.id),
    method: (model, item) => repo.update(item.id, model),
  },
}
</script>
