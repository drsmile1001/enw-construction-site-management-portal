<template>
    {{ title }}
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"

const currentRoute = useRoute()
const title = computed(() => currentRoute.meta.title)

</script>