<template>
  <NModal :show="show" @update:show="(v) => emits('update:show', v)">
    <NCard
      class="w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6"
      :title="title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <NForm
        v-if="formModel"
        ref="formRef"
        label-placement="left"
        label-width="auto"
        size="medium"
        :model="formModel"
        :rules="rules"
      >
        <NFormItem
          v-for="field in fields"
          :key="field.label"
          :label="field.label"
          :path="(field.key as string)"
        >
          <NInput
            v-if="field.type === 'text'"
            v-model:value="(formModel[field.key] as string)"
          />
          <NInputNumber
            v-else-if="field.type === 'number'"
            v-model:value="(formModel[field.key] as number)"
          />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class="flex justify-end gap-2">
          <NButton type="primary" size="small" @click="() => submit()"
            >儲存</NButton
          >
          <NButton size="small" @click="() => emits('update:show', false)"
            >取消</NButton
          >
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts" generic="TItem extends Record<string, unknown>">
import type { FormInst, FormItemRule, FormRules } from "naive-ui"

export type FormModalProps<TItem> = {
  title: string
  show: boolean
  fields: FormModalFieldOption<TItem>[]
  submitModel: (item: TItem) => Promise<void>
  modelLoader: () => Promise<TItem>
}

export type FormModalFieldOption<TItem> = {
  label: string
  key: keyof TItem
  type: "text" | "number"
  placeholder?: string
  rules?: FormRules | FormItemRule | FormItemRule[]
}

const props = defineProps<FormModalProps<TItem>>()
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
  "update:show": [boolean]
  submitted: []
}>()

const formModel = ref<TItem>()
const formRef = ref<FormInst | null>(null)

watchEffect(async () => {
  if (!props.show) return
  formRef.value?.restoreValidation()
  formModel.value = await props.modelLoader()
})

async function submit() {
  if (!formModel.value || !formRef.value) return
  await formRef.value.validate()
  await props.submitModel(formModel.value)
  emits("update:show", false)
  emits("submitted")
}
</script>
