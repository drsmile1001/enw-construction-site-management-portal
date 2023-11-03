<template>
  <NLayoutSider :native-scrollbar="false">
    <NMenu :options="controller.currentMenu" :value="(currentRoute.name as string)" />
  </NLayoutSider>
</template>

<script setup lang="ts">
import { useLayoutController } from "./LayoutController"
import { useRoute } from "vue-router"

const controller = useLayoutController()
const currentRoute = useRoute()

</script>