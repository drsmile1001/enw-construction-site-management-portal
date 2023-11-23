<template>
  <div class="flex flex-col items-center gap-4">
    <NSteps :current="step">
      <NStep title="選取檔案" />
      <NStep title="檢視欲匯入資料" />
      <NStep title="執行匯入" />
    </NSteps>
    <div></div>
    <template v-if="step === 1">
      <RWDColumn>
        <NForm label-placement="left" label-width="auto" size="small">
          <NFormItem label="試算表">
            <NUpload
              :max="1"
              @update:file-list="
                (files) => (file = files.length ? files[0].file : null)
              "
            >
              <NButton> 選取檔案 </NButton>
            </NUpload>
          </NFormItem>
        </NForm>
      </RWDColumn>
      <NDataTable
        v-if="errors?.length"
        size="small"
        :columns="[
          { key: '_row', title: '行' },
          ...columns.map((column) => ({
            key: column.key,
            title: column.title,
          })),
        ]"
        :row-key="(row) => row._row"
        :data="errors"
        :pagination="{ pageSize: 10 }"
      />
      <div class="flex justify-center gap-2">
        <NButton :disabled="!file" @click="parseFile"> 解析 </NButton>
      </div>
    </template>

    <div v-if="step === 2" class="w-full flex flex-col gap-4">
      <NDataTable
        size="small"
        :columns="[{ key: '_row', title: '行' }, ...columns]"
        :row-key="(row) => row._row"
        :data="data"
        :pagination="{ pageSize: 10 }"
      />
      <div class="flex justify-center gap-2">
        <NButton @click="step = 1"> 上一步 </NButton>
        <NButton @click="importData"> 執行匯入 </NButton>
      </div>
    </div>
    <div v-if="step === 3" class="w-full flex flex-col gap-4">
      <NProgress
        type="line"
        :percentage="progress"
        :stroke-width="20"
        :show-info="false"
        :status="progress === 100 ? 'success' : 'default'"
      >
        {{ imported }} / {{ data?.length }}
      </NProgress>
      <div class="flex justify-center">
        <RouterLink v-if="progress === 100" :to="{ name: importDoneTo }">
          <NButton>匯入成果</NButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TItem extends Record<string,unknown>">
import { read, utils, type WorkBook } from "xlsx"
import { NProgress, useMessage } from "naive-ui"
import type { Arrayable } from "@vueuse/core"
import type { VNodeChild } from "vue"

export type ImporterViewProps<TItem extends Record<string, unknown>> = {
  defaultSheet: string
  columns: ImporterViewItemColumn<TItem>[]
  importDoneTo: string
  importMethod: (item: TItem) => Promise<void>
}

export type chekcResult = true | string

export type ImporterViewItemColumn<TItem extends Record<string, unknown>> = {
  key: keyof TItem & string
  title: string
  parser?: (value: string | number | null | undefined) => any
  checkers?: Arrayable<(value: any) => chekcResult>
  render?: ((rowData: TItem, rowIndex: number) => VNodeChild) | undefined
}

const props = defineProps<ImporterViewProps<TItem>>()
const message = useMessage()

const step = ref(1)
const file = ref<File | null>(null)
const errors = ref<Record<string, string>[]>()

type ImportingItem = Partial<TItem> & { _row: number }
const data = ref<ImportingItem[]>()

async function parseFile() {
  errors.value = []
  if (!file.value) return
  const book = await new Promise<WorkBook>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target!.result
        const wb = read(data, { type: "binary" })
        resolve(wb)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsBinaryString(file.value!)
  })
  const sheetName =
    book.SheetNames.length === 1
      ? book.SheetNames[0]
      : book.SheetNames.find((name) => name === props.defaultSheet)
  if (!sheetName) {
    message.warning("找不到試算表")
    return
  }
  const sheet = book.Sheets[sheetName]
  const raw_data =
    utils.sheet_to_json<Record<string, string | number | undefined>>(sheet)
  data.value = raw_data.map((item, index) => {
    const newItem: ImportingItem = { _row: index + 2 } as any
    for (const column of props.columns) {
      const value = item[column.title]
      newItem[column.key] = column.parser ? column.parser(value) : value
    }
    return newItem
  })

  for (let index = 0; index < data.value.length; index++) {
    const item = data.value[index]
    const error: Record<string, string> = {
      _row: `${index + 2}`,
    }
    for (const column of props.columns) {
      const value = item[column.key]
      if (!column.checkers) continue
      const checkers = Array.isArray(column.checkers)
        ? column.checkers
        : [column.checkers]
      for (const checker of checkers) {
        const result = checker(value)
        if (result === true) continue
        error[column.key] = result
      }
    }
    if (Object.keys(error).length > 1) errors.value.push(error)
  }

  if (errors.value.length) {
    message.error("檔案格式錯誤")
    return
  }

  step.value = 2
}

const progress = ref(0)
const imported = ref(0)
async function importData() {
  if (!data.value) return
  step.value = 3
  try {
    progress.value = 0
    for (let index = 0; index < data.value.length; index++) {
      const item = data.value[index]
      progress.value = ((index + 1) / data.value.length) * 100
      await props.importMethod(item as unknown as TItem)
      imported.value = index + 1
    }
    progress.value = 100
  } catch (error) {
    message.error("匯入失敗")
    console.error(error)
  }
}
</script>
