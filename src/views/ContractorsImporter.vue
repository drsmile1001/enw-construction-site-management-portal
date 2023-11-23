<template>
  <ImporterView
    default-sheet="廠商清冊"
    :columns="columns"
    import-done-to="Contractors"
    :import-method="(item) => repo.create(item)"
  />
</template>

<script setup lang="ts">
import type { ImporterViewItemColumn } from "@/components/ImporterView.vue"
import {
  type SetContractorCommand,
  useContractorRepo,
} from "@/stores/ContractorRepo"

const repo = useContractorRepo()

const columns: ImporterViewItemColumn<SetContractorCommand>[] = [
  {
    key: "tax_number",
    title: "統一編號",
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
    key: "principal",
    title: "負責人",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "phone",
    title: "電話",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "email",
    title: "電子郵件",
    parser: (value) => value?.toString().trim() ?? "",
  },
]
</script>
