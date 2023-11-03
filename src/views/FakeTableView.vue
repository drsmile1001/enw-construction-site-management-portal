<template>
    <NTable>
        <thead>
            <th>項目名稱</th>
            <th>動作</th>
        </thead>
        <tbody>
            <tr v-for="n in 10">
                <td>{{ itemName ?? "項目" }} {{ n }}</td>
                <td>
                    <NButton v-for="action in actions" @click="() => handleAction(action, n)">
                        {{ action.label }}
                    </NButton>
                </td>
            </tr>
        </tbody>
    </NTable>
    <NModal v-model:show="showEditModal">
        <NCard style="width: 600px" title="Modal" :bordered="false" size="huge" role="dialog" aria-modal="true">
            <template #header-extra>
                噢！
            </template>
            内容
            <template #footer>
                尾部
            </template>
        </NCard>
    </NModal>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()
type ActionOption = {
    label: string,
    type?: "modal" | "link",
    toRouteName?: string
    toRouteParamName?: string
}

defineProps<{
    actions: ActionOption[],
    itemName?: string
}>()

const showEditModal = ref(false)

function handleAction(action: ActionOption, id: number) {
    if (action.type === "modal") {
        showEditModal.value = true
    }
    console.log(action, id)
    if (action.type === "link") {
        router.push({
            name: action.toRouteName,
            params: {
                ...router.currentRoute.value.params,
                [action.toRouteParamName ?? "id"]: id
            }
        })
    }
}
</script>