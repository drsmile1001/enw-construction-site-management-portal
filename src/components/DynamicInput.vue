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
  <NDatePicker
    v-if="type === 'date'"
    :="dateProps"
    :first-day-of-week="6"
    :value="value"
    @update:value="($event) => emits('update:value', $event)"
  />
</template>

<script setup lang="ts">
import {
  type SelectProps,
  type InputProps,
  type InputNumberProps,
  type DatePickerProps,
} from "naive-ui"

export type DynamicInputProps = {
  type: "text" | "number" | "select" | "file" | "date"
  inputProps?: Omit<InputProps, "value">
  inputNumberProps?: Omit<InputNumberProps, "value">
  selectProps?: Omit<SelectProps, "value">
  dateProps?: Omit<DatePickerProps, "value">
}

defineProps<
  DynamicInputProps & {
    value: any
  }
>()

const emits = defineEmits<{
  "update:value": [any]
}>()
</script>
