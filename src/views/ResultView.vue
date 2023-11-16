<template>
  <div
    class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-4xl"
  >
    <NResult
      :status="status"
      :title="text[0]"
      :description="text[1]"
      size="huge"
    />
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  status:
    | "500"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "404"
    | "403"
    | "418"
  path?: string
}>()

if (props.path) history.replaceState(null, "", props.path)

const text = computed(() => {
  switch (props.status) {
    case "404":
      return ["404 找不到網頁", "你怎麼過來的？"]
    case "403":
      return ["403 沒有權限", "這樣不行！"]
    default:
      return ["", ""]
  }
})
</script>
