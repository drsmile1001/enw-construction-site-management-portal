<template>
  <NLayoutHeader class="h-16 px-8 py-4 flex items-center" bordered>
    <h1 class="text-2xl font-bold">{{ controller.scopeName }}</h1>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { useLayoutController } from "./LayoutController"

const controller = useLayoutController()
</script>
