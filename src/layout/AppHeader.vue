<template>
  <NLayoutHeader class="h-16 px-8 py-4 flex items-center" bordered>
    <NBreadcrumb>
      <NBreadcrumbItem
        :clickable="false"
        v-for="scope in controller.currentScopeName"
        :key="scope"
        >{{ scope }}</NBreadcrumbItem
      >
    </NBreadcrumb>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { useLayoutController } from "./LayoutController"

const controller = useLayoutController()
</script>
