<template>
  <TableView :="tableViewSetting">
    <template #page-actions="{ query }">
      <NButton @click="() => exportList(query)">列表下載</NButton>
    </template>
  </TableView>
</template>

<script setup lang="ts">
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  useContractorRepo,
  type Contractor,
  type SetContractorCommand,
} from "@/stores/ContractorRepo"
import { buildFetcher, exportXlsx } from "@/utilities/sheet"

const registedTaxNumbers = new Set<string>()
const repo = useContractorRepo()

type ContractorPageQuery = {
  keyword?: string
}

const tableViewSetting: TableViewProps<
  Contractor,
  SetContractorCommand,
  SetContractorCommand,
  ContractorPageQuery
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
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  searchBarPlaceholder: "查詢名稱",
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
        rules: [
          { required: true, trigger: "blur", message: "統一編號必填" },
          {
            asyncValidator: async (_rule, value) => {
              if (!value) {
                return
              }

              if (!registedTaxNumbers.has(value)) {
                return
              }
              throw new Error("統一編號已存在")
            },
          },
        ],
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
    beforeFormVaildation: async (model) => {
      const { items } = await repo.query({
        tax_number: model.tax_number,
      })
      items.forEach((item) => registedTaxNumbers.add(item.tax_number))
    },
    method: (model) => repo.create(model),
  },
  deleteMethod: (item) => repo.delete(item.id),
}

async function exportList(query: ContractorPageQuery) {
  await exportXlsx({
    sheet: "廠商清冊",
    outputFileName: "廠商清冊.xlsx",
    fetcher: buildFetcher((page) =>
      repo.query({
        keyword: query.keyword,
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      })
    ),
    columnOptions: [
      {
        name: "統一編號",
        selector: "tax_number",
      },
      {
        name: "名稱",
        selector: "name",
      },
      {
        name: "負責人",
        selector: "principal",
      },
      {
        name: "電話",
        selector: "phone",
      },
      {
        name: "電子信箱",
        selector: "email",
      },
    ],
  })
}
</script>
