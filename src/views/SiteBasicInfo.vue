<template>
  <FormView :="formViewProps" />
</template>

<script setup lang="ts">
import type { FormViewProps } from "@/components/FormView.vue"
import { useSiteRepo, type Site } from "@/stores/SiteRepo"
import { parseISO, format } from "date-fns"

const repo = useSiteRepo()
const formViewProps: FormViewProps<Site> = {
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
        parser: (value: { start: string; end: string }) => [
          parseISO(value.start).valueOf(),
          parseISO(value.end).valueOf(),
        ],
        formatter: (value: [number, number]) => ({
          start: format(value[0], "yyyy-MM-dd"),
          end: format(value[1], "yyyy-MM-dd"),
        }),
      },
    },
    {
      key: "official_phone",
      label: "聯絡電話",
      inputProps: { type: "text" },
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
