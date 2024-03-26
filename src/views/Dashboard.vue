<template>
  <div
    class="absolute inset-0 p-6 grid grid-cols-4 gap-6 grid-rows-3 bg-assets-[cityscap.png] bg-no-repeat bg-bottom"
  >
    <DashboardGroup title="安全監控" class="col-span-3 row-span-2">
      <div class="grow grid grid-cols-3 grid-rows-3 gap-4">
        <DashboardItem title="危險區域入侵" indicator="正常" />
        <DashboardItem title="跌倒偵測" indicator="正常" />
        <DashboardItem title="煙火偵測" indicator="正常" />
        <DashboardItem title="未帶安全帽" indicator="正常" />
        <DashboardItem
          title="熱傷害風險"
          indicator="中度"
          description="風險值 2"
        />
      </div>
    </DashboardGroup>
    <DashboardGroup title="進場管理" class="row-span-2">
      <div class="grow grid grid-rows-3 gap-2">
        <DashboardItem title="本日進場人數" indicator="20"> </DashboardItem>
        <DashboardItem title="本日進場機具數" indicator="3"> </DashboardItem>
      </div>
    </DashboardGroup>
    <DashboardGroup title="環境監控" class="col-span-4">
      <div class="grow grid grid-cols-4 gap-2">
        <DashboardItem title="溫度" indicator="30"> </DashboardItem>
        <DashboardItem title="溼度" indicator="70"> </DashboardItem>
        <DashboardItem title="PM 2.5" indicator="20"> </DashboardItem>
        <DashboardItem title="噪音" indicator="65"> </DashboardItem>
      </div>
    </DashboardGroup>
  </div>
</template>
