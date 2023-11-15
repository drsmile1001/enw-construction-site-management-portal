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
  <AppUploader
    v-if="type === 'file'"
    :="fileProps!"
    :value="value.value"
    @update:value="
      ($event) =>
        emits('update:value', {
          value: $event,
        })
    "
  />
  <NDatePicker
    v-if="type === 'date'"
    :="dateProps"
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
import { type AppUploaderProps } from "./AppUploader.vue"

export type DynamicInputProps = {
  type: "text" | "number" | "select" | "file" | "date"
  inputProps?: Omit<InputProps, "value">
  inputNumberProps?: Omit<InputNumberProps, "value">
  selectProps?: Omit<SelectProps, "value">
  fileProps?: Omit<AppUploaderProps, "value">
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
