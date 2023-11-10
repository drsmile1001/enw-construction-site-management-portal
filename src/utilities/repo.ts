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

export interface Repo<
  TEntity,
  TQuery extends QueryBase,
  TCreateCommand,
  TUpdateCommand,
  TID = string
> {
  query(query: TQuery): Promise<QueryResult<TEntity>>
  get(id: TID): Promise<TEntity>
  create(command: TCreateCommand): Promise<void>
  update(id: TID, command: TUpdateCommand): Promise<void>
  delete(id: TID): Promise<void>
}

export abstract class FakeRepo<
  TEntity,
  TQuery extends QueryBase,
  TCreateCommand,
  TUpdateCommand,
  TID = string
> implements Repo<TEntity, TQuery, TCreateCommand, TUpdateCommand, TID>
{
  private readonly items: TEntity[] = []
  private getRepoName() {
    return this.constructor.name
  }

  constructor() {
    JSON.parse(localStorage.getItem(this.getRepoName()) ?? "[]").forEach(
      (item: TEntity) => {
        this.items.push(item)
      }
    )
  }

  private save() {
    localStorage.setItem(this.getRepoName(), JSON.stringify(this.items))
  }

  abstract queryPredicate(query: TQuery): (item: TEntity) => boolean
  async query(query: TQuery): Promise<QueryResult<TEntity>> {
    const filtered: TEntity[] = this.items.filter(this.queryPredicate(query))
    const skip = query.skip ?? 0
    const take = query.take ?? 15
    return {
      items: filtered.slice(skip, skip + take),
      total: filtered.length,
    }
  }

  abstract idPredicate(id: TID): (item: TEntity) => boolean
  async get(id: TID): Promise<TEntity> {
    const item = this.items.find(this.idPredicate(id))
    if (!item) {
      throw new Error("Not found")
    }
    return item
  }

  abstract createItem(command: TCreateCommand): TEntity

  async create(command: TCreateCommand): Promise<void> {
    const item = this.createItem(command)
    this.items.push(item)
    this.save()
  }

  updateItem(item: NonNullable<TEntity>, command: TUpdateCommand) {
    Object.assign(item, command)
  }

  async update(id: TID, command: TUpdateCommand): Promise<void> {
    const item = this.items.find(this.idPredicate(id))
    if (!item) {
      throw new Error("Not found")
    }
    this.updateItem(item, command)
    const newItem = { ...item }
    const index = this.items.findIndex(this.idPredicate(id))
    this.items[index] = newItem
    this.save()
  }

  async delete(id: TID): Promise<void> {
    const index = this.items.findIndex(this.idPredicate(id))
    if (index === -1) {
      throw new Error("Not found")
    }
    this.items.splice(index, 1)
    this.save()
  }
}
