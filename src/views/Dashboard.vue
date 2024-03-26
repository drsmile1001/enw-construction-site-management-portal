<template>
  <div class="absolute inset-0 p-6 flex flex-col gap-4">
    <div class="text-4xl">工地名稱</div>
    <div class="grow grid grid-cols-4 gap-4 grid-rows-3">
      <div
        class="col-span-3 row-span-2 border border-secondary-300 rounded-xl p-4 flex flex-col gap-2"
      >
        <div class="text-2xl">安全監控</div>
        <div class="grow grid grid-cols-3 grid-rows-3 gap-2">
          <div v-for="i in 9" class="bg-red">{{ i }}</div>
        </div>
      </div>
      <div
        class="row-span-2 border border-secondary-300 rounded-xl p-4 flex flex-col gap-2"
      >
        <div class="text-2xl">進場管理</div>
        <div class="grow grid grid-rows-3 gap-2">
          <div v-for="i in 3" class="bg-red">{{ i }}</div>
        </div>
      </div>
      <div
        class="col-span-4 border border-secondary-300 rounded-xl p-4 flex flex-col gap-2"
      >
        <div class="text-2xl">環境監控</div>
        <div class="grow grid grid-cols-4 gap-2">
          <div v-for="i in 4" class="bg-red">{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
