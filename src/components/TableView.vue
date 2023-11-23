<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between">
      <div class="w-1/2">
        <slot name="search-bar" :search="search" :query="query">
          <SearchBar
            :query="query"
            :fields="queryFields"
            @update:query="(q) => search(q, 1)"
          />
        </slot>
      </div>
      <div class="flex gap-2">
        <NButton
          v-if="creator"
          type="primary"
          @click="() => (showCreator = true)"
        >
          新增
        </NButton>
        <slot name="page-actions" :search="search" :query="query"></slot>
      </div>
    </div>
    <NDataTable
      remote
      size="small"
      :columns="columns"
      :row-key="rowKey"
      :data="items"
      :pagination="pagination"
      @update:page="(p) => search(undefined, p)"
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
  generic="TItem extends RowData, TQuery extends Record<string,unknown>, TCreatorModel extends DynamicFormModel, TEditorModel extends DynamicFormModel"
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
  type RouteLocationRaw,
  type LocationQuery,
} from "vue-router"
import { ITEMS_PER_PAGE } from "@/environment"
import { NButton, NPopconfirm, type PaginationProps } from "naive-ui"
import { RouterLink } from "vue-router"
import type { DynamicFormItemOption, DynamicFormModel } from "./DynamicForm.vue"
import type { SearchBarAdvancedFieldOption } from "./SearchBar.vue"

export type TableViewColumn<TItem> = TableBaseColumn<TItem> & {
  key: keyof TItem
}

export type TableViewProps<
  TItem,
  TCreatorModel extends DynamicFormModel,
  TEditorModel extends DynamicFormModel,
  TQuery
> = {
  columns: TableViewColumn<TItem>[]
  rowKey: CreateRowKey<TItem>
  queryItems: (
    query: TQuery,
    page: number
  ) => Promise<{
    items: TItem[]
    total: number
  }>
  queryFields?: SearchBarAdvancedFieldOption<TQuery>[]
  creator?: CreatorOptions<TCreatorModel>
  editor?: EditorOptions<TItem, TEditorModel>
  rowActions?: RowActionOptions<TItem>[]
  deleteMethod?: (item: TItem) => Promise<void>
}

export type CreatorOptions<TCreatorModel extends DynamicFormModel> = {
  fields: DynamicFormItemOption<TCreatorModel>[]
  modelBuilder: () => Promise<TCreatorModel>
  method: (model: TCreatorModel) => Promise<void>
}

export type EditorOptions<TItem, TUpdaterModel extends DynamicFormModel> = {
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
const props =
  defineProps<TableViewProps<TItem, TCreatorModel, TEditorModel, TQuery>>()

const page = computed(() =>
  currentRoute.query.page ? Number(currentRoute.query.page) : 1
)
const query = computed(() => {
  const query: TQuery = {} as TQuery
  if (props.queryFields) {
    for (const field of props.queryFields) {
      if (currentRoute.query[field.key]) {
        query[field.key] = field.parser(currentRoute.query[field.key] as string)
      }
    }
  } else {
    ;(query as any).keyword = currentRoute.query.keyword as string
  }

  return query
})
const items = ref([]) as Ref<TItem[]>
const total = ref<number>(0)
const pagination = computed<PaginationProps>(() => ({
  page: page.value,
  pageSize: ITEMS_PER_PAGE,
  pageCount: Math.ceil(total.value / ITEMS_PER_PAGE),
}))

async function search(changeQuery?: TQuery, changePage?: number) {
  const newQuery = {
    ...query.value,
    ...(changeQuery ?? {}),
  } as TQuery

  if (changeQuery || changePage) {
    const urlQuery: LocationQuery = {}
    if (props.queryFields) {
      for (const field of props.queryFields) {
        const value = field.stringify(newQuery[field.key])
        if (!value) continue
        urlQuery[field.key] = value
      }
    } else {
      if (newQuery.keyword) {
        urlQuery.keyword = newQuery.keyword as string
      }
    }
    urlQuery.page = (changePage ?? page.value).toString()
    await router.push({
      query: urlQuery,
    })
  }

  const { items: queried, total: t } = await props.queryItems(
    newQuery,
    page.value
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
async function editorModelSubmit(model: TEditorModel) {
  if (!editorItem.value || !props.editor)
    throw new Error("editorItem or editor is not defined")
  await props.editor.method(model, editorItem.value)
}
</script>
