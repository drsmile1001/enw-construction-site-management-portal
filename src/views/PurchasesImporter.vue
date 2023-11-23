<template>
  <ImporterView
    default-sheet="進場記錄"
    :columns="columns"
    import-done-to="Purchases"
    :import-method="(item) => repo.create(item)"
  />
</template>

<script setup lang="ts">
import type { ImporterViewItemColumn } from "@/components/ImporterView.vue"
import {
  type CreatePurchaseCommand,
  usePurchaseRepo,
} from "@/stores/PurchaseRepo"

const repo = usePurchaseRepo()

const columns: ImporterViewItemColumn<CreatePurchaseCommand>[] = [
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
    title: "本次進場數量",
    parser: (value) => Number(value),
    checkers: [
      (value: number) => (Number.isNaN(value) ? "必須為數字" : true),
      (value: number) => (value <= 0 ? "必須大於0" : true),
    ],
  },
  {
    key: "accumulation",
    title: "累積進場數量",
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
]
</script>
