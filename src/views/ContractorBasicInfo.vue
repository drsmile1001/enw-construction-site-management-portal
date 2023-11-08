<template>
  <FormView :="formViewProps" />
</template>

<script setup lang="ts">
import type { FormViewProps } from "@/components/FormView.vue"
import {
  getContractor,
  type UpdateContractorCommand,
  updateContractor,
} from "@/stores/ContractorRepo"

export type ContractorBasicInfoProps = {
  contractorId: string
}

const props = defineProps<ContractorBasicInfoProps>()

const formViewProps: FormViewProps<UpdateContractorCommand> = {
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
  modelLoader: () => getContractor(props.contractorId),
  submitMethod: (command) => updateContractor(props.contractorId, command),
}
</script>
