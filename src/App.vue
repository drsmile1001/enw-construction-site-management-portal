<template>
  <NConfigProvider
    :locale="zhTW"
    :date-locale="dateZhTW"
    :theme="darkTheme"
    :theme-overrides="themeOverrides"
  >
    <NMessageProvider>
      <NDialogProvider>
        <RouterView />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { NConfigProvider, NDialogProvider, NMessageProvider } from "naive-ui"
import { zhTW, dateZhTW, darkTheme } from "naive-ui"
import { themeOverrides } from "./theme"
</script>
