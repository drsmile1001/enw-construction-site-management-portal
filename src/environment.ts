class AppEnv {
  HOST = "http://localhost:5804/"
  API_HOST = ""
  FILE_SERVICE = ""

  constructor() {
    Object.keys(this).forEach((key) => {
      const meta = document.querySelector(`meta[name="${key}"]`)
      if (!meta) return
      const content = meta.getAttribute("content")
      if (!content) return
      ;(this as any)[key] = content
    })

    console.debug("env", this)
  }
}

export const env = new AppEnv()
export const ITEMS_PER_PAGE = 15
