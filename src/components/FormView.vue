<template>
  <div class="w-full flex justify-center">
    <div
      class="w-full sm:w-5/6 md:w-4/6 lg:w-3/6 2xl:w-2/6 flex flex-col gap-4"
    >
      <div>
        <DynamicForm ref="formRef" :="props" />
      </div>
      <div class="flex justify-end">
        <NButton type="primary" size="small" @click="() => submit()"
          >儲存</NButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TItem extends Record<string, unknown>">
import { type ComponentExposed } from "vue-component-type-helpers"
import DynamicForm, { type DynamicFormProps } from "./DynamicForm.vue"

export type FormViewProps<TItem> = {} & DynamicFormProps<TItem>

const props = defineProps<FormViewProps<TItem>>()
const emits = defineEmits<{
  submitted: []
}>()

const formRef = ref<null | ComponentExposed<typeof DynamicForm<TItem>>>(null)

async function submit() {
  if (!formRef.value) return
  await formRef.value?.submit()
  emits("submitted")
}

onMounted(async () => {
  await formRef.value?.reload()
})
</script>
