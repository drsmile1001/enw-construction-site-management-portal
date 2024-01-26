<template>
  <NConfigProvider :theme="darkTheme">
    <NLayoutHeader
      class="h-16 bg-primary-600 px-8 py-4 flex items-center justify-between"
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
    </NLayoutHeader>
  </NConfigProvider>
</template>
<script setup lang="ts">
import { NConfigProvider } from "naive-ui"
import { useLayoutController } from "./LayoutController"
import { toValue } from "vue"
import { darkTheme } from "naive-ui"

const controller = useLayoutController()
</script>
