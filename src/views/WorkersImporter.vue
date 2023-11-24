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
import { type CreateWorkerCommand, useWorkerRepo } from "@/stores/WorkerRepo"

export type WorkersProps = {
  contractorId: string
}

const repo = useWorkerRepo()
const props = defineProps<WorkersProps>()

const columns: ImporterViewItemColumn<CreateWorkerCommand>[] = [
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

function importMehtod(item: CreateWorkerCommand) {
  return repo.create({
    ...item,
    contractor_id: props.contractorId,
    picture_file: {},
  })
}
</script>
