<template>
  <NModal :show="show" @update:show="(v) => emits('update:show', v)">
    <NCard class="w-5/6 md:w-4/6 lg:w-3/6 xl:w-2/6" :title="title" :bordered="false" size="huge" role="dialog"
      aria-modal="true">
      <NForm label-placement="left" label-width="auto" size="medium">
        <NFormItem v-for="field in fields" :label="field">
          <NInput />
        </NFormItem>
      </NForm>
      <template #footer>
        <div class=" flex justify-end gap-2">
          <NButton type="primary" size="small">儲存</NButton>
          <NButton size="small">取消</NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">

export type FakeTableViewProps = {
  title: string
  show: boolean
  fields?: string[]
}

defineProps<FakeTableViewProps>()
const emits = defineEmits<{
  "update:show": [boolean]
}>()

</script>