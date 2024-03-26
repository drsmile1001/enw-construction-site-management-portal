<template>
  <div
    class="absolute inset-0 p-6 grid grid-cols-4 gap-6 grid-rows-3 bg-assets-[cityscap.png] bg-no-repeat bg-bottom"
  >
    <DashboardGroup title="安全監控" class="col-span-3 row-span-2">
      <div class="grow grid grid-cols-3 grid-rows-3 gap-4">
        <DashboardItem
          v-for="t in safetyEventTypes"
          :key="t"
          :title="t"
          :level="safetyEventMap.get(t) ? 'warning' : 'success'"
          :icon="safetyEventMap.get(t) ? 'AlertCircle' : 'CheckmarkCircle'"
          :description="safetyEventMap.get(t)?.description ?? '一切正常'"
        />
      </div>
    </DashboardGroup>
    <DashboardGroup title="進場管理" class="row-span-2">
      <div class="grow grid grid-rows-3 gap-2">
        <DashboardItem
          title="本日進場人數"
          :indicator="workerInsite.toString()"
        >
        </DashboardItem>
        <DashboardItem
          title="本日進場機具數"
          :indicator="machineryInsite.toString()"
        >
        </DashboardItem>
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

<script setup lang="ts">
import { useAttendanceRepo } from "@/stores/AttendanceRepo"
import { SafetyEvent, useSafetyEventRepo } from "@/stores/SafetyEventRepo"
import { addHours } from "date-fns"

const attendanceRepo = useAttendanceRepo()
const safetyEventRepo = useSafetyEventRepo()

const polling = setInterval(() => fetchData(), 10000)
onUnmounted(() => {
  clearInterval(polling)
})

const workerInsite = ref(0)
const machineryInsite = ref(0)
const safetyEventMap = ref<Map<string, SafetyEvent>>(new Map())
const safetyEventTypes = [
  "危險區域入侵",
  "跌倒偵測",
  "煙火偵測",
  "未帶安全帽",
  "熱傷害風險",
]

async function fetchData() {
  workerInsite.value = await attendanceRepo.getTotalInsite("worker")
  machineryInsite.value = await attendanceRepo.getTotalInsite("machinery")
  const now = new Date()
  const pastHour = addHours(now, -1)
  const { items: events } = await safetyEventRepo.query({
    range: [pastHour.valueOf(), now.valueOf()],
    alarm_types: safetyEventTypes,
  })
  safetyEventMap.value = new Map(
    events.map((event) => [event.alarm_type, event])
  )
}
fetchData()
</script>
