import { env } from "@/environment"
import { FakeRepo, type QueryBase, type Repo } from "@/utilities/repo"
import { useEntityNameCache } from "./EntityNameCache"

export type Device = {
  id: string
  site_id: string
  name: string
}

export type SetDeviceCommand = Omit<Device, "site_id" | "id">

export interface DeviceRepo
  extends Repo<Device, QueryBase, SetDeviceCommand, SetDeviceCommand> {}

class FakeDeviceRepo extends FakeRepo<
  Device,
  QueryBase,
  SetDeviceCommand,
  SetDeviceCommand
> {
  queryPredicate(query: QueryBase): (item: Device) => boolean {
    return (item) => !query.keyword || item.name.includes(query.keyword)
  }
  idPredicate(id: string): (item: Device) => boolean {
    return (item) => item.id === id
  }
  createItem(command: SetDeviceCommand): Device {
    return {
      id: Math.random().toString(),
      site_id: env.SITE_ID,
      ...command,
    }
  }
  updateItem(item: Device, command: SetDeviceCommand): void {
    Object.assign(item, command)
    const nameCache = useEntityNameCache()
    nameCache.set(`Device:${item.id}`, item.name)
  }
}

let deviceRepo: DeviceRepo | undefined

export function useDeviceRepo() {
  if (deviceRepo) return deviceRepo
  deviceRepo = new FakeDeviceRepo()
  return deviceRepo
}

export function ensureDeviceNameCached(id: string): string {
  const nameCache = useEntityNameCache()
  const key = `Device:${id}`
  nameCache.ensureCached(key, async () => {
    const repo = useDeviceRepo()
    const item = await repo.get(id)
    return item.name
  })
  return key
}

export type DevicePoint = {
  site_id: string
  device_id: string
  id: string
  name: string
  trigger: string
  type: string
}

export type CreateDevicePointCommand = Omit<DevicePoint, "site_id">
export type UpdateDevicePointCommand = Omit<
  DevicePoint,
  "site_id" | "id" | "device_id"
>
export type DevicePointID = Pick<DevicePoint, "device_id" | "id">
export type DevicePointQuery = QueryBase & {
  device_id: string
}

export interface DevicePointRepo
  extends Repo<
    DevicePoint,
    DevicePointQuery,
    CreateDevicePointCommand,
    UpdateDevicePointCommand,
    DevicePointID
  > {}

class FakeDevicePointRepo extends FakeRepo<
  DevicePoint,
  DevicePointQuery,
  CreateDevicePointCommand,
  UpdateDevicePointCommand,
  DevicePointID
> {
  queryPredicate(query: DevicePointQuery): (item: DevicePoint) => boolean {
    return (item) =>
      (!query.keyword || item.name.includes(query.keyword)) &&
      item.device_id === query.device_id
  }
  idPredicate(id: DevicePointID): (item: DevicePoint) => boolean {
    return (item) => item.id === id.id && item.device_id === id.device_id
  }
  createItem(command: CreateDevicePointCommand): DevicePoint {
    return {
      site_id: env.SITE_ID,
      ...command,
    }
  }
}

let devicePointRepo: DevicePointRepo | undefined

export function useDevicePointRepo() {
  if (devicePointRepo) return devicePointRepo
  devicePointRepo = new FakeDevicePointRepo()
  return devicePointRepo
}

export const pointTypes = [
  "高溫",
  "風力",
  "電擊",
  "粉塵",
  "噪音",
  "位移",
  "漏水",
]
