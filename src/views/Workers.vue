<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Worker,
  type ModifyWorkerCommand,
  useWorkerRepo,
} from "@/stores/WorkerRepo"
import { ITEMS_PER_PAGE } from "@/environment"

const repo = useWorkerRepo()
const props = defineProps<{
  contractorId: string
}>()

let currentEditingId: string | null = null
const workerNo2Id = new Map<string, string>()
const commonFields: DynamicFormItemOption<ModifyWorkerCommand>[] = [
  {
    label: "工號",
    key: "worker_no",
    inputProps: { type: "text" },
    rules: [
      { required: true, trigger: "blur", message: "工號必填" },
      {
        asyncValidator: async (_rule, value) => {
          const workerNoMatchedWorkerId = workerNo2Id.get(value)
          if (
            !workerNoMatchedWorkerId ||
            workerNoMatchedWorkerId === currentEditingId
          )
            return
          throw new Error("工號已存在")
        },
      },
    ],
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
    label: "身份證字號",
    key: "personal_id",
    inputProps: { type: "text" },
  },
]

const tableViewSetting: TableViewProps<
  Worker,
  ModifyWorkerCommand,
  ModifyWorkerCommand,
  {
    keyword?: string
    job_title?: string
    worker_no?: string
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
      worker_no: query.worker_no,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  searchBarPlaceholder: "查詢工號、姓名、職稱",
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
      inputProps: {
        type: "text",
        inputProps: { placeholder: "工號、姓名、職稱" },
      },
      parser: (value) => value,
      stringify: (value) => value,
    },
    {
      key: "worker_no",
      label: "工號",
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
    fields: commonFields,
    modelBuilder: async () => {
      currentEditingId = null
      return <ModifyWorkerCommand>{
        worker_no: "",
        contractor_id: props.contractorId,
        name: "",
        job_title: "",
        picture_file: {
          value: null,
        },
        personal_id: "",
      }
    },
    beforeFormVaildation: async (model) => {
      const { items } = await repo.query({
        worker_no: model.worker_no,
      })
      items.forEach((item) => workerNo2Id.set(item.worker_no, item.id))
    },
    method: (model) => repo.create(model),
  },
  editor: {
    fields: commonFields,
    modelBuilder: async (item) => {
      currentEditingId = item.id
      return repo.get(item.id)
    },
    method: (command, item) => repo.update(item.id, command),
    beforeFormVaildation: async (model) => {
      const { items } = await repo.query({
        worker_no: model.worker_no,
      })
      items.forEach((item) => workerNo2Id.set(item.worker_no, item.id))
    },
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
