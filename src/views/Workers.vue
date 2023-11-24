<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Worker,
  type CreateWorkerCommand,
  type UpdateWorkerCommand,
  useWorkerRepo,
} from "@/stores/WorkerRepo"
import { ITEMS_PER_PAGE } from "@/environment"

const repo = useWorkerRepo()
const props = defineProps<{
  contractorId: string
}>()

const commonFields: DynamicFormItemOption<UpdateWorkerCommand>[] = [
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
]

const tableViewSetting: TableViewProps<
  Worker,
  CreateWorkerCommand,
  UpdateWorkerCommand,
  {
    keyword?: string
    job_title?: string
  }
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
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      contractor_id: props.contractorId,
      keyword: query.keyword,
      job_title: query.job_title,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
      inputProps: { type: "text" },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      key: "job_title",
      label: "職稱",
      inputProps: { type: "text" },
      parser: (value) => value,
      stringify: (value) => value,
    },
  ],
  rowActions: [{ type: "editor" }, { type: "delete" }],
  creator: {
    fields: [
      ...commonFields,
      {
        label: "身份證字號",
        key: "personal_id",
        inputProps: { type: "text" },
      },
    ],
    modelBuilder: async () =>
      <CreateWorkerCommand>{
        worker_no: "",
        contractor_id: props.contractorId,
        name: "",
        job_title: "",
        picture_file: {
          value: null,
        },
        personal_id: "",
      },
    method: (model) => repo.create(model),
  },
  editor: {
    fields: [
      ...commonFields,
      {
        key: "personal_id" as keyof UpdateWorkerCommand,
        label: "身份證字號",
        inputProps: {
          render: (value) => h("div", value),
        },
      },
    ],
    modelBuilder: async (item) => repo.get(item.id),
    method: (command, item) => repo.update(item.id, command),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
