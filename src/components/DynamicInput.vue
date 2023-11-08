<template>
  <NInput
    v-if="type === 'text'"
    :="inputProps"
    :value="value"
    @update:value="($event) => emits('update:value', $event)"
  />
  <NInputNumber
    v-if="type === 'number'"
    :="inputNumberProps"
    :value="value"
    @update:value="($event) => emits('update:value', $event)"
  />
  <NSelect
    v-if="type === 'select'"
    :="selectProps"
    :value="value"
    @update:value="($event) => emits('update:value', $event)"
  />
</template>

<script setup lang="ts">
import {
  type SelectProps,
  type InputProps,
  type InputNumberProps,
} from "naive-ui"

export type DynamicInputProps = {
  type: "text" | "number" | "select"
  inputProps?: Exclude<InputProps, "value">
  inputNumberProps?: Exclude<InputNumberProps, "value">
  selectProps?: Exclude<SelectProps, "value">
}

defineProps<
  DynamicInputProps & {
    value: any
  }
>()

const emits = defineEmits<{
  "update:value": [string | number | null]
}>()
</script>
