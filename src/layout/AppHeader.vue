<template>
  <NLayoutHeader class="h-16 px-8 py-4 flex items-center" bordered>
    <NBreadcrumb>
      <NBreadcrumbItem
        v-for="item in controller.breadcrumbItems"
        :key="item.label"
      >
        <RouterLink
          class="flex gap-2"
          :to="{
            name: item.toRouteName,
          }"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.entityNameKey">{{
            entityNameCache.get(item.entityNameKey) ?? "-"
          }}</span>
        </RouterLink>
      </NBreadcrumbItem>
    </NBreadcrumb>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { useEntityNameCache } from "@/stores/EntityNameCache"
import { useLayoutController } from "./LayoutController"

const controller = useLayoutController()
const entityNameCache = useEntityNameCache()
</script>
