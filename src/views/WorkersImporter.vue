<template>
  <ImporterView
    default-sheet="員工清冊"
    :columns="columns"
    import-done-to="Workers"
    :import-method="importMehtod"
  />
</template>

<script setup lang="ts">
import type { ImporterViewItemColumn } from "@/components/ImporterView.vue"
import { type ModifyWorkerCommand, useWorkerRepo } from "@/stores/WorkerRepo"

const repo = useWorkerRepo()
const props = defineProps<{
  contractorId: string
}>()

const columns: ImporterViewItemColumn<ModifyWorkerCommand>[] = [
  {
    key: "worker_no",
    title: "工號",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "name",
    title: "姓名",
    parser: (value) => value?.toString().trim(),
    checkers: (value) => (!value ? "必填" : true),
  },
  {
    key: "job_title",
    title: "職稱",
    parser: (value) => value?.toString().trim() ?? "",
  },
  {
    key: "personal_id",
    title: "身分證字號",
    parser: (value) => value?.toString().trim() ?? "",
  },
]

function importMehtod(item: ModifyWorkerCommand) {
  return repo.create({
    ...item,
    contractor_id: props.contractorId,
    picture_file: {},
  })
}
</script>
