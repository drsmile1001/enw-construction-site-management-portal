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
          <span v-if="item.name">{{ toValue(item.name) }}</span>
        </RouterLink>
      </NBreadcrumbItem>
    </NBreadcrumb>
    <NButton quaternary @click="() => userStore.signOut()">登出</NButton>
  </NLayoutHeader>
</template>
<script setup lang="ts">
import { useLayoutController } from "./LayoutController"
import { useUserStore } from "@/stores/User"
import { toValue } from "vue"

const controller = useLayoutController()
const userStore = useUserStore()
</script>
