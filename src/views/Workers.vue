<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Worker,
  type SetWorkerCommand,
  useWorkerRepo,
} from "@/stores/WorkerRepo"
export type WorkersProps = {
  contractorId: string
}

const repo = useWorkerRepo()
const props = defineProps<WorkersProps>()

const fields: DynamicFormItemOption<SetWorkerCommand>[] = [
  {
    label: "工號",
    key: "worker_no",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "工號必填" },
  },
  {
    label: "姓名",
    key: "name",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "姓名必填" },
  },
  {
    label: "職稱",
    key: "job_title",
    inputProps: { type: "text" },
  },
  {
    label: "照片",
    key: "picture_file",
    inputProps: { type: "text" },
  },
  {
    label: "身份證字號",
    key: "personal_id",
    inputProps: { type: "text" },
  },
]

const tableViewSetting: TableViewProps<
  Worker,
  SetWorkerCommand,
  SetWorkerCommand
> = {
  columns: [
    {
      title: "工號",
      key: "worker_no",
    },
    {
      title: "姓名",
      key: "name",
    },
    {
      title: "職稱",
      key: "job_title",
    },
    {
      title: "照片",
      key: "picture_file",
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (keyword, skip, take) =>
    repo.query({ contractor_id: props.contractorId, keyword, skip, take }),
  rowActions: [{ type: "editor" }, { type: "delete" }],
  creator: {
    fields: fields,
    modelBuilder: async () => ({
      worker_no: "",
      contractor_id: props.contractorId,
      name: "",
      job_title: "",
      picture_file: "",
      personal_id: "",
    }),
    method: (model) => repo.create(model),
  },
  editor: {
    fields: fields,
    modelBuilder: async (item) => repo.get(item.id),
    method: (command, item) => repo.update(item.id, command),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
