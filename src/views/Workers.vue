<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { NImage } from "naive-ui"
import {
  type Worker,
  type CreateWorkerCommand,
  type UpdateWorkerCommand,
  useWorkerRepo,
} from "@/stores/WorkerRepo"
import { useFileRepo } from "@/stores/FileRepo"
import { ITEMS_PER_PAGE } from "@/environment"
export type WorkersProps = {
  contractorId: string
}

const repo = useWorkerRepo()
const props = defineProps<WorkersProps>()
const fileRepo = useFileRepo()

const workerPictureCollection = `contractor_${props.contractorId}_workers`
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
    {
      title: "照片",
      key: "picture_file",
      render: (row) =>
        row.picture_file.value
          ? h(NImage, {
              width: 100,
              src: fileRepo.buildFileUrl(
                workerPictureCollection,
                row.picture_file.value as string
              ),
              objectFit: "cover",
            })
          : h("div"),
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
        label: "照片",
        key: "picture_file",
        inputProps: {
          type: "file",
          fileProps: {
            collection: workerPictureCollection,
            uploadProps: {
              max: 1,
              multiple: false,
              listType: "image-card",
            },
          },
        },
      },
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
    fields: commonFields,
    modelBuilder: async (item) => repo.get(item.id),
    method: (command, item) => repo.update(item.id, command),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
