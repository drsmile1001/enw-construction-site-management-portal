<template>
  <div class="mb-2 flex justify-between">
    <div class="w-1/2">
      <NInputGroup>
        <NInput v-model:value="searchText" />
        <NButton type="primary" ghost @click="() => search({
          keyword: searchText,
          page: 1,
        } as Partial<TQuery>)">
          搜尋
        </NButton>
      </NInputGroup>
    </div>
    <div>
      <NButtonGroup>
        <NButton v-if="creator" type="primary" @click="() => showCreator = true">
          新增
        </NButton>
        <slot name=page-actions :search="search"></slot>
      </NButtonGroup>
    </div>
  </div>
  <NDataTable remote size="small" :columns="columns" :row-key="rowKey" :data="items" :pagination="pagination"
    @update:page="(p) => search({
      page: p
    } as Partial<TQuery>)" />
  <slot name="modals" :search="search"></slot>
  <FormModal v-if="creator" v-model:show="showCreator" title="新增" :fields="creator.fields"
    :default-model-builder="creator.defaultModelBuilder" :submit-entity="creator.method" @submitted="() => search()" />
</template>

<script setup lang="ts" generic="TItem extends RowData, TQuery extends QueryBase">
import type { CreateRowKey, RowData, TableColumns } from 'naive-ui/es/data-table/src/interface';
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router';
import { ITEMS_PER_PAGE } from "@/environment";
import type { PaginationProps } from 'naive-ui';
import type { FormModalFieldOption } from '@/components/FormModal.vue';

export interface QueryBase extends Record<string, string | number | undefined> {
  keyword?: string,
  page?: number,
}

export type TableViewProps<TItem> = {
  columns: TableColumns<TItem>,
  rowKey: CreateRowKey<TItem>,
  queryItems: (keyword: string, skip: number, take: number) => Promise<{
    items: TItem[],
    total: number,
  }>,
  creator?: CreatorOptions<TItem>,
}

export type CreatorOptions<TItem> = {
  fields: FormModalFieldOption<TItem>[],
  defaultModelBuilder: () => TItem,
  method: (item: TItem) => Promise<void>,
}

const router = useRouter()
const currentRoute = useRoute()
const props = defineProps<TableViewProps<TItem>>()
const searchText = ref<string>(currentRoute.query.keyword as LocationQueryValue ?? "")
const keyword = computed(() => currentRoute.query.keyword as LocationQueryValue ?? "")
const page = computed(() => !!(currentRoute.query.page) ? Number(currentRoute.query.page) : 1)
const items = ref([]) as Ref<TItem[]>
const total = ref<number>(0)
const pagination = computed<PaginationProps>(() => ({
  page: page.value,
  pageSize: ITEMS_PER_PAGE,
  pageCount: Math.ceil(total.value / ITEMS_PER_PAGE),
}))

async function search(query?: Partial<TQuery>) {
  if (query) {
    await router.push({
      query: {
        ...currentRoute.query,
        ...query,
      },
    })
  }
  const { items: queried, total: t } = await props.queryItems(keyword.value,
    (page.value - 1) * ITEMS_PER_PAGE,
    ITEMS_PER_PAGE,
  )
  items.value = queried
  total.value = t
}
search()

const showCreator = ref(false)

</script>