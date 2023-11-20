export class Lock {
  private promiseQueue = [] as (() => void)[]
  private acquired = false

  acquireAsync() {
    return new Promise<void>((resolve) => {
      if (this.acquired) {
        this.promiseQueue.push(resolve)
      } else {
        this.acquired = true
        resolve()
      }
    })
  }

  release() {
    if (!this.acquired) throw new Error(`Cannot release an unacquired lock`)

    const resolve = this.promiseQueue.shift()
    if (resolve) resolve()
    else this.acquired = false
  }
}

export class DoubleCheckLock {
  private lock = new Lock()

  async checkAndRunAsync<T>(check: () => boolean, run: () => Promise<T>) {
    if (!check()) return
    await this.lock.acquireAsync()
    if (!check()) {
      this.lock.release()
      return
    }
    await run()
    this.lock.release()
  }
}
