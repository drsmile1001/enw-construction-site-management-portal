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

const existedWorkerNos = new Set<string>()
const columns: ImporterViewItemColumn<ModifyWorkerCommand>[] = [
  {
    key: "worker_no",
    title: "工號",
    parser: (value) => value?.toString().trim(),
    checkers: [
      (value) => (!value ? "必填" : true),
      async (value) => {
        if (existedWorkerNos.has(value)) return "工號重複"
        const { total } = await repo.query({
          worker_no: value,
          take: 1,
        })
        if (total > 0) {
          existedWorkerNos.add(value)
          return "工號重複"
        }
        return true
      },
    ],
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
