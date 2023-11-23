class AppEnv {
  SITE_ID = "SITE_ID"
  DOORMAN_URL =
    "https://ai-demo.ennowell.com/construction-site-management-doorman/"
  WORKER_REPO = "HTTP"
  MACHINERY_REPO = "HTTP"
  ATTENDANCE_REPO = "HTTP"
  INVENTORY_MANAGER_URL =
    "https://ai-demo.ennowell.com/construction-site-management-inventory/"
  PURCHASE_REPO = "HTTP"
  INVENTORY_REPO = "HTTP"
  FILE_STORAGE_URL = "http://localhost:8080/api/v1/files/"
  FILE_REPO = "FAKE" // "HTTP"
  SITE_URL = "https://ai-demo.ennowell.com/construction-site-management-site/"
  SITE_REPO = "HTTP"
  CONTRACTOR_REPO = "HTTP"
  SAFETY_EVENT_REPO = "HTTP"

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
