<template>
  <NInputGroup>
    <NInput
      v-model:value="mainInput"
      @update:value="onMainInputUpdated"
      type="text"
    />
    <NPopover trigger="click" v-model:show="showAdvence">
      <template #trigger>
        <NButton>進階</NButton>
      </template>
      <div class="p-2 flex flex-col gap-2">
        <NForm label-placement="left" label-width="auto" size="small">
          <NFormItem
            v-for="field in fields"
            :key="field.label"
            :label="field.label"
          >
            <DynamicInput
              :="field.inputProps"
              v-model:value="innerQuery[field.key]"
              @update:value="onDynamicInputUpdated"
            />
          </NFormItem>
        </NForm>
        <div class="flex justify-end gap-2">
          <NButton size="small" @click="clear">清除</NButton>
          <NButton size="small" type="primary" @click="search">搜尋</NButton>
        </div>
      </div>
    </NPopover>
    <NButton type="primary" @click="search">搜尋</NButton>
  </NInputGroup>
</template>
<script setup lang="ts" generic="TQuery extends Record<string,unknown>">
import type { DynamicInputProps } from "./DynamicInput.vue"

export type SearchBarProps<TQuery> = {
  fields: SearchBarAdvancedFieldOption<TQuery>[]
  query: TQuery
}

export type SearchBarAdvancedFieldOption<TQuery> = {
  label: string
  key: keyof TQuery & string
  inputProps: DynamicInputProps
  parser: (value: string) => any
  stringify: (value: any) => string
}

const props = defineProps<SearchBarProps<TQuery>>()
const emits = defineEmits<{
  "update:query": [TQuery]
}>()

const showAdvence = ref(false)

const mainInput = ref("")

function onMainInputUpdated() {
  const sections = mainInput.value.split(" ").reduce((acc, cur) => {
    if (cur.includes(":")) {
      let [key, value] = cur.split(":")
      key = key.trim()
      value = value.trim()
      if (!acc.has(key)) acc.set(key, value)
    } else {
      if (!acc.has("keyword")) {
        acc.set("keyword", cur.trim())
      }
    }
    return acc
  }, new Map<string, string>())
  const query: TQuery = {} as TQuery

  for (const field of props.fields) {
    const value = sections.get(field.key)
    if (!value) query[field.key] = field.parser("")
    else query[field.key] = field.parser(value)
  }

  innerQuery.value = query as TQuery
}

function onDynamicInputUpdated() {
  const sections: string[] = []
  for (const [key, value] of Object.entries(innerQuery.value)) {
    const field = props.fields.find((f) => f.key === key)
    if (!field) continue
    const stringifiedValue = field.stringify(value)
    if (!stringifiedValue) continue
    if (key === "keyword") {
      sections.push(stringifiedValue)
    } else {
      sections.push(`${key}:${stringifiedValue}`)
    }
  }
  mainInput.value = sections.join(" ")
}

const innerQuery = ref(props.query) as Ref<TQuery>
onDynamicInputUpdated()

function clear() {
  mainInput.value = ""
  onMainInputUpdated()
}

function search() {
  showAdvence.value = false
  emits("update:query", innerQuery.value)
}
</script>
