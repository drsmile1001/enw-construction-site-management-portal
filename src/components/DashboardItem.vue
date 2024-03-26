<template>
  <div class="bg-secondary-700 p-6 grid grid-cols-3 grid-rows-2 gap-4">
    <label class="col-span-2 row-span-1 font-bold text-2xl color-tertiary">{{
      title
    }}</label>
    <div
      class="row-span-2 place-self-center font-bold text-4xl"
      :class="{
        'color-success': level === 'success',
        'color-warning': level === 'warning',
        'color-danger': level === 'danger',
      }"
    >
      <NIcon v-if="icon" size="64">
        <CheckmarkCircle v-if="icon === 'CheckmarkCircle'" />
        <AlertCircle v-if="icon === 'AlertCircle'" />
        <CloseCircle v-if="icon === 'CloseCircle'" />
      </NIcon>
      <template v-if="!icon">{{ indicator }}</template>
    </div>
    <div class="col-span-2 row-span1 color-secondary-300">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckmarkCircle, AlertCircle, CloseCircle } from "@vicons/ionicons5"

defineProps<{
  title: string
  indicator?: string
  icon?: "CheckmarkCircle" | "AlertCircle" | "CloseCircle"
  description?: string
  level?: "success" | "warning" | "danger"
}>()
</script>
