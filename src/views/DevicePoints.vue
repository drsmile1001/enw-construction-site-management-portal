<template>
  <TableView :="tableViewSetting"> </TableView>
</template>

<script setup lang="ts">
import type { DynamicFormItemOption } from "@/components/DynamicForm.vue"
import TableView, { type TableViewProps } from "@/components/TableView.vue"
import {
  useDevicePointRepo,
  type DevicePoint,
  type CreateDevicePointCommand,
  type UpdateDevicePointCommand,
  pointTypes,
} from "@/stores/DeviceRepo"

const repo = useDevicePointRepo()
export type DevicePointsProps = {
  deviceId: string
}
const props = defineProps<DevicePointsProps>()

const commonModelFields: (DynamicFormItemOption<CreateDevicePointCommand> &
  DynamicFormItemOption<UpdateDevicePointCommand>)[] = [
  {
    key: "name",
    label: "點位名稱",
    inputProps: { type: "text" },
    rules: { required: true, trigger: "blur", message: "點位名稱必填" },
  },
  {
    key: "trigger",
    label: "觸發條件",
    inputProps: { type: "text" },
  },
  {
    key: "type",
    label: "點位類型",
    inputProps: {
      type: "select",
      selectProps: {
        options: pointTypes.map((type) => ({
          label: type,
          value: type,
        })),
      },
    },
    rules: { required: true, trigger: "change", message: "點位類型必填" },
  },
]

const tableViewSetting: TableViewProps<
  DevicePoint,
  CreateDevicePointCommand,
  UpdateDevicePointCommand
> = {
  columns: [
    {
      key: "name",
      title: "點位名稱",
    },
    {
      key: "id",
      title: "點位 ID",
    },
  ],
  rowKey: (row) => row.id,
  queryItems: (keyword, skip, take) =>
    repo.query({
      device_id: props.deviceId,
      keyword,
      skip,
      take,
    }),
  rowActions: [
    {
      type: "editor",
    },
    { type: "delete" },
  ],
  creator: {
    fields: [
      {
        key: "id",
        label: "點位 ID",
        inputProps: { type: "text" },
        rules: { required: true, trigger: "blur", message: "點位 ID 必填" },
      },
      ...commonModelFields,
    ],
    modelBuilder: async () => ({
      device_id: props.deviceId,
      id: "",
      name: "",
      trigger: "",
      type: "",
    }),
    method: (model) => repo.create(model),
  },
  editor: {
    fields: commonModelFields,
    modelBuilder: async (item) =>
      repo.get({
        device_id: item.device_id,
        id: item.id,
      }),
    method: (model, item) =>
      repo.update(
        {
          device_id: item.device_id,
          id: item.id,
        },
        model
      ),
  },
  deleteMethod: (item) =>
    repo.delete({
      device_id: item.device_id,
      id: item.id,
    }),
}
</script>
