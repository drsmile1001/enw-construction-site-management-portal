<template>
  <ImporterView
    default-sheet="資材庫存"
    :columns="columns"
    import-done-to="Inventories"
    :import-method="(item) => repo.create(item)"
  />
</template>

<script setup lang="ts">
import type { ImporterViewItemColumn } from "@/components/ImporterView.vue"
import {
  type CreateInventoryCommand,
  useInventoryRepo,
  dangerTags,
} from "@/stores/InventoryRepo"
import { NTag } from "naive-ui"

const repo = useInventoryRepo()

const columns: ImporterViewItemColumn<CreateInventoryCommand>[] = [
  {
    key: "location",
    title: "位置",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "name",
    title: "名稱",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "unit",
    title: "單位",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "amount",
    title: "數量",
    parser: (value) => Number(value),
    checkers: [
      (value: number) => (Number.isNaN(value) ? "必須為數字" : true),
      (value: number) => (value <= 0 ? "必須大於0" : true),
    ],
  },
  {
    key: "supplier",
    title: "供應商",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "description",
    title: "描述",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "tags",
    title: "危險物標記",
    parser: (value) =>
      value
        ?.toString()
        .split(",")
        .map((t) => t.trim()) ?? [],
    checkers: (value: string[]) => {
      if (value.some((t) => !dangerTags.includes(t)))
        return `必須是${dangerTags.join(",")}，且以','分隔`
      return true
    },
    render: (row) =>
      h(
        "div",
        {
          class: "flex gap-2",
        },
        row.tags.map((tag) => h(NTag, {}, () => tag))
      ),
  },
]
</script>
