export type QueryBase = {
  keyword?: string
  ids?: string[]
  skip?: number
  take?: number
}

export interface QueryResult<T> {
  total: number
  items: T[]
}
