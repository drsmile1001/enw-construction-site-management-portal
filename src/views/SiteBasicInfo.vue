<template>
  <FormView :="formViewProps" />
</template>

<script setup lang="ts">
import type { FormViewProps } from "@/components/FormView.vue"
import { type UpdateSiteCommand, useSiteRepo } from "@/stores/SiteRepo"
import { parseISO, format } from "date-fns"

const repo = useSiteRepo()
const formViewProps: FormViewProps<UpdateSiteCommand> = {
  fields: [
    {
      key: "name",
      label: "名稱",
      inputProps: { type: "text" },
      rules: { required: true, trigger: "blur", message: "名稱必填" },
    },
    {
      key: "address",
      label: "地址",
      inputProps: { type: "text" },
    },
    {
      key: "principal",
      label: "負責人",
      inputProps: { type: "text" },
    },
    {
      key: "period",
      label: "工期",
      inputProps: {
        type: "date",
        dateProps: {
          type: "daterange",
        },
      },
      mapper: {
        //TODO: mapper 抽成共用物件
        parser: (value: [string, string]) =>
          value.map((v) => parseISO(v).valueOf()),
        formatter: (value: [number, number]) =>
          value.map((v) => format(v, "yyyy-MM-dd")),
      },
    },
    {
      key: "official_phone",
      label: "聯絡電話",
      inputProps: { type: "text" },
    },
    {
      key: "blueprint_file",
      label: "藍圖",
      inputProps: {
        type: "file",
        fileProps: {
          collection: `site_blueprint`, //TODO: collection 的值很有可能是依據 entity id 來決定，然而目前的設計這裡是寫死的
          uploadProps: {
            listType: "image",
            multiple: true,
          },
        },
      },
    },
    {
      key: "construction_company",
      label: "施工廠商",
      inputProps: { type: "text" },
    },
    {
      key: "supervision_company",
      label: "監造單位",
      inputProps: { type: "text" },
    },
    {
      key: "organizer",
      label: "主辦單位",
      inputProps: { type: "text" },
    },
  ],
  modelLoader: () => repo.get(),
  submitMethod: (command) => repo.update(command),
}
</script>
