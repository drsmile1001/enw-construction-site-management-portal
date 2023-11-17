import ky, { HTTPError, type NormalizedOptions } from "ky"
import { formatISO } from "date-fns"
import { useUserStore } from "@/stores/User"
import type { KyInstance } from "node_modules/ky/distribution/types/ky"

export function buildParms(query: {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | null
    | undefined
    | (string | number | boolean | Date)[]
}) {
  const params = new URLSearchParams()

  function append(
    key: string,
    value: string | number | boolean | Date | null | undefined
  ) {
    if (value === "" || value === null || value === undefined) return
    if (value instanceof Date) params.append(key, formatISO(value))
    else params.append(key, value.toString())
  }

  for (const key in query) {
    const value = query[key]
    if (Array.isArray(value)) {
      for (const element of value) {
        append(key, element)
      }
      continue
    }
    append(key, value)
  }

  return params
}

export class BadRequestHTTPError extends HTTPError {
  constructor(
    response: Response,
    request: Request,
    options: NormalizedOptions,
    public errorCode: string
  ) {
    super(response, request, options)
  }
}

export async function tryGetErrorCode(error: unknown) {
  if (error instanceof HTTPError) {
    const errorCode = await error.response.json()
    if (typeof errorCode === "string") return errorCode
  }
  return undefined
}

export const kyWithBearerToken: KyInstance = ky.create({
  hooks: {
    beforeRequest: [
      async (request) => {
        const userStore = useUserStore()
        const token = await userStore.getAccessToken()
        request.headers.set("Authorization", `Bearer ${token}`)
      },
    ],
  },
})
