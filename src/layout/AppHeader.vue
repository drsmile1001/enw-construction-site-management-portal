<template>
  <NLayoutHeader class="h-16 px-8 py-4 flex items-center" bordered>
    <img :src="logo" class="w-10" />
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
</template>
<script setup lang="ts">
import { useLayoutController } from "./LayoutController"
import { toValue } from "vue"
import logo from "@/assets/logo.svg"

const controller = useLayoutController()
</script>
