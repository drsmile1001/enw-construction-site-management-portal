<template>
  <NForm label-placement="left" label-width="auto" size="medium">
    <NFormItem v-for="field in fields" :label="field">
      <NInput />
    </NFormItem>
  </NForm>
</template>

<script setup lang="ts">
export type FakeDetailViewProps = {
  fields?: string[]
}

defineProps<FakeDetailViewProps>()
</script>