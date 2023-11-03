const timeWithZoneRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)([+-])(\d{2}):(\d{2})$/

//參考：https://blog.darkthread.net/blog/jsonnet-datetimekind-issue-solution/

export function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string") {
    const match = timeWithZoneRegex.exec(value)

    if (match) {
      const dir = match[7] === "+" ? -1 : 1

      return new Date(
        Date.UTC(
          +match[1],
          +match[2] - 1,
          +match[3],
          +match[4] + dir * +match[8],
          +match[5] + dir * +match[9],
          +match[6]
        )
      )
    }
  }
  return value
}
