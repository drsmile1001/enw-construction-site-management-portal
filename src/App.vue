<template>
  <NConfigProvider :locale="zhTW" :date-locale="dateZhTW">
    <NMessageProvider>
      <NDialogProvider>
        <RouterView />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui"
import { zhTW, dateZhTW } from "naive-ui"
</script>
