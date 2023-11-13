<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  type Machinery,
  type SetMachineryCommand,
  useMachineryRepo,
  machineryTypes,
} from "@/stores/MachineryRepo"

export type MachineriesProps = {
  contractorId: string
}

const repo = useMachineryRepo()
const props = defineProps<MachineriesProps>()
const fields: DynamicFormItemOption<SetMachineryCommand>[] = [
  {
    label: "車牌號碼",
    key: "license_no",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "車牌號碼必填" },
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
  SetMachineryCommand,
  SetMachineryCommand,
  {
    keyword?: string
    machine_type?: string
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
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  queryFields: [
    {
      key: "keyword",
      label: "關鍵字",
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
    modelBuilder: async () => ({
      contractor_id: props.contractorId,
      name: "",
      machine_type: "",
      license_no: "",
      driver: "",
      driver_phone: "",
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
