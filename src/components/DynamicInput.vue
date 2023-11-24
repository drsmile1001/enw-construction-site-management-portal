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
  <costom
    v-if="render"
    :value="value"
    @update:value="($event:any) => emits('update:value', $event)"
  />
</template>

<script setup lang="ts">
import {
  type SelectProps,
  type InputProps,
  type InputNumberProps,
  type DatePickerProps,
} from "naive-ui"
import type { VNodeChild } from "vue"

export type DynamicInputProps = {
  type?: "text" | "number" | "select" | "file" | "date"
  inputProps?: Omit<InputProps, "value">
  inputNumberProps?: Omit<InputNumberProps, "value">
  selectProps?: Omit<SelectProps, "value">
  dateProps?: Omit<DatePickerProps, "value">
  render?: ((value: any) => VNodeChild) | undefined
}

const props = defineProps<
  DynamicInputProps & {
    value: any
  }
>()

const emits = defineEmits<{
  "update:value": [any]
}>()

const costom = (p: { value: any }) => props.render?.(p.value)
</script>
