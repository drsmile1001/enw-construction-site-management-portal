<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div class="w-1/2">
        <NInputGroup>
          <NInput v-model:value="searchText" />
          <NButton
            type="primary"
            ghost
            @click="() => search({
          keyword: searchText,
          page: 1,
        } as Partial<TQuery>)"
          >
            搜尋
          </NButton>
        </NInputGroup>
      </div>
      <div>
        <NButtonGroup>
          <NButton
            v-if="creator"
            type="primary"
            @click="() => (showCreator = true)"
          >
            新增
          </NButton>
          <slot name="page-actions" :search="search"></slot>
        </NButtonGroup>
      </div>
    </div>
    <NDataTable
      remote
      size="small"
      :columns="columns"
      :row-key="rowKey"
      :data="items"
      :pagination="pagination"
      @update:page="(p) => search({
      page: p
    } as Partial<TQuery>)"
    />
  </div>

  <slot name="modals" :search="search"></slot>
  <FormModal
    v-if="creator"
    v-model:show="showCreator"
    title="新增"
    :fields="creator.fields"
    :model-loader="creator.modelBuilder"
    :submit-method="creator.method"
    @submitted="() => search()"
  />
  <FormModal
    v-if="editor"
    v-model:show="showEditor"
    :title="editorTitle"
    :fields="editor.fields"
    :model-loader="editorModelLoader"
    :submit-method="editorModelSubmit"
    @submitted="() => search()"
  />
</template>

<script
  setup
  lang="ts"
  generic="TItem extends RowData, TQuery extends QueryBase, TCreatorModel extends Record<string, unknown>, TUpdaterModel extends Record<string, unknown>"
>
import type {
  CreateRowKey,
  RowData,
  TableBaseColumn,
  TableColumns,
} from "naive-ui/es/data-table/src/interface"
import {
  useRoute,
  useRouter,
  type LocationQueryValue,
  type RouteLocationRaw,
} from "vue-router"
import { ITEMS_PER_PAGE } from "@/environment"
import {
  NButton,
  NButtonGroup,
  NPopconfirm,
  type PaginationProps,
} from "naive-ui"
import { RouterLink } from "vue-router"
import type { DynamicFormItemOption } from "./DynamicForm.vue"

export interface QueryBase extends Record<string, string | number | undefined> {
  keyword?: string
  page?: number
}

export type TableViewProps<TItem, TCreatorModel, TUpdaterModel> = {
  columns: (TableBaseColumn<TItem> & { key: keyof TItem })[]
  rowKey: CreateRowKey<TItem>
  queryItems: (
    keyword: string,
    skip: number,
    take: number
  ) => Promise<{
    items: TItem[]
    total: number
  }>
  creator?: CreatorOptions<TCreatorModel>
  editor?: EditorOptions<TItem, TUpdaterModel>
  rowActions?: RowActionOptions<TItem>[]
  deleteMethod?: (item: TItem) => Promise<void>
}

export type CreatorOptions<TCreatorModel> = {
  fields: DynamicFormItemOption<TCreatorModel>[]
  modelBuilder: () => Promise<TCreatorModel>
  method: (item: TCreatorModel) => Promise<void>
}

export type EditorOptions<TItem, TUpdaterModel> = {
  fields: DynamicFormItemOption<TUpdaterModel>[]
  modelBuilder: (item: TItem) => Promise<TUpdaterModel>
  method: (model: TUpdaterModel, item: TItem) => Promise<void>
  titleBuilder?: (item: TItem) => string
}

export type RowActionOptions<TItem> = {
  type: "editor" | "delete" | "nav"
  navToBuilder?: (item: TItem) => RouteLocationRaw
  title?: string
}

const router = useRouter()
const currentRoute = useRoute()
const props = defineProps<TableViewProps<TItem, TCreatorModel, TUpdaterModel>>()
const searchText = ref<string>(
  (currentRoute.query.keyword as LocationQueryValue) ?? ""
)
const keyword = computed(
  () => (currentRoute.query.keyword as LocationQueryValue) ?? ""
)
const page = computed(() =>
  !!currentRoute.query.page ? Number(currentRoute.query.page) : 1
)
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
  const { items: queried, total: t } = await props.queryItems(
    keyword.value,
    (page.value - 1) * ITEMS_PER_PAGE,
    ITEMS_PER_PAGE
  )
  items.value = queried
  total.value = t
}
search()

const columns = computed(() => {
  if (!props.rowActions) return props.columns
  const columns: TableColumns<TItem> = [
    ...props.columns,
    {
      title: "動作",
      key: "actions",
      render(row) {
        return h(
          "div",
          {
            class: "flex gap-2",
          },
          props.rowActions!.map((action) => {
            if (action.type === "editor") {
              return h(
                NButton,
                {
                  type: "primary",
                  size: "small",
                  secondary: true,
                  onClick: () => {
                    editorItem.value = row
                    showEditor.value = true
                  },
                },
                { default: () => action.title ?? "編輯" }
              )
            }
            if (action.type === "delete") {
              return h(
                NPopconfirm,
                {
                  onPositiveClick: async () => {
                    if (!props.deleteMethod)
                      throw new Error("deleteMethod is not defined")
                    await props.deleteMethod(row)
                    await search()
                  },
                },
                {
                  trigger: () =>
                    h(
                      NButton,
                      {
                        type: "error",
                        size: "small",
                        secondary: true,
                      },
                      { default: () => action.title ?? "刪除" }
                    ),
                  default: () => "確定要刪除嗎？",
                }
              )
            }
            if (action.type === "nav") {
              if (!action.navToBuilder)
                throw new Error("navToBuilder is not defined")
              return h(
                RouterLink,
                {
                  to: action.navToBuilder(row),
                },
                {
                  default: () =>
                    h(
                      NButton,
                      {
                        type: "default",
                        size: "small",
                        secondary: true,
                      },
                      { default: () => action.title ?? "前往" }
                    ),
                }
              )
            }
          })
        )
      },
    },
  ]

  return columns
})

const showCreator = ref(false)
const showEditor = ref(false)
const editorItem = ref<TItem>()
const editorTitle = computed(
  () =>
    (editorItem.value && props.editor?.titleBuilder?.(editorItem.value)) ??
    "編輯"
)
async function editorModelLoader() {
  if (!editorItem.value || !props.editor)
    throw new Error("editorItem or editor is not defined")
  return await props.editor.modelBuilder(editorItem.value)
}
async function editorModelSubmit(model: TUpdaterModel) {
  if (!editorItem.value || !props.editor)
    throw new Error("editorItem or editor is not defined")
  await props.editor.method(model, editorItem.value)
}
</script>
