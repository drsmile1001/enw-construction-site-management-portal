<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  type Machinery,
  type SetMachineryCommand,
  queryMachineries,
  createMachinery,
  getMachinery,
  updateMachinery,
  deleteMachinery,
} from "@/stores/MachineryRepo"

export type MachineriesProps = {
  contractorId: string
}

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
    inputProps: { type: "text" },
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
  SetMachineryCommand
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
  queryItems: (keyword, skip, take) =>
    queryMachineries({
      keyword,
      skip,
      take,
      contractor_id: props.contractorId,
    }),
  rowActions: [{ type: "delete" }],
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
    method: createMachinery,
  },
  editor: {
    fields: fields,
    modelBuilder: async (item) => getMachinery(item.id),
    method: (command, item) => updateMachinery(item.id, command),
  },
  deleteMethod: (item) => deleteMachinery(item.id),
}
</script>
