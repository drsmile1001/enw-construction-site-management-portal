<template>
  <div class="w-full flex justify-center">
    <RWDColumn>
      <div>
        <DynamicForm ref="formRef" :="props" />
      </div>
      <div class="flex justify-end">
        <NButton type="primary" size="small" @click="() => submit()"
          >儲存</NButton
        >
      </div>
    </RWDColumn>
  </div>
</template>

<script setup lang="ts" generic="TItem extends DynamicFormModel">
import { type ComponentExposed } from "vue-component-type-helpers"
import DynamicForm, {
  type DynamicFormModel,
  type DynamicFormProps,
} from "./DynamicForm.vue"
import { useMessage } from "naive-ui"

export type FormViewProps<TItem extends DynamicFormModel> =
  {} & DynamicFormProps<TItem>

const message = useMessage()
const props = defineProps<FormViewProps<TItem>>()
const emits = defineEmits<{
  submitted: []
}>()

const formRef = ref<null | ComponentExposed<typeof DynamicForm<TItem>>>(null)

async function submit() {
  if (!formRef.value) return
  await formRef.value?.submit()
  emits("submitted")
  message.success("儲存成功")
}

onMounted(async () => {
  await formRef.value?.reload()
})
</script>
