<template>
  <NLayoutSider :native-scrollbar="false">
    <NMenu ref="menuInstRef" :options="controller.currentMenu" v-model:value="selectedKey" />
  </NLayoutSider>
</template>

<script setup lang="ts">
import type { MenuInst } from "naive-ui";
import { useLayoutController } from "./LayoutController"
import { useRoute } from "vue-router"

const controller = useLayoutController()
const currentRoute = useRoute()
const menuInstRef = ref<MenuInst | null>(null)
const selectedKey = ref("")

watch(() => currentRoute.name, (name) => {
  console.log("currentRoute.name", name)
  selectedKey.value = name as string
  nextTick(() => {
    menuInstRef.value?.showOption(name as string)
  })
}, {
  immediate: true
})


</script>