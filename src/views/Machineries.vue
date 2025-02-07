<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  type Machinery,
  type CreateMachineryCommand,
  useMachineryRepo,
  machineryTypes,
  type UpdateMachineryCommand,
} from "@/stores/MachineryRepo"

export type MachineriesProps = {
  contractorId: string
}

let currentEditingId: string | null = null
const licenseNo2Id = new Map<string, string>()
const repo = useMachineryRepo()
const props = defineProps<MachineriesProps>()
const fields: DynamicFormItemOption<UpdateMachineryCommand>[] = [
  {
    label: "車牌號碼",
    key: "license_no",
    inputProps: { type: "text" },
    rules: [
      { required: true, trigger: "blur", message: "車牌號碼必填" },
      {
        asyncValidator: async (_rule, value) => {
          const licenseNoMatchedMachineryId = licenseNo2Id.get(value)
          if (
            !licenseNoMatchedMachineryId ||
            licenseNoMatchedMachineryId === currentEditingId
          )
            return
          throw new Error("車牌號碼已存在")
        },
      },
    ],
  },
  {
    label: "機具名稱",
    key: "name",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "機具必填" },
  },
  {
    label: "機具類型",
    key: "machine_type",
    inputProps: {
      type: "select",
      selectProps: {
        options: machineryTypes.map((type) => ({
          label: type,
          value: type,
        })),
        filterable: true,
        tag: true,
      },
    },
  },
  {
    label: "操作人員",
    key: "driver",
    inputProps: { type: "text" },
  },
  {
    label: "操作人員聯絡電話",
    key: "driver_phone",
    inputProps: { type: "text" },
  },
]

const tableViewSetting: TableViewProps<
  Machinery,
  CreateMachineryCommand,
  UpdateMachineryCommand,
  {
    keyword?: string
    license_no?: string
    name?: string
    machine_type?: string
    driver?: string
  }
> = {
  columns: [
    {
      title: "機具類型",
      key: "machine_type",
    },
    {
      title: "機具名稱",
      key: "name",
    },
    {
      title: "車牌號碼",
      key: "license_no",
    },
    {
      title: "操作人員",
      key: "driver",
    },
    {
      title: "操作人員聯絡電話",
      key: "driver_phone",
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      machine_type: query.machine_type,
      contractor_id: props.contractorId,
      license_no: query.license_no,
      driver: query.driver,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  searchBarPlaceholder: "查詢機具類型、機具名稱、車牌號碼、操作人員",
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
      inputProps: {
        type: "text",
        inputProps: { placeholder: "機具類型、機具名稱、車牌號碼、操作人員" },
      },
      parser: (value: string) => value,
      stringify: (value: string) => value,
    },
    {
      key: "license_no",
      label: "車牌號碼",
      inputProps: { type: "text" },
      parser: (value: string) => value,
      stringify: (value: string) => value,
    },
    {
      key: "driver",
      label: "操作人員",
      inputProps: { type: "text" },
      parser: (value: string) => value,
      stringify: (value: string) => value,
    },
    {
      key: "machine_type",
      label: "機具類型",
      inputProps: {
        type: "select",
        selectProps: {
          options: machineryTypes.map((type) => ({
            label: type,
            value: type,
          })),
          filterable: true,
          tag: true,
          clearable: true,
        },
      },
      parser: (value: string) => value,
      stringify: (value: string) => value,
    },
  ],
  rowActions: [{ type: "editor" }, { type: "delete" }],
  creator: {
    fields: fields,
    modelBuilder: async () => {
      currentEditingId = null
      return {
        contractor_id: props.contractorId,
        name: "",
        machine_type: "",
        license_no: "",
        driver: "",
        driver_phone: "",
      }
    },
    beforeFormVaildation: async (model) => {
      const { items } = await repo.query({
        license_no: model.license_no,
      })
      items.forEach((item) => licenseNo2Id.set(item.license_no, item.id))
    },
    method: (model) => repo.create(model),
  },
  editor: {
    fields: fields,
    modelBuilder: async (item) => {
      currentEditingId = item.id
      return repo.get(item.id)
    },
    method: (command, item) => repo.update(item.id, command),
    beforeFormVaildation: async (model) => {
      const { items } = await repo.query({
        license_no: model.license_no,
      })
      items.forEach((item) => licenseNo2Id.set(item.license_no, item.id))
    },
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
