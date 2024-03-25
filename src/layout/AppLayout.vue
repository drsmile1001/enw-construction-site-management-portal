<template>
  <NLayout position="absolute">
    <AppHeader />
    <NLayout class="absolute left-0 right-0 bottom-8 top-16" has-sider>
      <AppMenu />
      <NLayout>
        <div class="p-6">
          <RouterView :key="route.fullPath" />
        </div>
      </NLayout>
    </NLayout>
    <NLayoutFooter
      position="absolute"
      class="h-8 flex items-center justify-end px-8 gap-2"
    >
      <img :src="companyLogo" class="h-6" />
      Copyright © 2024 ENNOWELL, All rights reserved.
    </NLayoutFooter>
  </NLayout>
</template>

<script setup lang="ts">
import { NLayoutFooter } from "naive-ui"
import AppHeader from "./AppHeader.vue"
import AppMenu from "./AppMenu.vue"
import { useRoute } from "vue-router"
import companyLogo from "@/assets/company_logo.png"

const route = useRoute()
</script>
