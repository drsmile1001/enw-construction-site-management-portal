<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Vender,
  type CreateVenderCommand,
  queryVenders,
  createVender,
  updateVender,
  deleteVender,
  type UpdateVenderCommand,
} from "@/stores/VenderRepo"

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
  rowActions: [
    {
      type: "nav",
      navToBuilder: (item) => ({
        name: "SiteVendorBasicInfo",
        params: { vendorId: item.tax_number },
      }),
      title: "詳細",
    },
    { type: "delete" },
  ],
  creator: {
    fields: [
      {
        label: "統一編號",
        key: "tax_number",
        inputProps: { type: "text" },
        rules: { required: true, trigger: "blur", message: "統一編號必填" },
      },
      {
        label: "名稱",
        key: "name",
        inputProps: { type: "text" },
        rules: { required: true, trigger: "blur", message: "名稱必填" },
      },
      {
        label: "負責人",
        key: "principal",
        inputProps: { type: "text" },
      },
      {
        label: "電話",
        key: "phone",
        inputProps: { type: "text" },
      },
      {
        label: "電子信箱",
        key: "email",
        inputProps: { type: "text" },
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
  deleteMethod: (item) => deleteVender(item.tax_number),
}
</script>
