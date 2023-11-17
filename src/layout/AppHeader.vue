<template>
  <NLayoutHeader
    class="h-16 px-8 py-4 flex items-center justify-between"
    bordered
  >
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
            nameCache.get(item.entityNameKey) ?? "-"
          }}</span>
        </RouterLink>
      </NBreadcrumbItem>
    </NBreadcrumb>
    <NButton quaternary @click="() => userStore.signOut()">登出</NButton>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { useNameCache } from "@/stores/NameCache"
import { useLayoutController } from "./LayoutController"
import { useUserStore } from "@/stores/User"

const controller = useLayoutController()
const nameCache = useNameCache()
const userStore = useUserStore()
</script>
