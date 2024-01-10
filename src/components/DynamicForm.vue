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
      <DynamicInput
        :="field.inputProps"
        :value="(field.mapper ?? defaultFormItemValueMapper).parser(formModel[field.key as string])"
        @update:value="
          (value) =>
            (formModel![field.key] = (
              field.mapper ?? defaultFormItemValueMapper
            ).formatter(value))
        "
      />
    </NFormItem>
  </NForm>
</template>

<script setup lang="ts" generic="TModel extends DynamicFormModel">
import type { FormInst, FormItemRule, FormRules } from "naive-ui"
import { type DynamicInputProps } from "./DynamicInput.vue"

export type DynamicFormModel = Record<string, unknown>
export type DynamicFormProps<TModel extends DynamicFormModel = any> = {
  fields: DynamicFormItemOption<TModel>[]
  beforeFormVaildation?: (model: TModel) => Promise<void>
  submitMethod: (item: TModel) => Promise<void>
  modelLoader: () => Promise<TModel>
}

export type FormItemValueMapper = {
  parser: (value: any) => any
  formatter: (value: any) => any
}

export type DynamicFormItemOption<TModel extends DynamicFormModel> = {
  label: string
  key: keyof TModel & string
  rules?: FormRules | FormItemRule | FormItemRule[]
  inputProps: DynamicInputProps
  mapper?: FormItemValueMapper
}

const defaultFormItemValueMapper: FormItemValueMapper = {
  parser: (value: any) => value,
  formatter: (value: any) => value,
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
  if (props.beforeFormVaildation) {
    await props.beforeFormVaildation(formModel.value)
  }
  await formRef.value.validate()
  await props.submitMethod(formModel.value)
}

async function reload() {
  formRef.value?.restoreValidation()
  formModel.value = await props.modelLoader()
}

defineExpose({
  submit,
  reload,
})
</script>
