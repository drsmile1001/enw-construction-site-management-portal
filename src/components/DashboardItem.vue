<template>
  <div class="bg-secondary-700 p-6 grid grid-cols-3 grid-rows-2 gap-4">
    <label class="col-span-2 row-span-1 font-bold text-2xl color-tertiary">{{
      title
    }}</label>
    <div class="row-span-2 place-self-center font-bold text-4xl color-success">
      {{ indicator }}
    </div>
    <div class="col-span-2 row-span1 color-secondary-300">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  indicator: string
  description?: string
}>()
</script>
