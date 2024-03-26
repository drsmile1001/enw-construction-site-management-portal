<template>
  <div class="relative bg-secondary-600/50 p-6 flex flex-col gap-6">
    <label class="font-bold text-2xl color-primary">{{ title }}</label>
    <slot></slot>
    <div class="absolute inset-0">
      <div
        class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-tertiary"
      ></div>
      <div
        class="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-tertiary"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
