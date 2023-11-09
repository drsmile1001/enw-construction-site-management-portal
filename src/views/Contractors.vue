<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  useContractorRepo,
  type Contractor,
  type SetContractorCommand,
} from "@/stores/ContractorRepo"

const repo = useContractorRepo()
const tableViewSetting: TableViewProps<
  Contractor,
  SetContractorCommand,
  SetContractorCommand
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
  rowKey: (row) => row.id,
  queryItems: (keyword, skip, take) =>
    repo.query({
      keyword,
      skip,
      take,
    }),
  rowActions: [
    {
      type: "nav",
      navToBuilder: (item) => ({
        name: "SiteContractorBasicInfo",
        params: { contractorId: item.id },
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
      tax_number: "",
      name: "",
      principal: "",
      phone: "",
      email: "",
    }),
    method: (model) => repo.create(model),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
