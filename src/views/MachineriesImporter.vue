<template>
  <ImporterView
    default-sheet="車輛清冊"
    :columns="columns"
    import-done-to="Machineries"
    :import-method="importMehtod"
  />
</template>

<script setup lang="ts">
import type { ImporterViewItemColumn } from "@/components/ImporterView.vue"
import {
  type CreateMachineryCommand,
  useMachineryRepo,
  machineryTypes,
} from "@/stores/MachineryRepo"

const repo = useMachineryRepo()
const props = defineProps<{
  contractorId: string
}>()

const columns: ImporterViewItemColumn<CreateMachineryCommand>[] = [
  {
    key: "license_no",
    title: "車牌號碼",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "name",
    title: "機具名稱",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "machine_type",
    title: "機具類型",
    parser: (value) => value?.toString().trim(),
    checkers: (value) =>
      !!value && !machineryTypes.includes(value) ? "未知的機具類型" : true,
  },
  {
    key: "driver",
    title: "操作人員",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "driver_phone",
    title: "操作人員聯絡電話",
    parser: (value) => value?.toString().trim() ?? "",
  },
]

function importMehtod(item: CreateMachineryCommand) {
  return repo.create({
    ...item,
    contractor_id: props.contractorId,
  })
}
</script>
