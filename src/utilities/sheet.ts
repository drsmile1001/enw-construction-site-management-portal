import { utils, writeFile } from "xlsx"
export type SheetColumnOption<TItem extends Record<string, unknown>> = {
  name: string
  selector:
    | keyof TItem
    | ((item: TItem) => any)
    | ((item: TItem) => Promise<any>)
  ref?: (key: string, item: TItem) => Promise<any>
}

export type exportXlsxOption<TItem extends Record<string, unknown>> = {
  sheet: string
  outputFileName: string
  columnOptions: SheetColumnOption<TItem>[]
  fetcher: AsyncGenerator<TItem[]>
}

export function buildFetcher<TItem>(
  queryMethod: (page: number) => Promise<{
    items: TItem[]
    total: number
  }>
) {
  async function* fetcher() {
    let fetched = 0
    let page = 0
    while (true) {
      page++
      const { items, total } = await queryMethod(page)
      fetched += items.length
      yield items
      if (fetched >= total) {
        return
      }
    }
  }

  return fetcher()
}

export async function exportXlsx<TItem extends Record<string, unknown>>(
  options: exportXlsxOption<TItem>
) {
  const data: TItem[] = []
  for await (const items of options.fetcher) {
    data.push(...items)
  }

  const rows: any[][] = [
    options.columnOptions.map((columnOption) => columnOption.name),
  ]

  for (const item of data) {
    const row = []
    for (const { selector } of options.columnOptions) {
      let value
      if (selector instanceof Function) {
        value = await Promise.resolve(selector(item))
      } else {
        value = item[selector]
      }
      if (value instanceof Date) {
        value = {
          t: "n",
          z: "yyyy-mm-dd hh:mm:ss",
          v: dateToExcelDate(value),
        }
      }
      row.push(value)
    }
    rows.push(row)
  }
  const workbook = utils.book_new()
  const worksheet = utils.aoa_to_sheet(rows)
  worksheet["!cols"] = options.columnOptions.map(() => ({ width: 20 }))
  utils.book_append_sheet(workbook, worksheet, options.sheet)
  writeFile(workbook, options.outputFileName)
}

function dateToExcelDate(date: Date) {
  return (
    (date.valueOf() - date.getTimezoneOffset() * 60 * 1000) / 86400000 + 25569
  )
}
