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
import { zhTW, dateZhTW, darkTheme, GlobalThemeOverrides } from "naive-ui"
import unocssConfig from "../uno.config"

const { primary, secondary, tertiary, warning, danger } =
  unocssConfig.theme!.colors
const white = "#FFFFFF"

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: primary.DEFAULT,
    bodyColor: secondary[500],
  },
  Button: {
    textColorPrimary: white,
    textColorHoverPrimary: white,
    textColorFocusPrimary: white,
  },
  Layout: {
    headerColor: secondary[700],
    siderColor: secondary[600],
  },
  DataTable: {
    tdColor: secondary[500],
    thColor: secondary[600],
    borderColor: secondary[400],
    tdColorHover: secondary[400],
  },
}
</script>
