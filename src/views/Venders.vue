<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "./templates/TableView.vue"
import {
  type Vender,
  type CreateVenderCommand,
  queryVenders,
  createVender,
  updateVender,
  deleteVender,
  type UpdateVenderCommand,
} from "@/stores/VenderRepo"
import type { FormModalFieldOption } from "@/components/FormModal.vue"

const tableViewSetting: TableViewProps<
  Vender,
  CreateVenderCommand,
  UpdateVenderCommand
> = {
  columns: [
    {
      title: "統一編號",
      key: "tax_number",
    },
    {
      title: "名稱",
      key: "name",
    },
    {
      title: "負責人",
      key: "principal",
    },
    {
      title: "電話",
      key: "phone",
    },
    {
      title: "電子信箱",
      key: "email",
    },
  ],
  rowKey: (row) => row.tax_number,
  queryItems: queryVenders,
  rowActions: [{ type: "editor" }, { type: "delete" }],
  creator: {
    fields: [
      {
        label: "統一編號",
        key: "tax_number",
        type: "text",
        rules: { required: true, trigger: "blur", message: "統一編號必填" },
      },
      {
        label: "名稱",
        key: "name",
        type: "text",
        rules: { required: true, trigger: "blur", message: "名稱必填" },
      },
      {
        label: "負責人",
        key: "principal",
        type: "text",
      },
      {
        label: "電話",
        key: "phone",
        type: "text",
      },
      {
        label: "電子信箱",
        key: "email",
        type: "text",
      },
    ],
    modelBuilder: async () => ({
      site_id: "SITE_ID",
      tax_number: "",
      name: "",
      principal: "",
      phone: "",
      email: "",
    }),
    method: createVender,
  },
  editor: {
    fields: [
      {
        label: "名稱",
        key: "name",
        type: "text",
        rules: { required: true, trigger: "blur", message: "名稱必填" },
      },
      {
        label: "負責人",
        key: "principal",
        type: "text",
      },
      {
        label: "電話",
        key: "phone",
        type: "text",
      },
      {
        label: "電子信箱",
        key: "email",
        type: "text",
      },
    ],
    modelBuilder: async (item) => item,
    method: (model, item) => updateVender(item.tax_number, model),
    titleBuilder: (item) => item.tax_number,
  },
  deleteMethod: (item) => deleteVender(item.tax_number),
}
</script>
