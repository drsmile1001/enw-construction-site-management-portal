<template>
  <FormView :="formViewProps" />
</template>

<script setup lang="ts">
import type { FormViewProps } from "@/components/FormView.vue"
import {
  getVender,
  type UpdateVenderCommand,
  updateVender,
} from "@/stores/VenderRepo"

export type VenderBasicInfoProps = {
  vendorId: string
}

const props = defineProps<VenderBasicInfoProps>()

const formViewProps: FormViewProps<UpdateVenderCommand> = {
  fields: [
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
  modelLoader: () => getVender(props.vendorId),
  submitMethod: (command) => updateVender(props.vendorId, command),
}
</script>
