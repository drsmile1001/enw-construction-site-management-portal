<template>
  <div class="mb-2 flex justify-between">
    <div class="w-1/2">
      <NInputGroup>
        <NInput />
        <NButton type="primary" ghost> 搜尋 </NButton>
      </NInputGroup>
    </div>
    <div>
      <NButtonGroup>
        <NButton
          v-for="action in topRightActions"
          @click="() => handleAction(action, -1)"
        >
          {{ action.label }}
        </NButton>
      </NButtonGroup>
    </div>
  </div>
  <NTable>
    <thead>
      <template v-if="columns">
        <th v-for="col in columns">
          {{ col }}
        </th>
      </template>
      <th v-else>項目名稱</th>
      <th>動作</th>
    </thead>
    <tbody>
      <tr v-for="n in 10">
        <template v-if="columns">
          <td v-for="col in columns">
            {{ itemName ?? "項目" }} {{ col }} {{ n }}
          </td>
        </template>
        <td v-else>{{ itemName ?? "項目" }} {{ n }}</td>
        <td>
          <NButtonGroup size="small">
            <NButton
              v-for="action in actions"
              @click="() => handleAction(action, n)"
            >
              {{ action.label }}
            </NButton>
          </NButtonGroup>
        </td>
      </tr>
    </tbody>
  </NTable>
  <FakeEditorModal
    v-model:show="showEditModal"
    :fields="editorModalFields"
    :title="editorModalTitle"
  />
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { useDialog } from "naive-ui"
const router = useRouter()
const dialog = useDialog()
type ActionOption = {
  label: string
  type?: "modal" | "link" | "editor" | "confirm-delete"
  toRouteName?: string
  toRouteParamName?: string
  editorFields?: string[]
}

export type FakeTableViewProps = {
  actions: ActionOption[]
  itemName?: string
  columns?: string[]
  topRightActions?: ActionOption[]
}

const props = defineProps<FakeTableViewProps>()

const showEditModal = ref(false)
const editorModalFields = ref<string[]>([])
const editorModalTitle = computed(() => "編輯" + (props.itemName ?? "項目"))

function handleAction(action: ActionOption, id: number) {
  if (action.type === "modal") {
    showEditModal.value = true
  }
  if (action.type === "editor") {
    editorModalFields.value = action.editorFields ?? ["name", "description"]
    showEditModal.value = true
  }
  if (action.type === "link") {
    router.push({
      name: action.toRouteName,
      params: {
        ...router.currentRoute.value.params,
        [action.toRouteParamName ?? "id"]: id,
      },
    })
  }
  if (action.type === "confirm-delete") {
    dialog.warning({
      title: "確認刪除",
      content: "確定要刪除嗎？",
      positiveText: "確定",
      negativeText: "取消",
    })
  }
}
</script>
