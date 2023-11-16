import { env } from "@/environment"
import { uploadFile } from "@/utilities/xhr"
export interface FileRepo {
  buildFileUrl(path: string, fileName: string): string
  put(
    path: string,
    file: File,
    onProgress?: (percent: number) => any
  ): Promise<FileInfo>
}

export type FileInfo = {
  path: string
  filename: string
  url: string
}

export type Uploadable = {
  value: string | string[] | null
}

class HttpFileRepo implements FileRepo {
  buildFileUrl(path: string, fileName: string): string {
    return `${env.FILE_STORAGE_URL}${path}/${fileName}`
  }
  async put(
    path: string,
    file: File,
    onProgress?: ((percent: number) => any) | undefined
  ): Promise<FileInfo> {
    await uploadFile(file, `${env.FILE_STORAGE_URL}${path}`, onProgress)
    return {
      path,
      filename: file.name,
      url: this.buildFileUrl(path, file.name),
    }
  }
}

class FakeFileRepo implements FileRepo {
  private total = 0
  private pathIdMap = new Map<string, number>([])

  constructor() {
    JSON.parse(localStorage.getItem("FakeFileRepo") || "[]").forEach(
      ([key, id]: [string, number]) => {
        this.pathIdMap.set(key, id)
      }
    )
  }

  private fullPath(path: string, fileName: string) {
    return `${path}/${fileName}`
  }

  buildFileUrl(path: string, fileName: string): string {
    const key = this.fullPath(path, fileName)
    const id = this.pathIdMap.get(key)
    if (id === undefined) {
      throw new Error(`File not found: ${key}`)
    }
    return `https://api.slingacademy.com/public/sample-photos/${id}.jpeg`
  }

  async put(
    path: string,
    file: File,
    onProgress?: (percent: number) => any
  ): Promise<FileInfo> {
    this.total++
    const id = this.total
    const key = this.fullPath(path, file.name)
    this.pathIdMap.set(key, id)
    localStorage.setItem("FakeFileRepo", JSON.stringify([...this.pathIdMap]))
    let percent = 0

    return await new Promise<FileInfo>((resolve) => {
      const timer = setInterval(() => {
        percent += 10
        onProgress?.(percent)
        if (percent < 100) return
        clearInterval(timer)
        resolve({
          path,
          filename: file.name,
          url: `https://api.slingacademy.com/public/sample-photos/${id}.jpeg`,
        })
      }, 100)
    })
  }
}

let fileRepo: FileRepo | undefined

export function useFileRepo(): FileRepo {
  if (!fileRepo) {
    fileRepo =
      env.FILE_REPO === "HTTP" ? new HttpFileRepo() : new FakeFileRepo()
  }
  return fileRepo
}
