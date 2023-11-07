<template>
  <NConfigProvider :locale="zhTW" :date-locale="dateZhTW">
    <NDialogProvider>
      <RouterView />
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NDialogProvider } from "naive-ui"
import { zhTW, dateZhTW } from "naive-ui"
</script>
