<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  useDeviceRepo,
  type Device,
  type SetDeviceCommand,
} from "@/stores/DeviceRepo"

const repo = useDeviceRepo()
const setFormFields: DynamicFormItemOption<SetDeviceCommand>[] = [
  {
    label: "名稱",
    key: "name",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "名稱必填" },
  },
]

const tableViewSetting: TableViewProps<
  Device,
  SetDeviceCommand,
  SetDeviceCommand,
  {
    keyword?: string
  }
> = {
  columns: [
    {
      key: "name",
      title: "裝置名稱",
    },
    {
      key: "id",
      title: "裝置ID",
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (query, page) =>
    repo.query({
      keyword: query.keyword,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
  rowActions: [
    {
      type: "editor",
    },
    {
      type: "nav",
      navToBuilder: (item) => ({
        name: "DevicePoints",
        params: { deviceId: item.id },
      }),
      title: "點位設定",
    },
    { type: "delete" },
  ],
  creator: {
    fields: setFormFields,
    modelBuilder: async () => ({
      name: "",
    }),
    method: (model) => repo.create(model),
  },
  editor: {
    fields: setFormFields,
    modelBuilder: async (item) => ({
      name: item.name,
    }),
    method: (model, item) => repo.update(item.id, model),
  },
  deleteMethod: (item) => repo.delete(item.id),
}
</script>
