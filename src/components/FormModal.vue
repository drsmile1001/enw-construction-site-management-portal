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
      <DynamicForm ref="formRef" :="props" />
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

<script setup lang="ts" generic="TModel extends DynamicFormModel">
import { type ComponentExposed } from "vue-component-type-helpers"
import DynamicForm, {
  type DynamicFormModel,
  type DynamicFormProps,
} from "./DynamicForm.vue"

export type FormModalProps<TModel extends DynamicFormModel = any> = {
  title: string
  show: boolean
} & DynamicFormProps<TModel>

const props = defineProps<FormModalProps<TModel>>()

const emits = defineEmits<{
  "update:show": [boolean]
  submitted: []
}>()

const formRef = ref<null | ComponentExposed<typeof DynamicForm<TModel>>>(null)

watchEffect(async () => {
  if (!props.show) return
  formRef.value?.reload()
})

async function submit() {
  if (!formRef.value) return
  await formRef.value?.submit()
  emits("update:show", false)
  emits("submitted")
}
</script>
