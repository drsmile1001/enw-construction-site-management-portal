<template>
  <NForm
    v-if="formModel"
    ref="formRef"
    label-placement="left"
    label-width="auto"
    size="small"
    :model="formModel"
    :rules="rules"
  >
    <NFormItem
      v-for="field in fields"
      :key="field.label"
      :label="field.label"
      :path="field.key"
    >
      <DynamicInput :="field.inputProps" v-model:value="formModel[field.key]" />
    </NFormItem>
  </NForm>
</template>

<script setup lang="ts" generic="TModel extends Record<string, unknown>">
import type { FormInst, FormItemRule, FormRules } from "naive-ui"
import { type DynamicInputProps } from "./DynamicInput.vue"

export type DynamicFormProps<TModel> = {
  fields: DynamicFormItemOption<TModel>[]
  submitMethod: (item: TModel) => Promise<void>
  modelLoader: () => Promise<TModel>
}

export type DynamicFormItemOption<TModel> = {
  label: string
  key: keyof TModel & string
  rules?: FormRules | FormItemRule | FormItemRule[]
  inputProps: DynamicInputProps
}

const props = defineProps<DynamicFormProps<TModel>>()
const rules = computed(() => {
  const rules: FormRules = {}
  props.fields.forEach((field) => {
    if (field.rules) {
      rules[field.key as string] = field.rules
    }
  })
  return rules
})

const emits = defineEmits<{
  submitted: []
}>()

const formModel = ref<TModel>()
const formRef = ref<FormInst | null>(null)

async function submit() {
  if (!formModel.value || !formRef.value) return
  await formRef.value.validate()
  await props.submitMethod(formModel.value)
}

async function reload() {
  console.log("reload")
  formRef.value?.restoreValidation()
  formModel.value = await props.modelLoader()
  console.log("reload!")
}

defineExpose({
  submit,
  reload,
})
</script>
