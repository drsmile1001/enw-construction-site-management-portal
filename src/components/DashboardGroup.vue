<template>
  <div class="bg-secondary-600/50 flex flex-col">
    <div class="w-full h-[2px] bg-gradient-to-r from-primary to-tertiary"></div>
    <div class="grow p-6 flex flex-col gap-6">
      <label class="font-bold text-2xl color-primary">{{ title }}</label>
      <slot></slot>
    </div>
    <div class="w-full h-[2px] bg-gradient-to-r from-primary to-tertiary"></div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>
