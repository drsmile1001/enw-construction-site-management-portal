<template>
    <NLayout position="absolute">
        <AppHeader />
        <NLayout class="absolute left-0 right-0 bottom-0 top-16" has-sider>
            <AppMenu />
            <NLayout :native-scrollbar="false">
                <div class="p-6">
                    <RouterView />
                </div>
            </NLayout>
        </NLayout>
    </NLayout>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import AppMenu from './AppMenu.vue';
</script>