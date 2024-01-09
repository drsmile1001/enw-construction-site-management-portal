<template>
  {{ counter }}
  <button @click="plusOne">+1</button>
</template>

<script setup lang="ts">
const counter = ref(0)

function plusOne() {
  counter.value++
}
</script>
